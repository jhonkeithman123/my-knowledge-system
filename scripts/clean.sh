#!/bin/bash

echo "🧹 Cleaning auto-generated files..."

# Function to remove directories
remove_dir() {
  if [ -d "$1" ]; then
    echo "  ❌ Removing $1"
    rm -rf "$1"
  fi
}

# Function to remove files
remove_file() {
  if [ -f "$1" ]; then
    echo "  ❌ Removing $1"
    rm -f "$1"
  fi
}

echo ""
echo "📦 Cleaning node_modules..."
# Root level
remove_dir "node_modules"

# Apps
remove_dir "apps/web/node_modules"
remove_dir "apps/server/node_modules"
remove_dir "apps/mobile/node_modules"

# Packages
remove_dir "packages/contracts/node_modules"
remove_dir "packages/db/node_modules"
remove_dir "packages/ui/node_modules"
remove_dir "packages/utils/node_modules"
remove_dir "packages/config/node_modules"

echo ""
echo "🏗️  Cleaning build artifacts..."
# Next.js build
remove_dir "apps/web/.next"

# TypeScript dist folders
remove_dir "packages/contracts/dist"
remove_dir "packages/db/dist"
remove_dir "packages/ui/dist"
remove_dir "packages/utils/dist"
remove_dir "packages/config/dist"

echo ""
echo "🗑️  Cleaning cache and temp files..."
# Turbo cache
remove_dir "node_modules/.cache"
remove_dir ".turbo"

# TypeScript build info
find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null && echo "  ❌ Removed *.tsbuildinfo files"

# ESLint cache
find . -name ".eslintcache" -type f -delete 2>/dev/null && echo "  ❌ Removed .eslintcache files"

# DS_Store (macOS)
find . -name ".DS_Store" -type f -delete 2>/dev/null && echo "  ❌ Removed .DS_Store files"

echo ""
echo "✨ Cleanup complete!"
echo ""
echo "💡 Run 'pnpm install' to reinstall dependencies"