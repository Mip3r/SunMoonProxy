$file = "index.html"
$content = Get-Content -Raw $file
# Replace favicon absolute path
$content = $content -replace 'href="/favicon.ico"','href="favicon.ico"'
# Replace leading-slash asset references
$content = $content -replace '="/assets/', '="assets/'
$content = $content -replace "src='/assets/", "src='assets/"
# Replace img src occurrences
$content = $content -replace 'src="/assets/', 'src="assets/'
# Remove any <script> or <link> tags that reference /_astro (build artifacts not copied)
$content = [regex]::Replace($content, '<script[^>]*?/\\_astro[^>]*?>.*?<\\/script>', '', 'Singleline')
$content = [regex]::Replace($content, '<link[^>]*?href="/\\_astro[^"]*"[^>]*?>', '', 'Singleline')
# Also remove remaining /_astro module tags (self-closing)
$content = $content -replace '/_astro/', ''
Set-Content -Path $file -Value $content -Encoding UTF8
Write-Host "Patched $file"
