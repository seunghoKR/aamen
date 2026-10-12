# 🌏 AAMEN (Asia Anabaptist Mennonite Education Network)
### 아시아 아나밥티스트 메노나이트 교육 네트워크 플랫폼 (Release v1.2.0)

[![Next.js](https://img.shields.io/badge/Next.js-16.3.6-black.svg?style=flat&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.8-blue.svg?style=flat&logo=react)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8.svg?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![i18n](https://img.shields.io/badge/i18n-13_Nations-emerald.svg)](https://aamen2.iwinv.net/)

아시아 13개국(한국, 일본, 인도네시아, 베트남, 태국, 미얀마, 인도, 네팔, 필리핀, 캄보디아, 라오스, 몽골, 대만) 사역자와 성도들을 위한 평화·제자도 교육 및 중보기도 글로벌 네트워크 플랫폼입니다.

---

## 🌟 주요 기능 (Key Features)

1. **아시아 13개국 완역 다국어 지원 (next-intl & i18n)**
   - 13개국어(한국어, 영어, 일본어, 번체 중국어, 인도네시아어, 태국어, 베트남어, 미얀마어, 힌디어, 네팔어, 크메르어, 라오어, 몽골어) 동적 전환
   - MWC 7대 신념(Shared Convictions) 교안 13개 언어 완역본 다운로드 및 브라우징

2. **실시간 중보기도의 벽 (Live Prayer Wall)**
   - 13개국 성도들의 기도제목 실시간 공유 및 '아멘' 동참 카운터
   - 왓츠앱(WhatsApp) 및 텔레그램(Telegram) 알림 봇 연동

3. **인물 캐릭터 아바타 & 맞춤형 마이페이지 (MyPage)**
   - 성별, 연령(청년/장년), 분위기별 16종 일러스트 캐릭터 선택 모달
   - 개인 프로필, 소속교회/단체/기관, 4대 SNS 및 메신저 연동 관리
   - 실시간 변경 감지 및 이탈 방지 모달

4. **체계적인 6단계 권한 관리 및 관리자 콘솔**
   - 0단계(게스트)부터 5단계(총괄 관리자) 및 개발자(Developer) 등급
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

## 🌐 실서버 배포 주소
- **공식 운영 서버:** [https://aamen2.iwinv.net](https://aamen2.iwinv.net)
- **버전:** `v1.2.0 (Stable Release)`
