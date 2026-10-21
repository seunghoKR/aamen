@echo off
chcp 65001 > nul
title [출근/시작] 개발 환경 자동 동기화 & 실행
color 0B
echo ==============================================================
echo  🚀 AI 1인 기업 대표님을 위한 초고속 자동 시작 시스템
echo ==============================================================
echo.

echo [1/3] ☁️ GitHub에서 최신 변경사항을 가져옵니다 (git pull)...
git pull origin main 2>nul
if %errorlevel% neq 0 (
    echo    ℹ️ 원격 저장소가 아직 연결되지 않았거나 최신 상태입니다.
) else (
    echo    ✅ 최신 코드 동기화 완료!
)
echo.

echo [2/3] 📦 라이브러리 상태를 점검합니다...
if not exist "node_modules" (
    echo    ⚠️ node_modules가 없습니다. 자동으로 패키지를 설치합니다...
    call npm install
    echo    ✅ 패키지 설치 완료!
) else (
    echo    ✅ 패키지가 이미 정상 준비되어 있습니다.
)
echo.

echo [3/3] 💻 로컬 개발 서버를 실행합니다 (npm run dev)...
echo.
echo ==============================================================
echo  브라우저에서 http://localhost:3000 접속하시면 됩니다!
echo  작업을 종료하시려면 이 창에서 Ctrl + C 를 누르세요.
echo ==============================================================
echo.
call npm run dev
