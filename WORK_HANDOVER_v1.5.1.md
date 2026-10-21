# AAMEN 프로젝트 개발 인수인계 및 작업 일지 (v1.5.1)

> **작성 일시:** 2026년 10월 20일  
> **버전:** `v1.5.1`  
> **운영 서버 URL:** [https://aamen.net](https://aamen.net)  
> **GitHub 저장소:** [https://github.com/seunghoKR/aamen.git](https://github.com/seunghoKR/aamen.git) (`main` 브랜치)  
> **담당:** AI 디자인실장 영자 (Youngja) & 개발팀

---

## 📌 1. 오늘(2026-10-20) 완료된 핵심 작업 내역

### 1) 대시보드 상단 배너 관리 개편 (`admin/banners/page.tsx`, `banners.php`)
1. **슬롯별 단독 저장 방식 전면 전환:**
   - 기존의 '전체 배너 저장' 버튼을 제거하고, 작업 중인 슬롯(예: 슬롯 #1)만 독립적으로 서버 DB에 저장하는 **`[슬롯 #X 저장]`** 버튼 구현.
   - 슬롯 1번을 수정하고 저장하면 슬롯 1번만 업데이트되며 다른 슬롯 데이터는 전혀 영향받지 않음.
2. **'기본값 초기화' 버튼 삭제:**
   - 관리자가 실수로 클릭하여 커스텀 배너 설정이 날아가지 않도록 초기화 버튼 완전 제거.
3. **'✨디자이너 추천 고화질 사진 프리셋' 완전 삭제:**
   - Unsplash 외부 프리셋 선택 영역을 삭제하고 깔끔한 UI로 정리.
4. **'내 PC 사진 업로드' 전용 방식으로 일원화:**
   - 복잡한 외부 URL 수동 입력란을 제거하고, 직관적인 내 컴퓨터 사진 파일 업로드 카드만 제공.
5. **추천 배너 이미지 규격 안내 간소화:**
   - 안내 문구를 대표님 요청에 맞춰 가장 깔끔한 2줄로 압축:
     - **최적 제작 규격:** `1920 × 600 px` (약 3:1 와이드 배너 비율, 데스크톱 노출 높이 620px에 최적화)
     - 💡 고화질 원본 사진을 업로드하셔도 웹 최적화 해상도로 자동 리사이즈 및 무손실 압축 처리됩니다.
6. **기존 관리자 업로드 배너 복원:**
   - 업로드 폴더에 남아있던 `banner_01` 및 `banner_05` 이미지(`/uploads/banners/...`)를 DB 및 설정에 정상 복원.

---

### 2) 회원 관리: 등급(레벨) 수동 저장 버튼 구현 (`admin/members/page.tsx`, `members.php`)
- **문제점 해결:** 등급 드롭다운 변경 시 실시간 비동기 저장 과정에서 이전 상태로 되돌아가던 버그 해결.
- **개선 사항:**
  - 회원의 레벨을 변경한 후 우측의 **[저장]** 버튼을 직접 클릭해야 최종 서버에 반영되는 수동 저장 UX 적용.
  - 수정 중 실시간 재조회로 인한 롤백 방지 및 성공 토스트 피드백 제공.

---

### 3) 역사와교회 사진첩 신설 및 커뮤니티 기능 동기화 (`/history/photos`, `HistoryPhotosView.tsx`)
1. **메뉴 분리 및 15개국 다국어 번역 (`messages/*.json`):**
   - '역사와교회' 하위 메뉴: **`history_photos` ("역사와교회 사진첩")** 신설 -> `/history/photos`로 연결
   - '커뮤니티' 하위 메뉴: **`community_photos` ("커뮤니티 사진첩")** 명칭 변경 -> `/community/photos`로 연결
2. **사진첩 전용 뷰어 컴포넌트 (`HistoryPhotosView.tsx`):**
   - 15개 회원국 플래그 배지, 다중 이미지 슬라이드쇼, 댓글, 좋아요, WhatsApp 공유 완비.
3. **제목 15개국 공식 언어 실시간 자동 번역 (Gemini + Google Fallback):**
   - 글 등록 시 제목이 15개국 언어로 자동 번역되어 `extra_json.titles`에 보관.
   - 번역본이 없는 기존 글도 사용자 접속 언어에 맞춰 실시간 런타임 번역(`translateSingleGoogle`)으로 자동 변환.
4. **업로드 창 간소화:**
   - '관련 국가' 선택 드롭다운 삭제 (로그인한 회원의 국적으로 자동 처리)
   - '구분 카테고리' 선택 드롭다운 삭제 (불필요한 구분 단계 제거)

---

### 4) 헤더 네비게이션 & 알림/쪽지 UX 개선 (`Header.tsx`, `NotificationBell.tsx`)
1. **상단 메뉴 '쪽지함' 버튼 삭제:**
   - 데스크톱 및 모바일 상단 네비게이션 바에서 중복되던 `[✉ 쪽지함]` 버튼을 제거하여 상단 메뉴가 훨씬 넓고 정돈됨.
2. **'종' (알림) 아이콘에 '노랑 느낌표 태그' (`!`) 장착:**
   - 새로운 쪽지나 읽지 않은 알림이 도착하면 종 아이콘 우측 상단에 눈에 잘 띄는 **노란색 원형 느낌표 태그(`!`)** 표시 (`bg-amber-400 text-slate-950 font-black`).
   - 종 아이콘 클릭 시 알림 센터 드롭다운이 열리며, 하단의 **[쪽지함 바로가기]** 또는 개별 메시지 클릭을 통해 편리하게 쪽지함으로 이동 가능.

---

### 5) 데이터베이스 안전 보호 장치 (Strict Production Safe Mode)
- **게시물/회원 데이터 유실 방지:**
  - `setup_db.php` 및 배포 프로세스에서 기존 게시판(`posts`), 쪽지(`internal_messages`), 회원(`members`) 데이터를 절대 초기화하거나 삭제하지 않는 Strict Production Safe Mode 적용.
  - 배포가 반복되어도 실서비스 데이터가 100% 안전하게 보존됨.

---

## 💻 2. 다른 컴퓨터에서 작업 이어받는 방법 (가이드)

다른 PC 환경에서 이어서 작업하시려면 아래 단계를 차례대로 진행하시면 됩니다.

### Step 1. 저장소 최신 코드 받기
```bash
# 이미 저장소가 클론되어 있는 경우
git pull origin main

# 새로 클론하는 경우
git clone https://github.com/seunghoKR/aamen.git
cd aamen
```

### Step 2. 프론트엔드 의존성 패키지 설치
```bash
cd renewal/frontend
npm install
```

### Step 3. 로컬 개발 서버 실행
```bash
# renewal/frontend 디렉터리에서
npm run dev
```
- 브라우저에서 `http://localhost:3000` 접속하여 확인.
- 로컬 변경사항 실시간 핫리로드 지원.

### Step 4. 빌드 및 실제 운영 서버 배포 (중요)
```bash
# 1) 프론트엔드 정적 파일 빌드 (Next.js 15개국 606개 정적 페이지 생성)
npm run build --prefix renewal/frontend

# 2) 운영 서버(aamen.net)로 FTP 원클릭 자동 배포
powershell -ExecutionPolicy Bypass -File deploy_to_aamen1.ps1
```
> ※ `deploy_to_aamen1.ps1` 스크립트는 프론트 정적 파일(`out/`)과 백엔드 PHP API(`renewal/backend/`)를 자동으로 묶어 FTP로 전송하고 원격 압축 해제 및 DB 안전 검증까지 한 번에 완료합니다.

---

## 📁 3. 주요 디렉터리 및 핵심 파일 구조

```
AAMEN/
├── deploy_to_aamen1.ps1                # 실서버(aamen.net) 원클릭 FTP 배포 스크립트
├── WORK_HANDOVER_v1.5.1.md             # 본 인수인계 문서
│
├── renewal/
│   ├── backend/                        # PHP 8.4 REST API 백엔드
│   │   ├── banners.php                 # 배너 단일 슬롯 저장 / 파일 업로드 API
│   │   ├── members.php                 # 회원 목록 및 권한/등급 수정 API
│   │   ├── posts.php                   # 커뮤니티 및 역사사진첩 게시물 API
│   │   ├── notifications.php           # 알림 센터 API
│   │   ├── messages.php                # 내부 쪽지함 API
│   │   ├── setup_db.php                # DB 스키마 검증 (Strict Production Safe Mode)
│   │   └── db.php                      # MariaDB 연결 설정
│   │
│   └── frontend/                       # Next.js 16 + React 19 + Tailwind v4
│       ├── package.json                # v1.5.1
│       └── src/
│           ├── app/[locale]/
│           │   ├── page.tsx            # 메인 랜딩페이지
│           │   ├── admin/
│           │   │   ├── banners/page.tsx # 배너 관리 (슬롯별 저장, 파일 업로드 전용)
│           │   │   └── members/page.tsx # 회원 관리 (등급 수동 저장 버튼)
│           │   └── history/
│           │       └── photos/page.tsx # 역사와교회 사진첩 페이지
│           ├── components/
│           │   ├── layout/
│           │   │   ├── Header.tsx      # 헤더 (쪽지함 삭제, 네비게이션)
│           │   │   └── NotificationBell.tsx # 종 아이콘 (노랑 느낌표 태그)
│           │   ├── home/
│           │   │   └── HeroSection.tsx # 상단 배너 슬라이더 (1920x600 핏)
│           │   └── history/
│           │       └── HistoryPhotosView.tsx # 사진첩 뷰어 (15개국 자동번역)
│           └── messages/               # 15개 회원국 언어 사전 파일 (ko, en, ja, ...)
```

---

## 🔑 4. 주요 계정 및 권한 안내

- **최고 관리자 (Super Admin / Level 5):**
  - ID: `admin` (또는 개발자 계정)
  - 접근 경로: `/ko/admin`
  - 배너 관리, 회원 등급 조정, 모든 게시물/사진첩 작성 및 삭제 권한 보유
- **사역자 (Level 3 Worker / Missionary):**
  - 역사와교회 사진첩(`history_photos`) 사진 등록 권한 보유

---
*Created by AI 디자인실장 영자 (Youngja) @ Connect AI LAB & AAMEN Team*
