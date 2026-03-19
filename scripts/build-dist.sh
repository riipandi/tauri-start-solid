#!/usr/bin/env sh
set -eu # Exit on error, treat unset variables as an error.

PROJECT_ROOT=$(cd "$(dirname "$0")/.." && pwd)
PACKAGE_NAME=$(node -p "require('$PROJECT_ROOT/package.json').name")
PACKAGE_VERSION=$(node -p "require('$PROJECT_ROOT/package.json').version")
