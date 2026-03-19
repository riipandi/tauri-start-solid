#!/usr/bin/env sh
set -eu  # Exit on error, undefined variable = error

# =============================================================================
# CONFIGURATION
# =============================================================================

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
PACKAGE_NAME=$(jq -r '.name' "$PROJECT_ROOT/package.json")
PACKAGE_VERSION=$(jq -r '.version' "$PROJECT_ROOT/src-tauri/tauri.conf.json")
PRODUCT_NAME=$(jq -r '.productName' "$PROJECT_ROOT/src-tauri/tauri.conf.json")

# Build configuration (can be overridden via env)
BUILD_MODE="${BUILD_MODE:-release}"   # debug | release
CHANNEL="${CHANNEL:-stable}"          # stable | canary

# Build target (auto-detect platform)
OS="$(uname -s | tr '[:upper:]' '[:lower:]')"
ARCH="$(uname -m)"

# Normalize arch names
case "$ARCH" in
    arm64|aarch64) ARCH="aarch64" ;;
    x86_64|amd64) ARCH="x86_64" ;;
    *) ARCH="$(uname -m)" ;;
esac

# Directory paths
TARGET_DIR="$PROJECT_ROOT/src-tauri/target/$BUILD_MODE/bundle"
ARTIFACT_DIR="$PROJECT_ROOT/dist/artifacts"
WORK_DIR="$PROJECT_ROOT/dist/work"

# =============================================================================
# LOAD ENVIRONMENT
# =============================================================================

# Load .env file if exists
if [ -f "$PROJECT_ROOT/.env" ]; then
    set -a  # Automatically export all variables
    . "$PROJECT_ROOT/.env"
    set +a
fi

# S3 Configuration
S3_BUCKET="${S3_BUCKET_DEFAULT:-canary}"
S3_ENDPOINT="${S3_ENDPOINT_URL:-http://localhost:9100}"
S3_PUBLIC_URL="${S3_PUBLIC_URL:-http://localhost:9180}"
S3_REGION="${S3_REGION:-auto}"
S3_PATH_PREFIX="${S3_PATH_PREFIX:-null}"

# Calculate S3 paths
if [ "$S3_PATH_PREFIX" = "null" ] || [ -z "$S3_PATH_PREFIX" ]; then
    S3_CHANNEL_PATH="s3://$S3_BUCKET/$CHANNEL"
    PUBLIC_CHANNEL_URL="$S3_PUBLIC_URL/$CHANNEL"
else
    # Remove leading/trailing slashes from prefix using parameter expansion
    CLEAN_PREFIX="${S3_PATH_PREFIX#/}"  # Remove leading slash
    CLEAN_PREFIX="${CLEAN_PREFIX%/}"    # Remove trailing slash
    S3_CHANNEL_PATH="s3://$S3_BUCKET/$CLEAN_PREFIX/$CHANNEL"
    PUBLIC_CHANNEL_URL="$S3_PUBLIC_URL/$CLEAN_PREFIX/$CHANNEL"
fi

# =============================================================================
# HELPER FUNCTIONS
# =============================================================================

log_info() {
    echo "✓ $*" >&2
}

log_error() {
    echo "✗ ERROR: $*" >&2
    exit 1
}

# Detect platform string for update.json
get_platform_string() {
    local os="$1"
    local arch="$2"

    case "$os" in
        darwin) echo "darwin-$arch" ;;
        windows) echo "windows-$arch" ;;
        linux) echo "linux-$arch" ;;
        *) echo "$os-$arch" ;;
    esac
}

# Find bundle directory for platform
find_bundle_dir() {
    local target_os="$1"
    local target_arch="$2"

    # Tauri uses different platform names
    case "$target_os" in
        darwin)
            echo "$TARGET_DIR/macos"
            ;;
        windows)
            echo "$TARGET_DIR/nsis"
            ;;
        linux)
            # Try AppImage first, then deb
            if [ -d "$TARGET_DIR/appimage" ]; then
                echo "$TARGET_DIR/appimage"
            elif [ -d "$TARGET_DIR/deb" ]; then
                echo "$TARGET_DIR/deb"
            else
                log_error "No Linux bundle found"
            fi
            ;;
        *)
            log_error "Unsupported platform: $target_os"
            ;;
    esac
}

# Process artifact: rename and prepare for upload
process_artifact() {
    local bundle_dir="$1"
    local os="$2"
    local arch="$3"
    local mode="$4"

    log_info "Processing artifact: $os-$arch ($mode)"

    # Find the compressed bundle
    local artifact
    case "$os" in
        darwin)
            artifact=$(find "$bundle_dir" -name "*.app.tar.gz" -type f | head -1)
            ;;
        windows)
            artifact=$(find "$bundle_dir" -name "*.exe" -type f | head -1)
            ;;
        linux)
            artifact=$(find "$bundle_dir" -name "*.AppImage" -type f | head -1)
            ;;
    esac

    if [ -z "$artifact" ]; then
        log_error "Artifact not found in $bundle_dir"
    fi

    # Get file extension
    local ext="${artifact##*.}"
    if [ "$ext" = "gz" ]; then
        ext="tar.gz"
    fi

    # New filename
    local new_filename="${PACKAGE_NAME}_${PACKAGE_VERSION}_${os}_${arch}_${mode}.${ext}"
    local src_sig="${artifact}.sig"
    local dst_artifact="$ARTIFACT_DIR/$new_filename"
    local dst_sig="$ARTIFACT_DIR/${new_filename}.sig"

    # Copy artifact
    cp "$artifact" "$dst_artifact"
    log_info "Created: $dst_artifact"

    # Copy signature if exists
    if [ -f "$src_sig" ]; then
        cp "$src_sig" "$dst_sig"
        log_info "Created: $dst_sig"
    fi

    # Return values for manifest generation
    echo "$dst_artifact"
    echo "$dst_sig"
}

