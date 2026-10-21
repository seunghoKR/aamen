# AAMEN 프로젝트 개발 인수인계 및 작업 일지 (v1.5.6)

> **작성 일시:** 2026년 10월 21일  
> **버전:** `v1.5.6`  
> **운영 서버 URL:** [https://aamen.net](https://aamen.net)  
> **담당:** AI 디자인실장 영자 (Youngja) & 개발팀

---

## 📌 1. 오늘(2026-10-21) 완료된 핵심 작업 내역 (v1.5.6)

### 1) 쪽지함 수신자 실시간 다국어·초성·오타 허용(Fuzzy) 자동완성 검색 탑재 (`MessagesInbox.tsx`, `fuzzySearch.ts`)
1. **Damerau-Levenshtein 오타 보정 검색 엔진 신설:**
   - 인접 문자 전치 오타(Transposition: 예: `BEA` ➔ `Bae`)를 편집 거리 1로 정확하게 계산하여 **`Bae Yongha` (배용하)를 최상단 1순위로 즉시 추천**.
   - 영타-한타 오타(`qodydgk` ➔ `배용하`), 한타-영타 오타(`ㅠㅁㄷ` ➔ `bae`) 자동 변환 매칭 지원.
   - 한글 자음 초성 검색(`ㅂㅇㅎ` ➔ `배용하`, `ㄱㅂㄱ` ➔ `김복기`) 지원.
2. **15개국 전 언어 & 글로벌 별칭(Aliases) 통합:**
   - 한국어 이름, 영문명, 현지어명, 소속(MCSK, MWC, MNN 등), 국가명(한국, Korea, 미국, USA, 일본 등), 이메일, 아이디 등 모든 필드 대상 가중치 점수(Score) 기반 정렬.
3. **실시간 플로팅 드롭다운 (Combobox Autocomplete UX):**
   - 입력창 포커스 또는 타이핑 즉시 아래에 부드럽게 추천 목록 드롭다운 노출.
   - 검색어가 없을 때도 전체 회원 목록이 펼쳐져 마우스 클릭만으로 바로 수신자 선택 가능.
4. **직관적인 수신자 선택 칩 & 원클릭 변경 UX:**
   - 선택 완료 시 [국기 + 프로필 아바타 + 이름 + 소속] 카드 표시 및 `[수신자 변경 ✕]` 버튼 제공.
5. **데이터 파싱 및 Fallback 무결성 강화:**
   - 백엔드(`/api/members`) 응답 포맷(배열, 래핑 객체) 자동 감지 및 `initialMembers` 안전 Fallback 완비.

---

### 2) 회원 관리 체계 및 관리자 대시보드 회원 등급 동기화 (Jeanette Hanson 권한 정정)
1. **문제점 해결:**
   - 관리자 대시보드 메인(`admin/page.tsx`)의 회원 등급 관리 프리뷰 카드에서 Jeanette Hanson이 과거 기본값인 `최고관리자`로 노출되어 회원 관리 화면(`4단계: 리더/게시판관리자`)과 불일치하던 버그 해결.
2. **반영 내역:**
   - `renewal/frontend/src/lib/store.ts`: Jeanette Hanson `role: 'country_admin'`, `level: 4` 로 정정.
   - `renewal/frontend/src/app/[locale]/member/login/page.tsx`: 프리셋 계정 `role: 'country_admin'`, `tierLevel: 4` 로 정정.
   - `renewal/frontend/src/lib/serverDb.ts`: `role: 'country_admin'` 으로 정정.
   - `renewal/backend/members.php` & `setup_db.php`: 마스터 시드 `role: 'country_admin'`, `tierLevel: 4` 로 정정.
   - `renewal/frontend/src/app/[locale]/admin/page.tsx`: 관리자 대시보드 메인에서 서버 API(`/api/members`)를 통해 최신 회원 목록 및 역할을 실시간 조회하도록 동기화 구현.

---

### 3) 로컬 개발 환경 편의성 개선
1. **`1_시작하기_출근.bat` 경로 버그 수정:**
   - 루트 디렉토리에서 더블 클릭 시 `renewal\frontend`로 안전하게 이동하여 `node_modules` 검사 및 `npm run dev`를 실행하도록 최적화.
2. **`.gitignore` 정리:**
   - 대용량 바이너리 및 레거시 백업 폴더(`public_html/`, `backup/`, `source/`, `uploads/`, `*.cdr`, `*.xlsx`, `*.cvs`)를 안전하게 제외하여 Git 가볍고 쾌적하게 유지.

---

## 🚀 2. 운영 서버(aamen.net) 배포 완료
- **Next.js 15개국 606개 정적 페이지 빌드 100% 무결성 완료 (`Exit Code 0`)**
- **FTP 원클릭 자동 배포 (`deploy_to_aamen1.ps1`) 성공 완료:**
  - `clean_unzip.php` 및 `deploy.zip` (34.91 MB) 업로드 및 원격 무중단 압축 해제 완료.
  - Strict Production Safe Mode DB 검증 통과 (기존 게시물 및 회원 데이터 100% 보존).
  - 공식 운영 서버 [https://aamen.net](https://aamen.net)에 `v1.5.6` 즉시 반영 완료.

---
*Created by AI 디자인실장 영자 (Youngja) @ Connect AI LAB & AAMEN Team*
