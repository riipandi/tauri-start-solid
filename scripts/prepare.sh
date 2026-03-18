#!/usr/bin/env sh
set -eu # Exit on error, treat unset variables as an error.

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
PACKAGE_NAME=$(node -p "require('$PROJECT_ROOT/package.json').name")
ENV_FILE="$PROJECT_ROOT/.env"
ENV_EXAMPLE="$PROJECT_ROOT/.env.example"
KEY_FILE="$PROJECT_ROOT/.tauri/${PACKAGE_NAME}_signer.key"
KEY_PUB_FILE="$PROJECT_ROOT/.tauri/${PACKAGE_NAME}_signer.key.pub"
TAURI_CONF_FILE="$PROJECT_ROOT/src-tauri/tauri.conf.json"

if [ "$(uname)" = "Darwin" ]; then
    SED_I="sed -i ''"
else
    SED_I="sed -i"
fi

FORCE=false
for arg in "$@"; do
    case $arg in
        --force)
            FORCE=true
            shift
            ;;
    esac
done

echo "==> Checking prerequisites..."

if ! command -v jq >/dev/null 2>&1; then
    echo "Error: jq is not installed. Please run: brew install jq (macOS) or apt install jq (Linux)"
    exit 1
fi

if [ ! -d "$PROJECT_ROOT/node_modules" ]; then
    echo "Error: node_modules not found. Please run: pnpm install"
    exit 1
fi

if [ ! -f "$PROJECT_ROOT/node_modules/.bin/tauri" ]; then
    echo "Error: Tauri CLI not found. Please run: pnpm install"
    exit 1
fi

echo "==> Setting up .env file..."
if [ ! -f "$ENV_FILE" ]; then
    if [ ! -f "$ENV_EXAMPLE" ]; then
        echo "Error: .env.example not found"
        exit 1
    fi
    cp "$ENV_EXAMPLE" "$ENV_FILE"
    echo "==> Created .env from .env.example"
fi

TAURI_CONF_EXAMPLE="$PROJECT_ROOT/src-tauri/tauri.conf.json.example"
echo "==> Setting up src-tauri/tauri.conf.json..."
if [ ! -f "$TAURI_CONF_FILE" ]; then
    if [ ! -f "$TAURI_CONF_EXAMPLE" ]; then
        echo "Error: tauri.conf.json.example not found"
        exit 1
    fi
    cp "$TAURI_CONF_EXAMPLE" "$TAURI_CONF_FILE"
    echo "==> Created src-tauri/tauri.conf.json from example"
fi

CURRENT_PUBLIC_KEY=$(grep "^TAURI_SIGNING_PUBLIC_KEY=" "$ENV_FILE" | cut -d'"' -f2)
if [ "$FORCE" = true ]; then
    echo "==> Force flag detected, regenerating Tauri signing key..."
    GENERATE_KEY=true
elif [ -n "$CURRENT_PUBLIC_KEY" ] && [ "$CURRENT_PUBLIC_KEY" != "CHANGE_ME_WITH_ACTUAL_PUBLIC_KEY_GENERATED_FROM_TAURI_SIGNER_GENERATE" ]; then
    echo "==> Tauri signing key already exists, skipping generation."
    GENERATE_KEY=false
else
    GENERATE_KEY=true
fi

if [ "$GENERATE_KEY" = true ]; then
    echo "==> Generating Tauri signing key..."
    if [ ! -d "$PROJECT_ROOT/.tauri" ]; then
        mkdir -p "$PROJECT_ROOT/.tauri"
    fi
    if [ -f "$KEY_FILE" ]; then
        rm -f "$KEY_FILE" "$KEY_PUB_FILE"
    fi

    TAURI_PASSWORD=$(openssl rand -base64 24 | tr -dc 'A-Za-z0-9' | head -c 32)
    pnpm --silent tauri signer generate -w "$KEY_FILE" -p "$TAURI_PASSWORD" --ci --force >/dev/null 2>&1

    if [ ! -f "$KEY_PUB_FILE" ]; then
        echo "Error: Failed to generate Tauri signing key"
        exit 1
    fi

    TAURI_PUBLIC_KEY=$(cat "$KEY_PUB_FILE" | tr -d '\n')
    TAURI_PRIVATE_KEY=$(cat "$KEY_FILE" | tr -d '\n')

    echo "==> Updating .env..."
    eval "$SED_I \"s|^TAURI_SIGNING_PUBLIC_KEY=.*|TAURI_SIGNING_PUBLIC_KEY=\\\"$TAURI_PUBLIC_KEY\\\"|\" \"$ENV_FILE\""
    eval "$SED_I \"s|^TAURI_SIGNING_PRIVATE_KEY=.*|TAURI_SIGNING_PRIVATE_KEY=\\\"$TAURI_PRIVATE_KEY\\\"|\" \"$ENV_FILE\""
    eval "$SED_I \"s|^TAURI_SIGNING_PRIVATE_KEY_PASSWORD=.*|TAURI_SIGNING_PRIVATE_KEY_PASSWORD=\\\"$TAURI_PASSWORD\\\"|\" \"$ENV_FILE\""

    echo "==> Updating src-tauri/tauri.conf.json..."
    jq --arg pubkey "$TAURI_PUBLIC_KEY" '.plugins.updater.pubkey = $pubkey' "$TAURI_CONF_FILE" > "$TAURI_CONF_FILE.tmp"
    mv "$TAURI_CONF_FILE.tmp" "$TAURI_CONF_FILE"

    echo "==> Formatting src-tauri/tauri.conf.json..."
    pnpm exec oxfmt --write "$TAURI_CONF_FILE" >/dev/null 2>&1

    echo ""
    echo "Done! Tauri signing key generated successfully."
    echo "Public key: $TAURI_PUBLIC_KEY"
    echo ""
fi
