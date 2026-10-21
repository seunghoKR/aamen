# 🌏 AAMEN (Asia Anabaptist Mennonite Education Network)
### 아시아 아나밥티스트 메노나이트 교육 네트워크 플랫폼 (Release v1.5.6)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-15_Nations-emerald.svg)](https://aamen.net/)

아시아 15개국(홍콩, 인도네시아, 인도, 일본, 캄보디아, 한국, 라오스, 미얀마, 몽골, 네팔, 필리핀, 태국, 대만, 미국, 베트남) 사역자와 성도들을 위한 평화·제자도 교육 및 중보기도 글로벌 네트워크 플랫폼입니다.

---

## 🌟 주요 기능 (Key Features)

1. **아시아 15개국 완역 다국어 지원 (next-intl & i18n)**
   - 15개국어(한국어, 영어, 일본어, 번체 중국어, 대만어, 인도네시아어, 태국어, 베트남어, 미얀마어, 힌디어, 네팔어, 크메르어, 라오어, 몽골어, 필리핀어) 동적 전환
   - MWC 7대 신념(Shared Convictions) 교안 15개 언어 완역본 다운로드 및 브라우징

2. **실시간 중보기도의 벽 (Live Prayer Wall)**
   - 15개국 성도들의 기도제목 실시간 공유 및 '저도 기도할게요 (아멘)' 동참 카운터
   - 긴급 중보기도 뱃지 및 관리자 알림 연동
   - 왓츠앱(WhatsApp) 및 텔레그램(Telegram) 알림 봇 연동

3. **회원 간 내부 메시지(쪽지함) & 15개국어 자동 번역 그룹 공지**
   - 회원 간 1:1 안전한 내부 쪽지 송수신 (마이페이지 메시지함)
   - 코디네이터(Level 4) 및 총괄 관리자(Level 5) 전용 [내 국가 회원 전체 / 전체 코디네이터 / 전체 회원] 대상 그룹 공지 쪽지
   - 발송 시 15개국 언어 실시간 자동 번역(`translateTitleTo15Languages`) 적용

4. **상단 헤더 실시간 알림 센터 & PWA 브라우저 푸시 (Web Push)**
   - 상단 헤더 종(🔔) 아이콘, 미확인 알림 뱃지, 원클릭 읽음 처리 및 딥링크 이동
   - 댓글, 기도 아멘, 긴급 중보기도, 새 쪽지 실시간 트리거 연동
   - W3C Service Worker(`sw.js`) 및 VAPID 표준 기반 앱스토어 없는 스마트폰 PWA 푸시 알림

5. **50종 인물 캐릭터 아바타 & 다국어 마이페이지 (MyPage)**
   - 50종 일러스트 캐릭터 아바타 갤러리 (무작위 셔플링 & 직관적 원클릭 선택)
   - 마이페이지 15개국어 완전 현지화 및 소속 국가별 자국어/영문/이니셜 표준화
   - 안드로이드/아이폰 스마트폰 웹앱 설치 안내문(`AppInstallGuide.tsx`) 탑재

6. **체계적인 5단계 권한 관리 및 관리자 콘솔**
   - 0단계(게스트)부터 5단계(총괄 관리자) 및 개발자(Developer) 등급
   - 대시보드 내 [관리자를 위한 사이트 운영 설명서](`AdminSiteManual.tsx`, `/admin/manual`) 탑재
   - 배너 슬라이더 관리, 15개국 코디네이터 관리, 팝업 공지, 글로벌 협력단체, Gemini AI 설정 등

---

## 🚀 빠른 시작 (Quick Start)

```bash
# 저장소 복제
git clone https://github.com/seunghoKR/aamen.git
cd aamen/renewal/frontend

# 패키지 설치
npm install

# 로컬 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000`으로 접속하여 확인합니다.

---

## 📂 프로젝트 구조 (Directory Structure)

```
AAMEN/
├── renewal/
│   ├── frontend/         # Next.js 16 + React 19 기반 15개국 다국어 프론트엔드
│   │   ├── public/       # 정적 자산 및 PWA Service Worker (sw.js, manifest.json)
│   │   ├── src/          # 컴포넌트, 페이지, 유틸, 상태 관리
│   │   └── messages/     # 15개국어 다국어 번역 리소스 (JSON)
│   └── backend/          # PHP 8.4 & MariaDB 기반 RESTful API 엔드포인트
├── deploy_to_aamen1.ps1  # 빌드 및 실서버 무중단 자동 배포 스크립트
├── clean_unzip.php       # 실서버 원터치 무중단 압축 해제 핸들러
└── SYSTEM_AUDIT_AND_ROADMAP.md # 시스템 전수 점검 보고서 및 인수인계 문서
```

---