# Extract signature from file
extract_signature() {
    local sig_file="$1"

    if [ ! -f "$sig_file" ]; then
        echo "_REPLACE_WITH_SIGNATURE_"
        return
    fi

    # Signature is already base64 encoded
    cat "$sig_file" | tr -d '\n'
}

# Sync package.json version with tauri.conf.json
sync_package_version() {
    local tauri_version="$1"

    log_info "Syncing package.json version to $tauri_version"

    # Update package.json version using jq
    jq --arg v "$tauri_version" '.version = $v' "$PROJECT_ROOT/package.json" > "$PROJECT_ROOT/package.json.tmp"
    mv "$PROJECT_ROOT/package.json.tmp" "$PROJECT_ROOT/package.json"
    pnpm exec oxfmt --write "$PROJECT_ROOT/package.json" >/dev/null 2>&1

    log_info "✓ package.json updated to version $tauri_version"
}

# =============================================================================
# BUILD PHASE
# =============================================================================

build_app() {
    log_info "Building $PACKAGE_NAME v$PACKAGE_VERSION for $CHANNEL channel"

    cd "$PROJECT_ROOT"

    # Determine build command
    if [ "$BUILD_MODE" = "debug" ]; then
        pnpm --silent exec dotenv -v CI=true -- tauri build --debug
    else
        pnpm --silent exec dotenv -v CI=true -- tauri build
    fi

    log_info "Build completed"
}

# =============================================================================
# ARTIFACT PROCESSING PHASE
# =============================================================================

process_artifacts() {
    log_info "Processing artifacts"

    mkdir -p "$ARTIFACT_DIR"

    # Only process current platform (can be extended later)
    BUNDLE_DIR=$(find_bundle_dir "$OS" "$ARCH")

    if [ ! -d "$BUNDLE_DIR" ]; then
        log_error "Bundle directory not found: $BUNDLE_DIR"
    fi

    # Process artifact
    OUTPUT=$(process_artifact "$BUNDLE_DIR" "$OS" "$ARCH" "$BUILD_MODE")
    ARTIFACT_PATH=$(echo "$OUTPUT" | head -1)
    SIG_PATH=$(echo "$OUTPUT" | tail -1)

    # Store for manifest generation
    PROCESSED_ARTIFACT="$ARTIFACT_PATH"
    PROCESSED_SIG="$SIG_PATH"
}

# =============================================================================
# MANIFEST GENERATION PHASE
# =============================================================================

generate_update_manifest() {
    log_info "Generating update manifest"

    # Get platform string
    PLATFORM=$(get_platform_string "$OS" "$ARCH")

    # Get artifact filename
    ARTIFACT_FILENAME=$(basename "$PROCESSED_ARTIFACT")

    # Build URL
    ARTIFACT_URL="$PUBLIC_CHANNEL_URL/$ARTIFACT_FILENAME"

    # Extract signature
    SIGNATURE=$(extract_signature "$PROCESSED_SIG")

    # Get current date in ISO 8601 format
    PUB_DATE=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Generate update.json
    cat > "$ARTIFACT_DIR/update.json" << EOF
{
  "version": "$PACKAGE_VERSION",
  "notes": "Various improvements and bug fixes",
  "pub_date": "$PUB_DATE",
  "platforms": {
    "$PLATFORM": {
      "url": "$ARTIFACT_URL",
      "signature": "$SIGNATURE"
    }
  }
}
EOF

    log_info "Created: $ARTIFACT_DIR/update.json"
}

# =============================================================================
# S3 UPLOAD PHASE
# =============================================================================

upload_to_s3() {
    log_info "Uploading to S3: $S3_CHANNEL_PATH"

    # Configure AWS CLI
    export AWS_ACCESS_KEY_ID="$S3_ACCESS_KEY_ID"
    export AWS_SECRET_ACCESS_KEY="$S3_SECRET_ACCESS_KEY"
    export AWS_DEFAULT_REGION="$S3_REGION"

    # Upload artifacts
    for file in "$ARTIFACT_DIR"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            s3_path="$S3_CHANNEL_PATH/$filename"

            log_info "Uploading: $filename"

            aws s3 cp "$file" "$s3_path" \
                --endpoint-url "$S3_ENDPOINT" \
                --region "$S3_REGION" \
                --no-verify-ssl \
                --acl public-read \
                || log_error "Failed to upload $filename"
        fi
    done

    log_info "Upload completed"
    log_info "Public URL: $PUBLIC_CHANNEL_URL/update.json"
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    log_info "=== Distribution Build Script ==="
    log_info "Package: $PACKAGE_NAME v$PACKAGE_VERSION"
    log_info "Platform: $OS-$ARCH"
    log_info "Mode: $BUILD_MODE"
    log_info "Channel: $CHANNEL"
    log_info "S3 Path: $S3_CHANNEL_PATH"
    echo ""

    # Sync version before build
    sync_package_version "$PACKAGE_VERSION"

    # Execute phases
    build_app
    process_artifacts
    generate_update_manifest
    upload_to_s3

    echo ""
    log_info "=== Build Complete ==="
    log_info "Artifacts: $ARTIFACT_DIR"
    log_info "Update URL: $PUBLIC_CHANNEL_URL/update.json"
}

main "$@"
