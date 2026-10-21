@echo off
chcp 65001 > nul
title [퇴근/마무리] 100% 안전 저장 & GitHub 자동 전송
color 0A
echo ==============================================================
echo  🔒 AI 1인 기업 대표님을 위한 100% 누락 방지 자동 저장 시스템
echo ==============================================================
echo.

echo [1/3] 📝 오늘 작업한 모든 변경 파일을 감지하고 추가합니다...
git add -A
git status -s
echo.

for /f "tokens=1-3 delims=-/ " %%a in ("%date%") do set mydate=%%a-%%b-%%c
for /f "tokens=1-2 delims=: " %%a in ("%time%") do set mytime=%%a:%%b
set commit_msg=Auto-sync: %mydate% %mytime%

echo [2/3] 💾 작업 내용을 안전하게 기록합니다 (%commit_msg%)...
git commit -m "%commit_msg%"
if %errorlevel% neq 0 (
    echo    ℹ️ 새로 변경된 내용이 없습니다. 이미 최신 상태입니다.
) else (
    echo    ✅ 로컬 저장 완료!
)
echo.

echo [3/3] ☁️ GitHub 원격 저장소로 즉시 전송합니다 (git push)...
git push origin main
if %errorlevel% equ 0 (
    echo.
    echo ==============================================================
    echo  🎉 축하합니다! 모든 작업이 1바이트 누락 없이 GitHub에 저장되었습니다!
    echo  이제 안심하시고 편안하게 퇴근(또는 귀가)하세요! 😊
    echo ==============================================================
) else (
    echo.
    echo  ⚠️ 깃허브 전송 중 확인이 필요합니다. (아직 GitHub 원격 주소가 등록되지 않았을 수 있습니다)
)
echo.
pause
