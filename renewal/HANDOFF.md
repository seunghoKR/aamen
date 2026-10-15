# 🚀 AAMEN 리뉴얼 프로젝트 연속 작업 인수인계서 (HANDOFF.md)

> **버전:** `v2.1.0` (Production 실서버 라이브 배포 완료 🟢)  
> **최종 배포 일시:** 2026-10-12 (KST)  
> **실서버 운영 주소:** `https://aamen.net` (관리자 대시보드: `https://aamen.net/ko/admin/`)  
> **작성자:** AI 디자인실장 영자 (Youngja)  
> **동기화 경로:** 시놀로지 드라이브 (`SynologyDrive/AAMEN/renewal`)

---

## 📌 1. 프로젝트 운영 체계 및 환경 규칙

1. **실서버 운영 현황 및 절대 원칙 (CRITICAL RULE):**
   - **배포 절대 원칙:** 🚨 **대표님의 "실서버 배포" 명시적 지시가 없을 경우, 무조건 연구실(로컬 `C:\Dev\AAMEN\renewal\frontend`)에서만 작업 및 검증을 진행하며 실서버 배포를 임의로 진행하지 않습니다.**
   - **라이브 주소:** `https://aamen.net`
   - **배포 파이프라인 (명시적 지시가 있을 때만 실행):** `npm run build` ➡️ `python prepare_deploy.py` ➡️ `python zip_deploy.py` ➡️ `python upload_ftp.py prod` ➡️ `https://aamen.net/clean_unzip.php`
   - **대시보드 버전 표기:** 관리자 대시보드(`admin/page.tsx`)에 `v2.1.0 (Production)` 및 배포 메모 카드 배치 완료!
2. **개발 작업 디렉토리 (로컬 컴퓨터):**
   - 프론트엔드: `C:\Dev\AAMEN\renewal\frontend`
   - 백엔드(PHP API): `C:\Dev\AAMEN\renewal\backend`
3. **동기화 및 백업 저장소 (시놀로지 드라이브):**
   - `C:\Users\leesh\Documents\SynologyDrive\AAMEN\renewal`
   - 다른 컴퓨터로 이동 시 시놀로지 드라이브가 자동 동기화하므로, 작업 시작 전 로컬 개발 폴더로 복사하거나 동기화 상태를 확인합니다.
   - **동기화 명령어 (PowerShell/CMD):**
     ```powershell
     # Dev -> 시놀로지 드라이브 백업
     robocopy "C:\Dev\AAMEN\renewal" "C:\Users\leesh\Documents\SynologyDrive\AAMEN\renewal" /E /XO /XD .next node_modules .git
     
     # 새 컴퓨터에서: 시놀로지 -> Dev 복사
     robocopy "C:\Users\leesh\Documents\SynologyDrive\AAMEN\renewal" "C:\Dev\AAMEN\renewal" /E /XO /XD .next node_modules .git
     ```

---

## 💻 2. 연구실 실행 방법 (Getting Started on New Machine)

```bash
# 1. 프론트엔드 디렉토리로 이동
cd C:\Dev\AAMEN\renewal\frontend

# 2. 의존성 패키지 설치 (새 컴퓨터인 경우)
npm install

# 3. 로컬 연구실 개발 서버 실행
npm run dev
```

- **연구실 브라우저 접속 주소:**
  - 메인 랜딩: `http://localhost:3000/ko` (13개 언어 지원: `ko, en, id, th, vi, my, ja, zh-CN, zh-TW, hi, ne, km, lo`)
  - 관리자 대시보드: `http://localhost:3000/ko/admin`
  - 마이페이지: `http://localhost:3000/ko/member/mypage`
  - 커뮤니티: `http://localhost:3000/ko/community/notice/`

---

## 🔑 3. 주요 설정 정보 및 인증 키