## 🌐 서버 및 배포 버전 정보
- **공식 운영 서버:** [https://aamen.net](https://aamen.net) (`v1.5.6 Release`)
- **최신 릴리즈 기능 (v1.5.6):**
  1. **쪽지함 수신자 실시간 다국어·초성·오타 허용(Fuzzy) 자동완성 검색 탑재:**
     - Damerau-Levenshtein 거리 알고리즘을 적용하여 인접 문자 오타(`BEA` -> `Bae`) 및 한글 자음 초성(`ㅂㅇㅎ` -> `배용하`), 키보드 영타 오타(`qodydgk`)까지 즉시 매칭 및 추천.
     - 15개국 전 언어 환경에서 이름, 영문명, 원어명, 소속(MCSK, MWC 등), 국가명 어디를 입력해도 실시간 드롭다운 목록 제공 및 직관적인 수신자 변경 UX 완비.
  2. **회원 관리 체계 및 관리자 대시보드 회원 등급 동기화 (Jeanette Hanson 권한 정정):**
     - Jeanette Hanson의 회원 등급을 회원 관리 기준인 `4단계(리더/국가관리자/게시판관리자, country_admin / level 4)`로 전체 시스템(프론트 스토어, 로그인, 백엔드 시드, 대시보드 메인) 100% 일치 동기화.
     - 관리자 대시보드 메인(`admin/page.tsx`)에서 서버 DB 실데이터 실시간 조회를 통해 회원 등급 정보 불일치 원천 차단.

- **이전 릴리즈 내역 (v1.5.5):**
  1. **역사와 교회 사진첩 / 커뮤니티 사진첩 완전 분리 & 독립 운영:**
     - '역사와 교회 사진첩'(`history_photos`)과 '커뮤니티 사진첩'(`photos`) 데이터베이스 및 화면 분리.
     - 15개국 다국어 메뉴 팩 전체 동기화 및 전용 등록/상세/댓글/좋아요 기능 완비.
  2. **사진 등록 업로드 모달 직관적 간소화:**
     - 불필요한 입력값(국가, 도시, 날짜, 인원수, URL 박스) 제거, 15개국 자동 번역 및 브라우저 내 1600px/WebP 다중 리사이즈 일괄 등록.
  3. **회원 관리 체계(1~5단계) 및 권한 매트릭스 고도화:**
     - 일반 회원 목록 및 권한 매트릭스에서 개발자 등급 제외(1단계 준회원 ~ 5단계 사이트 관리자 전용 정렬).
     - 개발자 전용 보안 영역(7대 신념 교안 관리, Gemini AI 엔진)과 5단계 사이트 관리자 권한 명확히 격리.
     - 시뮬레이터 플로팅 바를 통한 6단계 개발자 권한 즉시 테스트 환경 유지.
  4. **랜딩페이지 기도 목록 및 헤더 알림 최적화:**
     - 실시간 기도의 벽 및 중보기도 게시판 글 목록 카드 규격화 및 상세 보기 팝업 적용.
     - 쪽지함 마이페이지 통합 및 헤더 알림 센터 인디케이터 개선.

- **이전 릴리즈 내역 (v1.5.0):**
  1. **PWA 브라우저 푸시 알림 & W3C Service Worker (`sw.js`) 탑재:** 앱스토어 다운로드 없이 홈 화면 설치 후 W3C 표준 Web Push 및 VAPID 암호화 프로토콜을 활용하여 백그라운드 푸시 알림 실시간 수신 및 클릭 시 딥링크 이동.
  2. **회원 간 내부 메시지(쪽지) 및 15개국어 자동 번역 그룹 공지 시스템:**
     - 정회원(Level 2+) 이상 1:1 쪽지 발송 및 읽음/답장 지원.
     - 코디네이터(Level 4) 및 총괄 관리자(Level 5)를 위한 [내 국가 회원 전체 / 전체 코디네이터 / 전체 회원] 대상 그룹 공지 쪽지 발송.
     - 15개국어 자동 번역(`translateTitleTo15Languages`) 탑재로 각 국가 회원의 모국어로 번역되어 전달.
  3. **상단 Header 실시간 알림 센터 (Notification Bell Center):**
     - 종(🔔) 아이콘, 미확인 알림 뱃지(`🔴 count`), 30초 주기 폴링 & 윈도우 포커스 감지.
     - 💬 댓글, 🙏 저도 기도할게요(아멘), 🚨 긴급 중보기도, ✉️ 새 쪽지 실시간 트리거 & 딥링크 이동.
  4. **마이페이지 [실시간 수신 알림 내역] 탭 신설:** 카테고리별 필터, 모두 읽음, 개별/전체 삭제.
  5. **관리자를 위한 대시보드 사이트 운영 설명서 (`AdminSiteManual.tsx`, `/admin/manual`):**
     - 15개국 다국어 운영, 5단계 회원 등급 및 승인 절차, 쪽지/푸시 운영 가이드, FAQ & 트러블슈팅.
  6. **사용자를 위한 스마트폰 웹앱 설치 & 푸시 알림 가이드 (`AppInstallGuide.tsx`):**
     - 안드로이드(삼성인터넷/Chrome) 및 아이폰(iOS/Safari) 3단계 PWA 설치 및 푸시 권한 허용 안내.
