# 🌏 AAMEN (Asia Anabaptist Mennonite Education Network)
### 아시아 아나밥티스트 메노나이트 교육 네트워크 플랫폼 (Release v1.4.1)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-13_Nations-emerald.svg)](https://aamen.net/)

아시아 13개국(한국, 일본, 인도네시아, 베트남, 태국, 미얀마, 인도, 네팔, 필리핀, 캄보디아, 라오스, 몽골, 대만) 사역자와 성도들을 위한 평화·제자도 교육 및 중보기도 글로벌 네트워크 플랫폼입니다.

---

## 🌟 주요 기능 (Key Features)

1. **아시아 13개국 완역 다국어 지원 (next-intl & i18n)**
   - 13개국어(한국어, 영어, 일본어, 번체 중국어, 인도네시아어, 태국어, 베트남어, 미얀마어, 힌디어, 네팔어, 크메르어, 라오어, 몽골어) 동적 전환
   - MWC 7대 신념(Shared Convictions) 교안 13개 언어 완역본 다운로드 및 브라우징

2. **실시간 중보기도의 벽 (Live Prayer Wall)**
   - 13개국 성도들의 기도제목 실시간 공유 및 '아멘' 동참 카운터
   - 왓츠앱(WhatsApp) 및 텔레그램(Telegram) 알림 봇 연동

3. **50종 인물 캐릭터 아바타 & 다국어 마이페이지 (MyPage)**
   - 50종 일러스트 캐릭터 아바타 갤러리 (무작위 셔플링 & 직관적 원클릭 선택)
   - 마이페이지 14개국어 완전 현지화 및 소속 국가별 자국어/영문/이니셜 표준화
   - 개인 프로필, 소속교회/단체/기관, 4대 SNS 및 메신저 연동 관리

4. **체계적인 6단계 권한 관리 및 관리자 콘솔**
   - 0단계(게스트)부터 5단계(총괄 관리자) 및 개발자(Developer) 등급
   - 체크박스 다중 선택 및 회원 일괄 삭제 기능
   - 배너 슬라이더 관리, 13개국 코디네이터 관리, 팝업 공지, Gemini AI 설정 등

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
│   ├── frontend/         # Next.js 16 + React 19 기반 다국어 프론트엔드
│   │   ├── src/          # 컴포넌트, 페이지, 유틸, 상태 관리
│   │   └── messages/     # 13개국어 다국어 번역 리소스 (JSON)
│   └── backend/          # PHP 8.4 & MariaDB 기반 RESTful API 엔드포인트
├── prepare_deploy.py     # 정적 산출물 및 API 취합 배포 준비 스크립트
├── zip_deploy.py         # 서버 업로드용 deploy.zip 압축 유틸리티
├── upload_ftp.py         # 실서버 FTP 자동 업로드 스크립트
├── clean_unzip.php       # 실서버 원터치 무중단 압축 해제 핸들러
└── SYSTEM_AUDIT_AND_ROADMAP.md # 시스템 전수 점검 보고서 및 인수인계 문서
```

---

## 🌐 서버 및 배포 버전 정보
- **공식 운영 서버:** [https://aamen.net](https://aamen.net) (`v1.4.1 Release`)
- **최신 릴리즈 기능 (v1.4.1):** 
  1. **게시판 전수 점검 및 업로드 활성화:** 공지사항, 자료실, 사진첩 전 게시판 글/파일 업로드 안정화
  2. **이미지 크기 자동 조절 & 다중 업로드:** 클라이언트 Canvas 기반 자동 리사이징(1600px/WebP) 및 여러 이미지 일괄 업로드 지원
  3. **공지사항 매거진 뷰 개편:** 공지사항 목록을 [대표 이미지(포스터) + 제목 + 내용 3줄 요약] 구조로 개편 및 상세 팝업 포스터 연동
  4. **랜딩페이지 실제 DB 연동:** 최근게시물 가상 더미 데이터 완전 삭제 및 실제 데이터베이스 게시물 실시간 표시
  5. **게시물 삭제 트랜잭션 정상화:** 웹호스팅 Apache HTTP DELETE 302 차단 우회 및 연관 데이터 완벽 삭제
  6. **고해상도 로고 & 파비콘 번들 적용:** 웹/모바일 전 규격 파비콘 및 상단/푸터/로그인 브랜드 로고 일괄 반영

- **이전 릴리즈 내역 (v1.4.0):**
  1. 마이페이지 14개국어 완전 번역 & 자국어/영어/이니셜 표기 표준화
  2. 50종 캐릭터 아바타 컬렉션 무작위 셔플 탑재 & 정밀 크롭
  3. MWC / MCSK 사역자 회원 등록 및 권한 부여
  4. 관리자 회원 목록 체크박스 다중 선택 및 일괄 삭제 기능
  5. 프론트엔드 API 예외 방어 및 백엔드 라우트 핸들러 무결성 확보

