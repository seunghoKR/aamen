[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$Host.UI.RawUI.WindowTitle = "AAMEN [출근] 작업 준비 & 현황 브리핑"
Clear-Host
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host "  ✨ [AAMEN (아시아 아나뱁티스트 메노나이트 교육 네트워크)] 작업 준비 (출근) ✨" -ForegroundColor Yellow
Write-Host "======================================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "📌 프로젝트 : AAMEN (아시아 아나뱁티스트 메노나이트 교육 네트워크)" -ForegroundColor Cyan
Write-Host "🏷️ 프로젝트 버전 : v1.5.6 (Release)" -ForegroundColor Green
Write-Host ""

Write-Host "📋 [최근 작업 내용 메모]" -ForegroundColor Yellow
Write-Host "   * 쪽지함 실시간 다국어/초성/오타 허용(Fuzzy) 자동완성 검색 탑재" -ForegroundColor White
Write-Host "   * 회원 관리 체계 및 관리자 대시보드 권한 동기화" -ForegroundColor White
Write-Host "   * 협력기관(Partners) 및 네트워크 연동 관리 보완" -ForegroundColor White
Write-Host "   * Next.js 15개국 정적 배포 파이프라인 무결성 구축" -ForegroundColor White
Write-Host ""

Write-Host "🌐 [실서버 & 개발 환경 정보]" -ForegroundColor Yellow
Write-Host "   * 실서버 주소   : https://aamen.net" -ForegroundColor Cyan
Write-Host "   * 관리자 페이지 : https://aamen.net/admin" -ForegroundColor Gray
Write-Host "   * 백엔드 API    : https://aamen.net/api/ (PHP 8.4 + MariaDB)" -ForegroundColor Gray
Write-Host "   * 로컬 개발서버 : http://localhost:3000" -ForegroundColor White
Write-Host ""

Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "🔄 시놀로지 드라이브 원본과 최신 소스를 동기화합니다 (Pull)..." -ForegroundColor Green
$SynologyCandidates = @("Y:\SynologyDrive\AAMEN", "C:\Users\leesh\Documents\SynologyDrive\AAMEN")
$Source = $SynologyCandidates | Where-Object { Test-Path $_ } | Select-Object -First 1
$Destination = "C:\Dev\AAMEN"

if (-not $Source) {
    Write-Host "⚠️ 시놀로지 드라이브 원본 경로를 찾을 수 없습니다 (Y:\SynologyDrive\AAMEN 확인 필요)" -ForegroundColor Red
} else {
    Write-Host "📁 동기화 원본: $Source" -ForegroundColor Cyan
    $excludeDirs = @(".next", "node_modules", "dist", "out", "deploy", ".cache", ".turbo", ".git", "public_html", "backup", "source", "uploads")
    $excludeFiles = @("*.tar.gz", "*.tgz", "*.zip", "*.tmp", "*.log", "*.bak", "status_prod.json")
    robocopy $Source $Destination /E /XO /XD $excludeDirs /XF $excludeFiles /R:1 /W:1 /NP /NDL /NJH /NJS /nc /ns /np | Out-Null
    if ($LASTEXITCODE -lt 8) {
        Write-Host "✨ 최신 소스 동기화 완료! 안전하게 최신 코드로 맞춰졌습니다!" -ForegroundColor Green
    } else {
        Write-Host "⚠️ 동기화 중 일부 확인이 필요합니다 (ExitCode: $LASTEXITCODE)" -ForegroundColor Red
    }
}
Write-Host "----------------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

Write-Host "💡 로컬 개발 서버 실행 방법: cd renewal\frontend; npm run dev" -ForegroundColor Yellow
Write-Host ""
$choice = Read-Host "로컬 개발 서버를 지금 바로 실행할까요? (Y / N, 기본값: Y)"
if ($choice -eq "" -or $choice -eq "Y" -or $choice -eq "y") {
    Write-Host "`n🚀 로컬 개발 서버를 실행합니다..." -ForegroundColor Green
    Set-Location "$PSScriptRoot\renewal\frontend"
    Start-Process "http://localhost:3000"
    npm run dev
} else {
    Write-Host "준비 완료되었습니다! 작업하실 내용을 터미널에 알려주세요~ ✨" -ForegroundColor Cyan
    Read-Host "엔터(Enter) 키를 누르면 창을 닫습니다..."
}