### 1) 구글 로그인 OAuth 2.0 (Google AI Studio / Cloud Console)
- **클라이언트 ID:** `[SECURED / Google Cloud Console 참조]`
- **클라이언트 보안 비밀번호:** `[SECURED / Google Cloud Console 참조]`
- **리디렉션 URI:**
  - 개발(연구실): `http://localhost:3000/api/auth/callback/google`
  - 배포(실서버): `https://aamen.net/api/auth/callback/google`

### 2) AAMEN 공식 구글 캘린더 (Google Calendar)
- **관리자 계정:** `nuriohga@gmail.com`
- **공식 캘린더 ID:** `47b9a808f2d0ae426575ccdc371c17222415e37d95c8fe47578eed8a0512a789@group.calendar.google.com`
- **노출 페이지:** `/ko/network/schedule`, `/ko/schedule`
- **원클릭 구독 링크:** `https://calendar.google.com/calendar/render?cid=47b9a808f2d0ae426575ccdc371c17222415e37d95c8fe47578eed8a0512a789@group.calendar.google.com`

### 3) MariaDB 데이터베이스 및 API 프록시
- `frontend/next.config.ts`에 Next.js rewrites 설정 완료:
  - `/api/:path*` ➡️ PHP 백엔드 프록시 (`http://localhost/renewal/backend/:path*` 또는 클라우드 DB)
- `aamen_mariadb` 데이터베이스 테이블: `members`, `posts`, `comments`, `prayers`, `banners`, `popups`

---

## 🎨 4. 최근 완료된 주요 기능 및 화면 개편 사항

### 1) 메뉴 구조 개편 (5대 핵심 메뉴로 압축)
- **기존:** `공유된 신념 | 역사와 교회 | 여성과 평화 | 자료실 | 네트워크 | 커뮤니티`
- **개편:** `공유된 신념 | 역사와 교회 | 여성과 평화 | 네트워크 | 커뮤니티`
- **자료실 이동:** 상위 메뉴의 자료실을 **[커뮤니티 > 자료방]**으로 통합 연동.

### 2) 커뮤니티 4대 게시판 구축
- **공지사항:** 아시아 리더 전용 한국어(KO) & 영어(EN) 듀얼 라운지
- **자료방:** 5대 카테고리(`예배자료`, `교육자료`, `커리큘럼`, `서적/팜플렛`, `찬양자료`) + 13개국 언어별 국가 게시판 스위처
- **기도해요:** 13개국 실시간 기도의 벽 (기도제목 등록 & 아멘 중보 연대)
- **사진첩:** 기존 나눔터(자유게시판)를 폐지하고 사진첩 갤러리로 전환

### 3) 미디어/매거진 카드 스타일 UI 적용
- **역사와 교회 > 사진첩 (`/history/photos/`):**
  - 고해상도 현장 사진 + 사역 일시/장소 태그 + 상세 사역 스토리 + 참석 인원 정보가 함께 표시되는 매거진 카드 뷰
  - 사진 클릭 시 고화질 원본 반응형 라이트박스 팝업 연동
- **여성과 평화 > 행사 및 소식 (`/women-peace/events/`):**
  - 행사 썸네일 포스터 + 상태 뱃지(정기모임/접수중/진행예정) + 일시/장소/대상/개요 카드 뷰
  - [세부 일정 및 참가 안내] 클릭 시 상세 타임테이블 모달 연동

### 4) 리더 전용 한/영 2개 국어 전용 게시판
- **커뮤니티 > 공지사항 (`/community/announce/`)**
- **네트워크 > 협력단체 (`/network/associations/`)**
  - 영어가 가능한 리더/회원 전용으로 운영
  - `[🌐 전체(ALL) | 🇰🇷 한국어(KO) | 🇺🇸 English(EN)]` 전용 필터 탭 적용

