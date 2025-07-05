# PowerShell script to clean up duplicate and unnecessary files/folders from the root directory

# Change to the script's directory
Set-Location -Path $PSScriptRoot

# List of items to remove from the root
$itemsToRemove = @(
    'index.js',
    'deploy-commands.js',
    'package.json',
    'package-lock.json',
    'node_modules',
    'commands'
)

foreach ($item in $itemsToRemove) {
    $fullPath = Join-Path -Path $PSScriptRoot -ChildPath $item
    if (Test-Path $fullPath) {
        if ((Get-Item $fullPath).PSIsContainer) {
            Remove-Item $fullPath -Recurse -Force
            Write-Host "Deleted folder: $item"
        } else {
            Remove-Item $fullPath -Force
            Write-Host "Deleted file: $item"
        }
    } else {
        Write-Host "$item does not exist, skipping."
    }
}

Write-Host "Cleanup complete. Your workspace is now organized!"
