# ==============================================================================
# AAMEN 2.0 Production Server Deploy Script (to 115.68.168.246 / aamen.net)
# Executed from C:\Dev\AAMEN
# ==============================================================================
$ErrorActionPreference = "Stop"
$root = "C:\Dev\AAMEN"
$deployDir = "$root\deploy"
$outDir = "$root\renewal\frontend\out"
$backendDir = "$root\renewal\backend"
$sourceDir = "$root\source"
$zipFile = "$root\deploy.zip"
$cleanUnzipFile = "$root\clean_unzip.php"

Write-Host ">>> [1/7] Preparing deploy folder..." -ForegroundColor Cyan
if (Test-Path $deployDir) {
    Remove-Item -Path $deployDir -Recurse -Force
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# 1. Frontend out copy
Write-Host ">>> [2/7] Copying frontend static files..." -ForegroundColor Cyan
Copy-Item -Path "$outDir\*" -Destination $deployDir -Recurse -Force

# 1-1. Copy ko/ contents to root for non-prefixed URLs
$koDir = "$deployDir\ko"
if (Test-Path $koDir) {
    Write-Host ">>> Copying ko/ folder contents to root for clean URLs..." -ForegroundColor Cyan
    Get-ChildItem -Path $koDir | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $deployDir -Recurse -Force
    }
}

# 2. Backend api copy
Write-Host ">>> [3/7] Copying backend PHP API files to api/..." -ForegroundColor Cyan
$apiDir = "$deployDir\api"
New-Item -ItemType Directory -Path $apiDir -Force | Out-Null
Copy-Item -Path "$backendDir\*" -Destination $apiDir -Recurse -Force

# 3. Lesson plans copy
$downloadsDir = "$deployDir\downloads\lessons"
New-Item -ItemType Directory -Path $downloadsDir -Force | Out-Null
if (Test-Path $sourceDir) {
    Get-ChildItem -Path $sourceDir -Filter "Lesson Plan *.docx" | ForEach-Object {
        Copy-Item -Path $_.FullName -Destination $downloadsDir -Force
    }
}

# 4. .htaccess creation
Write-Host ">>> [4/7] Generating production .htaccess..." -ForegroundColor Cyan
$htaccessContent = @"
Options -MultiViews
RewriteEngine On
RewriteBase /

# 1. Force HTTPS
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. Existing files and directories directly served
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 3. Clean API routes (e.g. /api/posts -> api/posts.php)
RewriteCond %{DOCUMENT_ROOT}/api/$1.php -f
RewriteRule ^api/([^/.]+)/?$ api/$1.php [L,QSA]

# 4. Next.js trailing slash directories
RewriteCond %{REQUEST_FILENAME}/index.html -f
RewriteRule ^(.*)$ $1/index.html [L]

# 5. Next.js HTML files
RewriteCond %{REQUEST_FILENAME}.html -f
RewriteRule ^(.*)$ $1.html [L]

# 6. Fallback
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ index.html [L]
"@
Set-Content -Path "$deployDir\.htaccess" -Value $htaccessContent -Encoding ascii

# 5. Zip packaging using ultra-fast and Linux-compatible tar.exe
Write-Host ">>> [5/7] Creating deploy.zip using tar.exe..." -ForegroundColor Cyan
if (Test-Path $zipFile) {
    Remove-Item $zipFile -Force
}

tar.exe -a -cf $zipFile -C $deployDir .
$zipSizeMB = [math]::Round(((Get-Item $zipFile).Length / 1MB), 2)
Write-Host "deploy.zip created successfully. Size: $zipSizeMB MB" -ForegroundColor Green

# 6. FTP Upload via System.Net.FtpWebRequest
Write-Host ">>> [6/7] Uploading clean_unzip.php and deploy.zip to FTP..." -ForegroundColor Cyan
$ftpHost = "115.68.168.246"
$ftpUser = "aamen1"
$ftpPass = "seungho0409#"

function Upload-FTPFile($localPath, $remoteFileName) {
    $uri = "ftp://$ftpHost/public_html/$remoteFileName"
    $fileSizeKB = [math]::Round(((Get-Item $localPath).Length / 1KB), 1)
    Write-Host "Uploading $remoteFileName ($fileSizeKB KB) to $uri ..."
    $request = [System.Net.FtpWebRequest]::Create($uri)
    $request.Credentials = New-Object System.Net.NetworkCredential($ftpUser, $ftpPass)
    $request.Method = [System.Net.WebRequestMethods+Ftp]::UploadFile
    $request.UseBinary = $true
    $request.UsePassive = $true
    
    $fileBytes = [System.IO.File]::ReadAllBytes($localPath)
    $request.ContentLength = $fileBytes.Length
    $reqStream = $request.GetRequestStream()
    $reqStream.Write($fileBytes, 0, $fileBytes.Length)
    $reqStream.Close()
    
    $response = $request.GetResponse()
    Write-Host "Upload complete: $($response.StatusDescription)" -ForegroundColor Green
    $response.Close()
}

# Upload clean_unzip.php first
Upload-FTPFile $cleanUnzipFile "clean_unzip.php"
# Upload deploy.zip
Upload-FTPFile $zipFile "deploy.zip"

# 7. Web Trigger Execution
Write-Host ">>> [7/7] Triggering unzip on remote server..." -ForegroundColor Cyan
Start-Sleep -Seconds 2
$unzipResult = Invoke-RestMethod -Uri "https://aamen.net/clean_unzip.php" -Method GET -TimeoutSec 60
Write-Host "Unzip Result: $($unzipResult | ConvertTo-Json)" -ForegroundColor Green

Write-Host ">>> Initializing Database (setup_db.php)..." -ForegroundColor Cyan
Start-Sleep -Seconds 1
$dbResult = Invoke-RestMethod -Uri "https://aamen.net/api/setup_db.php" -Method GET -TimeoutSec 30
Write-Host "DB Setup Result: $($dbResult | ConvertTo-Json)" -ForegroundColor Green

Write-Host ">>> ALL DEPLOYMENT TASKS COMPLETED SUCCESSFULLY! <<<" -ForegroundColor Green
