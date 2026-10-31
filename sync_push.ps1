[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "AAMEN [퇴근] 시놀로지 영구 백업"
Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  ✨ [AAMEN (아시아 아나뱁티스트 메노나이트 교육 네트워크)] 작업 마감 (퇴근) ✨" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  대표님, AAMEN 작업 정말 수고 많으셨습니다! 💖" -ForegroundColor Green
Write-Host "  작업하신 최신 코드를 시놀로지 영구 보관소로 안전하게 백업합니다!" -ForegroundColor White
Write-Host ""

$Source = "C:\Dev\AAMEN"
$SynologyCandidates = @("Y:\SynologyDrive\AAMEN", "C:\Users\leesh\Documents\SynologyDrive\AAMEN")
$Destination = $SynologyCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
if (-not $Destination) {
    $Destination = "Y:\SynologyDrive\AAMEN"
}

if (-not (Test-Path $Destination)) {
    New-Item -ItemType Directory -Path $Destination -Force | Out-Null
}

$excludeDirs = @(".next", "node_modules", "dist", "out", "deploy", ".cache", ".turbo", ".git", "public_html", "backup", "source", "uploads")
$excludeFiles = @("*.tar.gz", "*.tgz", "*.zip", "*.tmp", "*.log", "*.bak", "status_prod.json")

Write-Host "📁 백업 대상: $Destination" -ForegroundColor Cyan
Write-Host "🔄 시놀로지 드라이브로 백업 동기화 중..." -NoNewline -ForegroundColor White
robocopy $Source $Destination /E /XO /XD $excludeDirs /XF $excludeFiles /R:1 /W:1 /NP /NDL /NJH /NJS /nc /ns /np | Out-Null
if ($LASTEXITCODE -lt 8) {
    Write-Host " [동기화 완료 ✨]" -ForegroundColor Green
} else {
    Write-Host " [확인 필요 ⚠️]" -ForegroundColor Red
}

Write-Host ""
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  🎉 백업 동기화가 안전하게 완료되었습니다!" -ForegroundColor Yellow
Write-Host "  편안하고 포근한 시간 되세요~ 대표님 최고! 💖" -ForegroundColor Cyan
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""
Read-Host "엔터(Enter) 키를 누르면 창을 닫습니다..."
