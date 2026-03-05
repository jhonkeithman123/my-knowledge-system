Write-Host "🧹 Cleaning auto-generated files..." -ForegroundColor Cyan

function Remove-Directory {
    param($path)
    if (Test-Path $path) {
        Write-Host "  ❌ Removing $path" -ForegroundColor Yellow
        Remove-Item -Recurse -Force $path
    }
}

function Remove-File {
    param($path)
    if (Test-Path $path) {
        Write-Host "  ❌ Removing $path" -ForegroundColor Yellow
        Remove-Item -Force $path
    }
}

Write-Host ""
Write-Host "📦 Cleaning node_modules..." -ForegroundColor Cyan
# Root level
Remove-Directory "node_modules"

# Apps
Remove-Directory "apps/web/node_modules"
Remove-Directory "apps/server/node_modules"
Remove-Directory "apps/mobile/node_modules"

# Packages
Remove-Directory "packages/contracts/node_modules"
Remove-Directory "packages/db/node_modules"
Remove-Directory "packages/ui/node_modules"
Remove-Directory "packages/utils/node_modules"
Remove-Directory "packages/config/node_modules"

Write-Host ""
Write-Host "🏗️  Cleaning build artifacts..." -ForegroundColor Cyan
# Next.js build
Remove-Directory "apps/web/.next"

# TypeScript dist folders
Remove-Directory "packages/contracts/dist"
Remove-Directory "packages/db/dist"
Remove-Directory "packages/ui/dist"
Remove-Directory "packages/utils/dist"
Remove-Directory "packages/config/dist"

Write-Host ""
Write-Host "🗑️  Cleaning cache and temp files..." -ForegroundColor Cyan
# Turbo cache
Remove-Directory "node_modules/.cache"
Remove-Directory ".turbo"

# TypeScript build info
Get-ChildItem -Path . -Filter "*.tsbuildinfo" -Recurse -File | Remove-Item -Force
Write-Host "  ❌ Removed *.tsbuildinfo files" -ForegroundColor Yellow

# ESLint cache
Get-ChildItem -Path . -Filter ".eslintcache" -Recurse -File | Remove-Item -Force
Write-Host "  ❌ Removed .eslintcache files" -ForegroundColor Yellow

Write-Host ""
Write-Host "✨ Cleanup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "💡 Run 'pnpm install' to reinstall dependencies" -ForegroundColor Blue