### 5) 3대 핵심 알림 서비스 구축 (웹앱 푸시 · 텔레그램 · 왓츠앱)
- **통합 관리 모듈:** `src/lib/notifications.ts`
- **마이페이지 (`/member/mypage`):**
  - 상단 3대 알림 서비스 통합 관제 마스터 토글 바 (일괄 ON/OFF 및 일괄 저장)
  - **1. 웹앱 푸시 메시지 (PWA):** 브라우저 권한 상태 확인, 권한 요청, 테스트 팝업, 긴급 기도/공지 실시간 알림
  - **2. 텔레그램 봇 (@AAMEN_Notice_bot):** Chat ID / @사용자명 등록, [테스트 발송] 시뮬레이션, 긴급 기도 선별 수신
  - **3. 왓츠앱(WhatsApp):** 13개국 국가번호 선택기 + 휴대폰 번호 입력, [테스트 발송] 및 `wa.me` 웹 링크 열기, 다이렉트 긴급 기도 수신, 주간 다이제스트, 국가별 단체방 초대
- **내 프로필 탭 연동:** 프로필 정보에서 텔레그램 계정과 왓츠앱 번호 조회 및 수정 지원
- **관리자 회원 관리 (`/admin/members`):**
  - 회원 테이블에 ✈️ 텔레그램 계정과 💬 왓츠앱 번호 뱃지 표시
  - 신규 회원 직접 등록 시 메신저 계정 정보 입력 필드 추가

### 6) 버전 표시 관리
- 설정 파일: `src/config/version.ts`
- 현재 버전: `v2.1.0-lab` (빌드일시: 2026-10-12)
- 노출 위치: 사이트 푸터(`Footer.tsx`), GNB 로고 옆 뱃지(`Header.tsx`), 관리자 대시보드 사이드바 및 헤더(`admin/layout.tsx`, `admin/page.tsx`)

---

## 📋 5. 향후 다음 작업 계획 (TODO)

1. **PWA (Progressive Web App) 실서비스 패키징:**
   - 모바일 접속 시 "홈 화면에 추가(설치)" 팝업 활성화
   - `manifest.json`, 앱 아이콘(192x192, 512x512) 및 오프라인 캐싱 서비스 워커 검증
2. **13개국 WhatsApp 그룹 채팅방 링크 실배치:**
   - 각 국가별 게시판 및 사역자 단체방 실제 초대 링크(`https://chat.whatsapp.com/...`) 데이터베이스 연동
3. **실서버 배포 준비 (검증 완료 후):**
   - 실서버 Apache/Nginx 설정 및 SSL(HTTPS) 인증서 점검
   - MariaDB 프로덕션 스키마 마이그레이션 확인
   - 버전 태그 `v2.1.0-prod`로 전환

---

## 🗂️ 6. 핵심 파일 디렉토리 맵

```
renewal/
├── HANDOFF.md                   <-- 현재 인수인계 문서
├── backend/                     <-- PHP/MariaDB API 스크립트
└── frontend/
    ├── HANDOFF.md               <-- 프론트엔드 복사본
    ├── src/
    │   ├── config/
    │   │   └── version.ts       <-- v2.1.0-lab 버전 정의
    │   ├── lib/
    │   │   ├── notifications.ts <-- 3대 알림(푸시/텔레그램/왓츠앱) 관리 모듈
    │   │   ├── store.ts         <-- 회원/권한/배너 데이터 스토어
    │   │   └── auth.ts          <-- 구글/자체 인증 로직
    │   ├── components/
    │   │   ├── layout/Header.tsx, Footer.tsx
    │   │   ├── community/CommunityView.tsx (4대 게시판, 자료방 카테고리)
    │   │   ├── history/HistoryView.tsx (사진첩 미디어 리스트 + 라이트박스)
    │   │   ├── women-peace/WomenPeaceView.tsx (행사/소식 카드 + 모달)
    │   │   └── network/NetworkView.tsx (협력단체 영/한 라운지)
    │   └── app/[locale]/
    │       ├── member/mypage/page.tsx (3대 알림 설정 센터 & 프로필)
    │       └── admin/members/page.tsx (회원 관리 & 메신저 연동 뱃지)
```

> **인수인계 완료:** 새 컴퓨터에서 시놀로지 드라이브 동기화 후 `npm run dev`를 실행하시면 바로 연구실 화면을 이어보실 수 있습니다! 🚀✨
