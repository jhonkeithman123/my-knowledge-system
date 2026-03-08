#!/bin/bash

echo "🔥 DEEP CLEANING - This will remove lock files too!"
echo ""
read -p "Are you sure? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Cancelled"
    exit 1
fi

# Run regular clean first
bash ./scripts/clean.sh

echo ""
echo "🔒 Removing lock files..."
find . -name "bun.lockb" -type f -delete && echo "  ❌ Removed bun.lockb files"
find . -name "pnpm-lock.yaml" -type f -delete && echo "  ❌ Removed pnpm-lock.yaml files"
find . -name "package-lock.json" -type f -delete && echo "  ❌ Removed package-lock.json files"
find . -name "yarn.lock" -type f -delete && echo "  ❌ Removed yarn.lock files"

echo ""
echo "🔥 Deep clean complete!"
echo "💡 Run 'bun install' to regenerate lock files and install dependencies"