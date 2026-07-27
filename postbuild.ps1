# Post-build script: Fix HTML lang attribute
$distDir = "dist"
$files = Get-ChildItem -Path $distDir -Filter "*.html" -File

foreach ($file in $files) {
    $content = Get-Content -Path $file.FullName -Raw -Encoding UTF8
    $newContent = $content -replace '<html lang="en"', '<html lang="ko"'
    if ($content -ne $newContent) {
        Set-Content -Path $file.FullName -Value $newContent -NoNewline -Encoding UTF8
        Write-Host "Fixed lang attribute: $($file.Name)"
    }
}
