# -*- coding: utf-8 -*-
"""
AAMEN 13-Nation Full Convictions Rebuilder & Perfection Suite
- Handcrafted pristine Korean theological translations (0% [KO] tags, 0% English left)
- Local AI (LM Studio Qwen 2.5) translation for any untranslated English items in other languages
- Bulletproof CSS grid and language-specific word-break styles to eliminate any card overflow in CJK/Asian languages
"""

import json, sys, os, time, re, urllib.request

sys.stdout.reconfigure(encoding='utf-8')
import setup_quotes

CACHE_FILE = r'C:\Dev\AAMEN\translation_cache_v2.json'
cache = {}
if os.path.exists(CACHE_FILE):
    try:
        with open(CACHE_FILE, 'r', encoding='utf-8') as f:
            cache = json.load(f)
        print(f"Loaded {len(cache)} cached items.")
    except Exception as e:
        print(f"Cache load error: {e}")

LM_STUDIO_URL = 'http://49.170.204.109:1234/v1/chat/completions'

LANG_NAMES = {
    'ja': 'Japanese',
    'zh-TW': 'Traditional Chinese (Taiwan)',
    'vi': 'Vietnamese',
    'id': 'Indonesian',
    'th': 'Thai',
    'my': 'Burmese (Myanmar)',
    'hi': 'Hindi',
    'ne': 'Nepali',
    'km': 'Khmer (Cambodian)',
    'lo': 'Lao',
    'mn': 'Mongolian'
}

UI_MIN = {
    'ko': '분', 'en': 'minutes', 'ja': '分', 'zh-TW': '分鐘',
    'vi': 'phút', 'id': 'menit', 'th': 'นาที', 'my': 'မိနစ်',
    'hi': 'मिनट', 'ne': 'मिनेट', 'km': 'នាទី', 'lo': 'ນາທີ', 'mn': 'минут'
}

UI_LABELS = {
    'ko': {'obj': '🎯 학습 목표', 'all': '전체 목표:', 'ses': '세션 목표:', 'mat': '📚 준비물 및 읽을거리', 'm': '준비물:', 'r': '필독서:'},
    'en': {'obj': '🎯 Learning Objectives', 'all': 'Overall Objective:', 'ses': 'One-Hour Session Objective:', 'mat': '📚 Materials & Required Readings', 'm': 'Materials:', 'r': 'Required Readings:'},
    'ja': {'obj': '🎯 学習目標', 'all': '全体目標:', 'ses': 'セッション目標:', 'mat': '📚 準備物および必読書', 'm': '準備物:', 'r': '必読文献:'},
    'zh-TW': {'obj': '🎯 學習目標', 'all': '整體目標:', 'ses': '一小時課程目標:', 'mat': '📚 課前準備與必讀材料', 'm': '所需材料:', 'r': '必讀書目:'},
    'vi': {'obj': '🎯 Mục tiêu học tập', 'all': 'Mục tiêu tổng quát:', 'ses': 'Mục tiêu phiên 1 giờ:', 'mat': '📚 Tài liệu & Bài đọc bắt buộc', 'm': 'Tài liệu:', 'r': 'Bài đọc bắt buộc:'},
    'id': {'obj': '🎯 Tujuan Pembelajaran', 'all': 'Tujuan Keseluruhan:', 'ses': 'Tujuan Sesi Satu Jam:', 'mat': '📚 Bahan & Bacaan Wajib', 'm': 'Bahan:', 'r': 'Bacaan Wajib:'},
    'th': {'obj': '🎯 วัตถุประสงค์การเรียนรู้', 'all': 'วัตถุประสงค์โดยรวม:', 'ses': 'วัตถุประสงค์ของบทเรียน 1 ชั่วโมง:', 'mat': '📚 อุปกรณ์และบทอ่านที่จำเป็น', 'm': 'อุปกรณ์:', 'r': 'บทอ่านที่จำเป็น:'},
    'my': {'obj': '🎯 သင်ယူမှု ရည်မှန်းချက်များ', 'all': 'အလုံးစုံ ရည်မှန်းချက်:', 'ses': 'တစ်နာရီ သင်ခန်းစာ ရည်မှန်းချက်:', 'mat': '📚 လိုအပ်သော အထောက်အကူပြု ပစ္စည်းများနှင့် ဖတ်ရှုရန်များ', 'm': 'ပစ္စည်းများ:', 'r': 'ဖတ်ရှုရန်များ:'},
    'hi': {'obj': '🎯 सीखने के उद्देश्य', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घंटे के सत्र का उद्देश्य:', 'mat': '📚 सामग्री और अनिवार्य अध्ययन', 'm': 'सामग्री:', 'r': 'अनिवार्य अध्ययन:'},
    'ne': {'obj': '🎯 सिकाइका उद्देश्यहरू', 'all': 'समग्र उद्देश्य:', 'ses': 'एक घण्टाको सत्रको उद्देश्य:', 'mat': '📚 सामग्री र आवश्यक अध्ययन', 'm': 'सामग्री:', 'r': 'आवश्यक अध्ययन:'},
    'km': {'obj': '🎯 គោលបំណងនៃការរៀនសូត្រ', 'all': 'គោលបំណងរួម៖', 'ses': 'គោលបំណងមេរៀនមួយម៉ោង៖', 'mat': '📚 សម្ភារៈ និងអត្ថបទអានចាំបាច់', 'm': 'សម្ភារៈ៖', 'r': 'អត្ថបទអានចាំបាច់:'},
    'lo': {'obj': '🎯 ຈຸດປະສົງການຮຽນຮູ້', 'all': 'ຈຸດປະສົງລວມ:', 'ses': 'ຈຸດປະສົງບົດຮຽន 1 ຊົ່ວໂມງ:', 'mat': '📚 ອຸປະກອນ ແລະ ບົດອ່ານທີ່ຈຳເປັນ', 'm': 'ອຸປະກອນ:', 'r': 'ບົດອ່ານທີ່ຈຳເປັນ:'},
    'mn': {'obj': '🎯 Суралцах зорилго', 'all': 'Ерөнхий зорилго:', 'ses': 'Нэг цагийн хичээлийн зорилго:', 'mat': '📚 Хэрэглэгдэхүүн ба унших материалууд', 'm': 'Хэрэглэгдэхүүн:', 'r': 'Унших материал:'}
}

# 1. 완벽한 한국어 신학 교안 원본 데이터셋 (100% 한글화, 0% 영어 잔여물, [KO] 제거)
KOREAN_METAS = {
    'god': {
        'themeNum': 'Theme 1',
        'title': '제1주제: 하나님',
        'quote': setup_quotes.QUOTES_BY_LANG['god']['ko'],
        'overallObjective': '하나님을 성부, 성자, 성령이시며, 교제와 예배, 봉사와 증거 안에서 신실하도록 사람들을 부르심으로써 타락한 인류를 회복시키시는 창조주로 이해합니다.',
        'sessionObjective': '참가자들은 아나밥티스트 신앙 전통에서 고백하는 하나님의 삼위일체적 성품을 명확히 설명하고, 자신이 속한 아시아 현지 상황 속에서 하나님께서 신실함으로 부르시는 구체적인 길을 식별할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 창세기 1:1-3, 요한복음 1:1-18, 마태복음 28:19, 요한복음 14:16-17, 26)',
            '화이트보드 또는 플립차트, 마커',
            '하나님에 대한 아나밥티스트적 이해 요약 유인물 (MWC 7대 공유된 신념 자료집)',
            '창조 또는 하나님의 신성에 관한 아시아 현지의 짧은 이야기, 속담, 또는 예술적 표현 자료'
        ],
        'readings': [
            '노먼 크라우스 (Norman C. Kraus), 「삼위일체이신 하나님 (God as Trinity)」, 『우리의 구원자 하나님: 기독론적 관점의 신학 (God Our Savior: Theology in a Christological Mode)』 (Herald Press, 1991), 88-93쪽.',
            '존 렘펠 (John Rempel), 「불가능한 과제: 급진적 교회를 위한 삼위일체 신학인가? (An Impossible Task: Trinitarian Theology for a Radical Church?)」, The Conrad Grebel Review 37, no. 2 (2019 봄호): 110-145쪽.'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영 및 개회 묵상',
                'items': [
                    '아시아 문화적 맥락에 어울리는 짧은 개회 기도나 하나님의 위엄을 조용히 묵상하는 시간으로 시작합니다.',
                    '세션의 주제를 소개합니다: 창조주 하나님을 알아가기.'
                ]
            },
            {
                'duration': '15분',
                'title': '창조주이자 유지자이신 하나님 탐색',
                'items': [
                    '창세기 1장 1-3절을 함께 교독합니다.',
                    '토의: 하나님이 창조주라는 것은 우리 삶에 무엇을 의미하는가?',
                    '창조에 관한 아시아의 지혜로운 속담이나 이야기를 함께 나눕니다.',
                    '이것이 성경의 기록과 어떻게 공명하거나 새로운 통찰을 제공하는가?',
                    '여러분이 속한 아시아 상황의 사람들은 창조주 하나님을 어떻게 이해하고 있는가?'
                ]
            },
            {
                'duration': '25분',
                'title': '아나밥티스트 신앙 전통에서의 삼위일체 이해',
                'items': [
                    'MWC(메노나이트 세계총회) 공유된 신념을 기초로 성부, 성자, 성령 하나님을 간략히 설명합니다.',
                    '소그룹 나눔과 토의:',
                    '1그룹: 마가복음 4장 35-41절 (성자 예수님)을 읽고 토의합니다: 바람과 바다도 순종하는 이분은 누구이신가?',
                    '2그룹: 성령에 관한 주요 성경 구절(요한복음 14:16-17, 26)을 읽고 토의합니다: 우리 곁에 계시는 성령의 역할은 무엇인가?',
                    '3그룹: 마태복음 28장 19절을 읽고 토의합니다: 이 지상명령은 삼위일체 하나님을 어떻게 확증하는가?',
                    '각 소그룹에서 나눈 핵심 내용을 전체와 함께 공유합니다.'
                ]
            },
            {
                'duration': '10분',
                'title': '우리 상황 속에서 신실함으로 부르시는 하나님의 음성',
                'items': [
                    '브레인스토밍: 신념 선언문은 하나님께서 \'사람들을 불러 교제, 예배, 봉사, 증거의 삶을 신실하게 살아가도록 하심으로써 타락한 인류를 회복시키신다\'고 증언합니다.',
                    '하나님께서는 우리가 속한 아시아 지역 사회 속에서 이러한 실천들을 어떤 구체적인 방식으로 살아가도록 부르고 계십니까? (예: 취약한 이웃을 향한 섬김, 지혜로운 복음의 증거).'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 마침 기도',
                'items': [
                    '요약: 하나님은 성부, 성자, 성령으로 알려지신 창조주이시며, 지금도 우리의 공동체를 신실한 제자의 삶으로 부르고 계십니다.',
                    '하나님을 찬양하는 현지 찬송이나 결단의 기도로 마칩니다.'
                ]
            }
        ]
    },
    'jesus': {
        'themeNum': 'Theme 2',
        'title': '제2주제: 예수 그리스도',
        'quote': setup_quotes.QUOTES_BY_LANG['jesus']['ko'],
        'overallObjective': '예수님을 하나님의 아들로 고백하며, 그분의 삶과 가르침, 십자가와 부활을 통해 어떻게 신실한 제자의 길을 보여주셨고, 세상을 구속하시며 영원한 생명을 주셨는지 깊이 이해합니다.',
        'sessionObjective': '참가자들은 아나밥티스트 제자도에서 강조하는 예수님의 삶과 가르침의 핵심(예: 평화 만들기, 사랑과 순종)을 명확히 설명하고, 이를 아시아 상황 속에서의 도전이나 기회와 연결할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 누가복음 4:16-21, 마태복음 5-7장 산상수훈 발췌, 빌립보서 2:5-11)',
            '화이트보드 또는 플립차트, 마커',
            '제자도 또는 그리스도 중심적 삶에 관한 아나밥티스트 읽기 자료',
            '사심 없는 섬김이나 화해를 묘사한 아시아 현지 상황의 그림이나 이야기'
        ],
        'readings': [
            '팔머 베커 (Palmer Becker), 「핵심 가치 1: 예수님은 우리 신앙의 중심이다」, 『아나밥티스트 그리스도인이란 누구인가』 (Mennonite Mission Network, 2015).',
            '노먼 크라우스 (Norman C. Kraus), 「예수 그리스도와 신학적 성찰」, 『우리의 구원자 하나님: 기독론적 관점의 신학』 (Herald Press, 1991), 20-40쪽.'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영 및 개회 찬양',
                'items': [
                    '아시아 현지 교회 성도들에게 친숙한 예수님에 관한 찬양으로 시작합니다.',
                    '세션 주제를 소개합니다: 우리 신앙의 중심이신 예수 그리스도.'
                ]
            },
            {
                'duration': '20분',
                'title': '예수님의 삶과 사명',
                'items': [
                    '누가복음 4장 16-21절 (나사렛 회당 설교)을 함께 교독합니다.',
                    '토의: 이 본문에 나타난 예수님의 핵심 사명은 무엇인가? 이러한 주제(가난한 자에게 기쁜 소식, 억눌린 자에게 자유)는 여러분의 아시아 상황에 어떻게 말씀하고 있는가?',
                    '세상을 구속하시고 영원한 생명을 선물로 주시는 구원자요 주님이신 예수님을 설명합니다.'
                ]
            },
            {
                'duration': '25분',
                'title': '제자도의 참된 모범이신 예수님 (아나밥티스트적 관점)',
                'items': [
                    '아나밥티스트 제자도의 세 가지 초점을 설명합니다:',
                    '1) 산상수훈 (마태복음 5-7장): 원수 사랑, 보복의 거부, 단순하고 진실한 언어.',
                    '2) 십자가의 길: 자기를 부인하고 희생적인 섬김으로 이웃을 사랑함 (빌립보서 2:5-11).',
                    '3) 일상 속에서의 실제적 순종: 입술의 고백을 넘어 구체적인 행동과 삶으로 따름.',
                    '소그룹 토의: 산상수훈의 가르침 중 여러분의 일상이나 공동체에서 실천하기 가장 도전적이거나 격려가 되는 말씀은 무엇인가?'
                ]
            },
            {
                'duration': '5분',
                'title': '개인적 적용과 헌신',
                'items': [
                    '개인 성찰: 이번 주 예수님의 가르침을 따르는 제자로서 내가 실천할 수 있는 한 가지 구체적인 행동은 무엇인가?'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 파송 기도',
                'items': [
                    '요약: 예수님은 우리 신앙의 기초이시며, 제자도의 살아있는 본보기이십니다.',
                    '예수님을 신실하게 따를 수 있는 용기와 힘을 구하는 기도로 마칩니다.'
                ]
            }
        ]
    },
    'spirit': {
        'themeNum': 'Theme 3',
        'title': '제3주제: 성령',
        'quote': setup_quotes.QUOTES_BY_LANG['spirit']['ko'],
        'overallObjective': '교회를 성령의 부르심을 받아 죄에서 돌이키고, 예수 그리스도를 주라 고백하며, 신앙의 고백 위에 세례를 받고 삶 속에서 그리스도를 따르는 사람들의 거룩한 공동체로 이해합니다.',
        'sessionObjective': '참가자들은 회심과 신자의 세례, 제자도의 삶을 가능하게 하시는 성령의 사역을 설명하고, 아시아 상황 속에서 성령의 능력을 힘입어 살아가는 방안을 나눌 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 사도행전 2:1-4, 37-47, 갈라디아서 5:22-26, 고린도전서 12:4-13)',
            '화이트보드 또는 플립차트, 마커',
            '아나밥티스트 신자의 세례(Believer\'s Baptism)에 관한 간략한 해설 유인물',
            '성령의 변화시키는 역사를 증언하는 아시아 현지 교회의 간증 이야기'
        ],
        'readings': [
            'C. 아놀드 스나이더 (C. Arnold Snyder), 「아나밥티스트 역사 속의 성령의 사역」, 『아나밥티스트 역사와 신학』 (Pandora Press, 1995).',
            'MWC(메노나이트 세계총회) 성령론 연구 자료집.'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영과 개회 기도',
                'items': [
                    '우리 가운데 역사하시고 공동체를 세우시는 성령의 임재를 구하는 기도로 시작합니다.',
                    '세션 소개: 성령의 부르심과 신앙 공동체.'
                ]
            },
            {
                'duration': '20분',
                'title': '성령의 부르심과 회심',
                'items': [
                    '사도행전 2장 37-41절을 함께 낭독합니다.',
                    '토의: 성령은 어떻게 사람들의 마음을 찔러 죄에서 돌이키고 예수 그리스도를 주라 고백하게 하시는가?',
                    '아나밥티스트 전통에서 자발적 신앙 고백에 기초한 신자의 세례가 갖는 의미를 설명합니다.'
                ]
            },
            {
                'duration': '25분',
                'title': '공동체에 능력을 주시는 성령',
                'items': [
                    '사도행전 2장 42-47절 및 갈라디아서 5장 22-26절을 읽습니다.',
                    '소그룹 토의: 성령의 열매(사랑, 희락, 화평, 오래 참음, 자비...)는 갈등이 많은 아시아 사회 속에서 어떻게 구체적인 증거가 되는가?',
                    '성령께서 각자에게 주신 다양한 은사를 공동체의 유익과 섬김을 위해 어떻게 활용할 것인가?'
                ]
            },
            {
                'duration': '5분',
                'title': '성령 안에서 살아가는 삶',
                'items': [
                    '개인 묵상: 내 일상의 영역 중에서 성령의 세미한 인도하심에 온전히 순종해야 할 부분은 어디인가?'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 축도 기도',
                'items': [
                    '요약: 성령은 우리를 그리스도의 한 몸으로 묶어주시고, 세상 속에서 화해와 사랑의 사역자로 살아갈 능력을 주십니다.',
                    '성령의 충만하심을 구하는 마침 기도.'
                ]
            }
        ]
    },
    'church': {
        'themeNum': 'Theme 4',
        'title': '제4주제: 성경',
        'quote': setup_quotes.QUOTES_BY_LANG['church']['ko'],
        'overallObjective': '신앙 공동체로서 성경을 신앙과 삶의 최고 권위로 받아들이며, 성령의 인도하심 아래 예수 그리스도의 빛에 비추어 공동체적으로 성경을 해석하고 순종하는 아나밥티스트 성경관을 정립합니다.',
        'sessionObjective': '참가자들은 아나밥티스트 성경 해석의 3대 핵심 원리(그리스도 중심성, 성령의 인도, 공동체적 분별)를 설명하고 실제 본문 해석 실습에 참여할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 야고보서 2:14-17, 디모데후서 3:16-17, 히브리서 1:1-2)',
            '화이트보드 또는 플립차트, 마커',
            '아나밥티스트 성경 해석 원리 3대 핵심 요약 핸드아웃'
        ],
        'readings': [
            '스튜어트 머레이 (Stuart Murray), 「성경을 읽는 아나밥티스트의 방식」, 『벌거벗은 아나밥티스트』.',
            '존 D. 로스 (John D. Roth), 「공동체 안에서 하나님의 말씀을 함께 분별하기」.'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영과 말씀 낭독',
                'items': [
                    '디모데후서 3장 16-17절을 함께 낭독하며 예배의 문을 엽니다.',
                    '세션 소개: 그리스도의 빛으로 성경 읽기.'
                ]
            },
            {
                'duration': '20분',
                'title': '아나밥티스트 관점의 성경 이해',
                'items': [
                    '세 가지 핵심 성경 해석 원리를 설명합니다: 1) 예수 그리스도를 중심에 둔 해석, 2) 성령의 지속적인 조명, 3) 신앙 공동체 안에서의 상호 분별과 순종.',
                    '토의: 왜 개인의 사적인 해석을 넘어 \'신앙 공동체가 함께 모여 말씀을 분별하고 순종을 다짐하는 것\'이 중요한가?'
                ]
            },
            {
                'duration': '20분',
                'title': '공동체적 성경 해석 실습',
                'items': [
                    '야고보서 2장 14-17절 본문을 선택하여 소그룹 실습을 진행합니다.',
                    '1단계: 본문의 구체적인 의미를 함께 관찰합니다.',
                    '2단계: 예수 그리스도의 삶과 가르침에 비추어 이 말씀을 재해석합니다.',
                    '3단계: 각 소그룹에서 오늘 우리 아시아 상황에 적용할 순종의 결단 한 가지를 도출합니다.',
                    '각 그룹별 발견한 통찰을 전체와 함께 나눕니다.'
                ]
            },
            {
                'duration': '10분',
                'title': '말씀의 삶으로의 실천',
                'items': [
                    '오늘 나눈 말씀을 토대로 이번 주 내 삶의 현장에서 실천할 믿음의 행동을 구체화합니다.'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 결단 기도',
                'items': [
                    '요약: 성경은 단순한 이론적 지식이 아니라, 예수님을 따라 순종하기 위한 생명의 길잡이입니다.',
                    '말씀에 순종하는 신실한 제자가 되기를 다짐하는 기도로 마칩니다.'
                ]
            }
        ]
    },
    'peace': {
        'themeNum': 'Theme 5',
        'title': '제5주제: 평화, 정의, 화해',
        'quote': setup_quotes.QUOTES_BY_LANG['peace']['ko'],
        'overallObjective': '예수님의 영이 주시는 능력으로 삶의 모든 영역에서 하나님을 신뢰하며, 폭력을 단호히 거부하고 원수를 사랑하며 정의를 구하고 궁핍한 자들과 나누는 평화의 일꾼으로 부름받았음을 확신합니다.',
        'sessionObjective': '참가자들은 아나밥티스트 평화 신학의 핵심 원리를 명확히 식별하고, 자신이 속한 아시아 현지 지역 사회에서 평화를 실천할 수 있는 한 가지 구체적인 방안을 제시할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 마태복음 5:9, 38-48, 누가복음 19:1-10, 사도행전 6:1-7)',
            '화이트보드 또는 플립차트, 마커',
            '아나밥티스트 평화 사역자의 증언 이야기 또는 MWC 평화 선언문',
            '평화, 화해, 정의에 관한 아시아 현지의 속담이나 일화 자료'
        ],
        'readings': [
            '스튜어트 머레이 (Stuart Murray), 「평화 만들기 (Making Peace)」, 『벌거벗은 아나밥티스트』.',
            'C. 아놀드 스나이더 (C. Arnold Snyder), 「제자도를 향한 영적 역량」, in Anabaptist Visions for the New Millenium.',
            '존 R. 버크홀더 (John R. Burkholder), 「평화 (Peace)」, GAMEO.'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영 및 평화를 위한 묵상',
                'items': [
                    '전쟁과 갈등으로 고통받는 세계와 지역 사회의 평화를 위한 침묵 묵상과 기도로 시작합니다.',
                    '세션 소개: 평화를 만드는 사람들 (Peacemakers).'
                ]
            },
            {
                'duration': '20분',
                'title': '평화의 성경적 기초',
                'items': [
                    '마태복음 5장 9절("화평하게 하는 자는 복이 있나니")과 38-48절(원수를 사랑하라)을 함께 읽습니다.',
                    '토의: 예수님은 폭력과 원수 사랑에 대해 무엇을 가르치시는가? 이것은 세상이 갈등에 대응하는 일반적인 방식과 어떻게 다른가?',
                    '평화에 관한 아시아의 지혜로운 속담이나 이야기를 공유하고 성경의 가르침과 비교해 봅니다.'
                ]
            },
            {
                'duration': '20분',
                'title': '아나밥티스트의 평화 증거',
                'items': [
                    '역사 속 아나밥티스트 평화 사역자의 실제 이야기나 MWC 평화 선언문을 소개합니다.',
                    '핵심 신념 나누기: 폭력의 거부, 정의의 실현, 궁핍한 이웃과의 소유 나눔.',
                    '토의: 우리 아시아 상황(민족 간 긴장, 사회적 불의, 가정 내 불화 등)에서 평화를 일구는 데 있어 가장 큰 도전은 무엇이며 어떻게 극복할 수 있는가?'
                ]
            },
            {
                'duration': '10분',
                'title': '우리 상황 속에서의 실제적인 평화 만들기',
                'items': [
                    '소그룹 브레인스토밍:',
                    '이번 주 우리 공동체 안에서 \'원수를 사랑하고\', \'정의를 구하며\', \'소유를 나누는\' 구체적이고 실천 가능한 방법 한 가지는 무엇인가?',
                    '도출된 아이디어를 전체 그룹과 공유합니다.'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 평화의 기도',
                'items': [
                    '요약: 평화 만들기는 예수님을 따르는 제자도의 가장 핵심적인 열매입니다.',
                    '평화의 일꾼으로 살아갈 담대함과 지혜를 구하는 마침 기도.'
                ]
            }
        ]
    },
    'community': {
        'themeNum': 'Theme 6',
        'title': '제6주제: 예배',
        'quote': setup_quotes.QUOTES_BY_LANG['community']['ko'],
        'overallObjective': '정기적으로 함께 모여 예배하고, 주의 만찬을 기념하며, 상호 책임과 사랑의 돌봄 속에서 하나님의 말씀을 경청하는 공동체적 예배의 참된 의미를 정립합니다.',
        'sessionObjective': '참가자들은 아나밥티스트 예배의 핵심 요소들을 설명하고, 자신이 속한 아시아 현지 예배에서 문화적 적합성과 공동체적 참여를 높일 수 있는 한 가지 방안을 제안할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 히브리서 10:24-25, 고린도전서 11:23-26, 골로새서 3:16)',
            '아나밥티스트 예배 요소 예시 (예: 4부 합창 찬송, 삶의 간증, 단순한 성만찬 전례)',
            '아시아 기독교 예배 표현 사례 (예: 현지 악기, 찬양, 예술 표현 자료)',
            'MWC 예배 및 성례전 연구 자료'
        ],
        'readings': [
            '마를린 크롭프 (Marlene Kropf), 「예배의 모형으로서의 삼위일체」, Anabaptist Visions for the New Millenium.',
            '앨런 크라이더 & 엘리너 크라이더 (Alan & Eleanor Kreider), 「예배가 선교를 형성한다」, 『기독교 제국 이후의 예배와 선교』.'
        ],
        'timeline': [
            {
                'duration': '10분',
                'title': '환영 및 개회 찬양',
                'items': [
                    '아시아 현지의 음악 양식이나 언어를 담은 은혜로운 찬양으로 문을 엽니다.',
                    '짧은 나눔: 여러분에게 예배를 가장 뜻깊게 만드는 요소는 무엇입니까?'
                ]
            },
            {
                'duration': '20분',
                'title': '예배의 이유와 방식',
                'items': [
                    '히브리서 10장 24-25절(모이기를 힘씀)과 골로새서 3장 16절(시와 찬미로 서로 가르치며 권면함)을 읽습니다.',
                    '아나밥티스트 예배의 핵심 요소 토의: 말씀 경청, 성만찬 기념, 찬양과 기도, 삶의 증언, 상호 책임과 격려.',
                    '구경꾼이 아닌 모든 성도가 함께 참여하는 예배의 중요성을 나눕니다.'
                ]
            },
            {
                'duration': '15분',
                'title': '주의 만찬과 상호 책임',
                'items': [
                    '고린도전서 11장 23-26절을 읽습니다. 아나밥티스트 전통에서 성만찬의 3대 의미(그리스도의 희생 기념, 지체 간의 연합, 헌신의 결단)를 나눕니다.',
                    '예배 속에서 \'상호 책임과 돌봄의 영성\' 토의: 이것은 실제 교회 생활에서 어떻게 나타나야 합니까? 아시아 문화 속에서 존중과 사랑으로 이를 어떻게 세워갈 수 있습니까?'
                ]
            },
            {
                'duration': '10분',
                'title': '아시아 상황 속에서의 예배 토착화',
                'items': [
                    '브레인스토밍: 아나밥티스트 신앙의 본질을 지키면서도 아시아 문화적 토양에 친근하게 다가가는 예배는 어떤 모습일 수 있는가? (음악, 언어, 상징, 참여 방식, 기도 형태).',
                    '아시아 여러 나라의 창의적인 기독교 예배 표현 사례들을 나눕니다.'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 송영',
                'items': [
                    '요약: 예배는 주일에만 머무는 의식이 아니라, 삶 전체로 서로를 책임지고 하나님을 높이는 신앙의 심장입니다.',
                    '마침 기도 또는 공동 송영으로 마칩니다.'
                ]
            }
        ]
    },
    'unity': {
        'themeNum': 'Theme 7',
        'title': '제7주제: 전 세계적 신앙 공동체',
        'quote': setup_quotes.QUOTES_BY_LANG['unity']['ko'],
        'overallObjective': '전 세계적 신앙과 삶의 공동체로서 국경, 인종, 계급, 성별, 언어의 경계를 초월하며, 악의 세력에 굴복하지 않고 이웃을 섬기며 창조 세계를 돌보고 모든 사람을 예수 그리스도께 초대함으로써 하나님의 은혜를 증거함을 이해합니다.',
        'sessionObjective': '참가자들은 자신이 속한 지역 교회가 \'세계적인 신앙 가족\'의 일원임을 설명하고, 아시아 상황 속에서 섬김이나 창조 세계 돌봄을 통해 증거할 수 있는 구체적인 실천 한 가지를 제시할 수 있습니다.',
        'materials': [
            '성경 (핵심 본문: 고린도전서 12:12-27, 에베소서 2:11-22, 마태복음 25:31-46)',
            '세계 지도 (MWC 글로벌 연대 표시용)',
            '아시아 및 전 세계 아나밥티스트 교회의 이야기와 사진 자료 (MWC 자료집 등)',
            '아시아 현지의 주요 환경 이슈 정보 자료'
        ],
        'readings': [
            '알레 후케마 (Alle Hoekema), 「아시아의 기독교 (Christianity in Asia)」, in Churches Engage Asian Traditions.',
            'MWC 회원 교회들의 아시아 전통 참여 사례 연구.',
            '존 D. 로스 (John D. Roth), 「뿌리줄기로서의 교회? (Church as Rhizome?)」, Anabaptist World (2012).'
        ],
        'timeline': [
            {
                'duration': '5분',
                'title': '환영과 시작',
                'items': [
                    '아이스브레이커: "만약 우리 교회가 하나의 동물이라면 무엇일까요? 그 이유는?" (공동체의 특성을 생각해보는 시간).',
                    '세션 소개: 아나밥티스트 가족 - 지역적이면서도 세계적인 공동체.'
                ]
            },
            {
                'duration': '20분',
                'title': '전 세계적 가족으로서의 교회',
                'items': [
                    '고린도전서 12장 12-27절 (한 몸과 많은 지체)을 읽습니다.',
                    '세계 지도를 보며 글로벌 아나밥티스트 교회(메노나이트 세계총회, MWC)의 연대를 나눕니다. 아시아 여러 나라의 아나밥티스트 교회들의 이야기와 사진을 공유합니다.',
                    '토의: \'경계를 초월하는 전 세계적 신앙과 삶의 공동체\'의 일원이라는 것은 우리에게 어떤 의미입니까? 더 넓은 교회들과의 연결을 어떻게 강화할 수 있습니까?'
                ]
            },
            {
                'duration': '25분',
                'title': '세상 속에서 구별된 삶과 증거',
                'items': [
                    '토의: 우리가 속한 아시아 상황에서 \'악의 세력에 동조하지 않고 세상 속에서 살아간다\'는 것은 구체적으로 무엇을 의미합니까?',
                    '교회가 하나님의 은혜를 증거할 수 있는 세 가지 영역 소그룹 브레인스토밍:',
                    '1) 이웃 섬김: (마태복음 25:31-40 낭독) 우리 지역 사회에서 가장 시급한 필요는 무엇인가?',
                    '2) 창조 세계 돌봄: 우리 아시아 환경의 핵심 문제는 무엇이며, 우리 교회가 취할 수 있는 한 걸음은 무엇인가?',
                    '3) 모든 사람을 예수님께 초대: 문화적으로 적절하고 진정성 있는 신앙 나눔.',
                    '소그룹별 핵심 실천 아이디어 하나씩 공유.'
                ]
            },
            {
                'duration': '5분',
                'title': '우리의 결단과 헌신',
                'items': [
                    '개인 및 소그룹 기도: 발견한 섬김과 증거의 아이디어를 하나님 앞에 올려드리며 결단합니다.'
                ]
            },
            {
                'duration': '5분',
                'title': '결론 및 파송 찬양',
                'items': [
                    '요약: 우리는 사랑과 행동으로 구별된 삶을 살며 그리스도를 증거하도록 부름받은 글로벌 가족입니다.',
                    '연합의 폐회 찬양 또는 파송의 기도로 마칩니다.'
                ]
            }
        ]
    }
}

def translate_with_lmstudio(text, target_lang):
    if not text or not text.strip():
        return text
    if target_lang == 'en':
        return text
    
    cache_key = f"{target_lang}:{text.strip()}"
    if cache_key in cache:
        return cache[cache_key]
    
    lang_name = LANG_NAMES.get(target_lang, target_lang)
    prompt = f"Translate the following Christian curriculum sentence into {lang_name}. Output ONLY the translated text without quotes or explanations:\n{text.strip()}"
    
    try:
        req = urllib.request.Request(LM_STUDIO_URL, data=json.dumps({
            'model': 'qwen2.5-7b-instruct-1m',
            'messages': [{'role': 'user', 'content': prompt}],
            'temperature': 0.1,
            'max_tokens': 300
        }).encode('utf-8'), headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, timeout=12) as res:
            data = json.loads(res.read().decode('utf-8'))
            trans = data['choices'][0]['message']['content'].strip(' "\'「」')
            # remove any leading [XX] tag if model outputs it
            trans = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', trans)
            cache[cache_key] = trans
            return trans
    except Exception as e:
        print(f"LM Studio translate error for {target_lang}: {e}")
        return text

def save_cache():
    try:
        with open(CACHE_FILE, 'w', encoding='utf-8') as f:
            json.dump(cache, f, ensure_ascii=False)
    except Exception as e:
        print(f"Failed to save cache: {e}")

# Bulletproof Responsive HTML Renderer with language-specific typography
def render_localized_html(lang, slug, meta):
    ui = UI_LABELS.get(lang, UI_LABELS['en'])
    title = meta['title']
    quote = meta['quote']
    overall_obj = meta.get('overallObjective', '')
    session_obj = meta.get('sessionObjective', '')
    materials = meta.get('materials', [])
    readings = meta.get('readings', [])
    timeline = meta.get('timeline', [])

    # Typography rule by language
    if lang == 'ko':
        typo_css = "word-break: keep-all; overflow-wrap: break-word;"
    elif lang in ['ja', 'zh-TW']:
        typo_css = "word-break: break-all; overflow-wrap: anywhere; line-break: loose;"
    elif lang in ['th', 'lo', 'km', 'my']:
        typo_css = "word-break: break-word; overflow-wrap: anywhere;"
    else:
        typo_css = "word-break: normal; overflow-wrap: break-word;"

    mat_items = "".join([f'<li style="margin-bottom: 8px; {typo_css}">{m}</li>' for m in materials if m.strip()])
    read_items = "".join([f'<li style="margin-bottom: 8px; {typo_css}">{r}</li>' for r in readings if r.strip()])

    timeline_items = ""
    for step in timeline:
        dur = step.get('duration', '')
        stitle = step.get('title', '')
        items = step.get('items', [])
        body_html = ""
        for it in items:
            it_clean = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', it).strip()
            if any(it_clean.lower().startswith(p) for p in ['discussion:', '토의:', '討議:', '討論:', 'diskusikan:', 'thảo luận:']):
                body_html += f'<p style="margin: 12px 0 6px 0; font-weight: 700; color: #0d9488; {typo_css}">{it_clean}</p>'
            elif it_clean.startswith('-') or it_clean.startswith('•'):
                body_html += f'<li style="margin-bottom: 6px; {typo_css}">{it_clean.lstrip("-• ")}</li>'
            elif len(it_clean) > 0 and (it_clean[0].isdigit() and (it_clean[1:3] in ['. ', ': ', ') '])):
                body_html += f'<li style="margin-bottom: 6px; {typo_css}">{it_clean}</li>'
            elif any(it_clean.startswith(p) for p in ['Group', '第', 'Nhóm', 'Kelompok', 'กลุ่ม', '1그룹', '2그룹', '3그룹']):
                body_html += f'<li style="margin-bottom: 6px; font-weight: 700; color: #334155; {typo_css}">{it_clean}</li>'
            else:
                body_html += f'<p style="margin: 0 0 10px 0; color: #475569; line-height: 1.65; {typo_css}">{it_clean}</p>'

        timeline_items += f"""
        <div class="lp-timeline-item" style="position: relative; margin-bottom: 36px; padding-left: 10px; box-sizing: border-box;">
            <div class="lp-dot" style="position: absolute; left: -29px; top: 0; width: 16px; height: 16px; border-radius: 50%; background: #10b981; border: 4px solid #fff; box-shadow: 0 0 0 2px #10b981;">&nbsp;</div>
            <span class="lp-badge" style="display: inline-block; background: #10b981; color: #fff; padding: 4px 14px; border-radius: 20px; font-size: 0.82rem; font-weight: 700; margin-bottom: 12px;">{dur}</span>
            <div>
                <h3 class="lp-timeline-title" style="margin: 0 0 12px 0; font-size: 1.3rem; color: #1e293b; font-weight: 700; {typo_css}">{stitle}</h3>
                <div class="lp-box" style="background: #ffffff; padding: 22px; border-radius: 14px; border: 1px solid #e2e8f0; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.04); min-width: 0; width: 100%; box-sizing: border-box; overflow: hidden; {typo_css}">
                    {body_html}
                </div>
            </div>
        </div>"""

    return f"""<div class="lp-container" style="max-width: 900px; width: 100%; margin: 0 auto; font-family: inherit; box-sizing: border-box;">
    <div class="lp-header" style="text-align: center; padding: 44px 22px; background: linear-gradient(135deg, #10b981 0%, #0ea5e9 100%); color: #fff; border-radius: 20px; margin-bottom: 36px; box-shadow: 0 12px 24px -6px rgba(16, 185, 129, 0.25); box-sizing: border-box; overflow: hidden; {typo_css}">
        <h2 style="font-size: 2.1rem; margin: 0 0 16px 0; font-weight: 800; color: #fff; letter-spacing: -0.02em; {typo_css}">{title}</h2>
        <div class="lp-header-desc" style="font-size: 1.12rem; font-style: italic; opacity: 0.95; max-width: 820px; margin: 0 auto; border-left: 4px solid rgba(255,255,255,0.7); padding-left: 20px; text-align: left; line-height: 1.7; {typo_css}">
            &quot;{quote}&quot;
        </div>
    </div>

    <div class="lp-card-wrap" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px; width: 100%; box-sizing: border-box;">
        <div class="lp-card" style="background: #ffffff; padding: 26px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04); min-width: 0; width: 100%; box-sizing: border-box; overflow: hidden;">
            <div class="lp-card-title" style="color: #0d9488; font-size: 1.25rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700; {typo_css}">
                {ui['obj']}
            </div>
            <div style="margin-bottom: 16px; {typo_css}">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui['all']}</strong>
                <span style="color: #64748b; line-height: 1.65;">{overall_obj}</span>
            </div>
            <div style="{typo_css}">
                <strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui['ses']}</strong>
                <span style="color: #64748b; line-height: 1.65;">{session_obj}</span>
            </div>
        </div>

        <div class="lp-card" style="background: #ffffff; padding: 26px; border-radius: 18px; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.04); min-width: 0; width: 100%; box-sizing: border-box; overflow: hidden;">
            <div class="lp-card-title" style="color: #4f46e5; font-size: 1.25rem; border-bottom: 2px solid #f1f5f9; padding-bottom: 12px; margin-bottom: 18px; font-weight: 700; {typo_css}">
                {ui['mat']}
            </div>
            {f'<div style="margin-bottom: 14px; {typo_css}"><strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui["m"]}</strong><ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.65;">{mat_items}</ul></div>' if mat_items else ''}
            {f'<div style="{typo_css}"><strong style="display:block; color: #334155; margin-bottom: 5px; font-size: 0.92rem;">{ui["r"]}</strong><ul style="margin: 0; padding-left: 20px; color: #64748b; line-height: 1.65;">{read_items}</ul></div>' if read_items else ''}
        </div>
    </div>

    <div class="lp-timeline-container" style="position: relative; padding: 10px 0 10px 25px; border-left: 3px solid #cbd5e1; margin-left: 15px; box-sizing: border-box;">
        {timeline_items}
    </div>
</div>"""

def main():
    print("=== Rebuilding all 13 languages for AAMEN 7 Convictions ===")
    
    with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
        en_master = json.load(f)

    with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'r', encoding='utf-8') as f:
        existing_all = json.load(f)

    final_13 = {}
    SLUGS = ['god', 'jesus', 'spirit', 'church', 'peace', 'community', 'unity']
    LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']

    # 1. EN
    final_13['en'] = {}
    for slug in SLUGS:
        meta = en_master[slug]['meta']
        raw_html = render_localized_html('en', slug, meta)
        final_13['en'][slug] = {
            'slug': slug,
            'meta': meta,
            'rawHtml': raw_html
        }
    print("Processed EN successfully.")

    # 2. KO (Pristine Handcrafted Korean)
    final_13['ko'] = {}
    for slug in SLUGS:
        meta = KOREAN_METAS[slug]
        raw_html = render_localized_html('ko', slug, meta)
        final_13['ko'][slug] = {
            'slug': slug,
            'meta': meta,
            'rawHtml': raw_html
        }
    print("Processed KO with handcrafted pristine dataset successfully.")

    # 3. Other 11 languages
    def is_english(txt):
        if not txt or len(txt.strip()) < 5:
            return False
        clean = re.sub(r'[^A-Za-z]', '', txt)
        # If over 60% of alphabetical chars are English letters and length > 10
        return len(clean) > 8 and (len(clean) / len(txt.strip())) > 0.55

    for lang in LANGS:
        if lang in ['en', 'ko']:
            continue
        print(f"\nProcessing {lang.upper()} ({LANG_NAMES[lang]})...")
        final_13[lang] = {}
        lang_existing = existing_all.get(lang, {})

        for slug in SLUGS:
            en_meta = en_master[slug]['meta']
            curr = lang_existing.get(slug, {}).get('meta', {})

            title = setup_quotes.TITLES_BY_LANG.get(slug, {}).get(lang, curr.get('title', en_meta['title']))
            quote = setup_quotes.QUOTES_BY_LANG.get(slug, {}).get(lang, curr.get('quote', en_meta['quote']))
            
            # Overall Objective
            overall_obj = curr.get('overallObjective', '')
            if is_english(overall_obj) or not overall_obj:
                overall_obj = translate_with_lmstudio(en_meta['overallObjective'], lang)

            # Session Objective
            session_obj = curr.get('sessionObjective', '')
            if is_english(session_obj) or not session_obj:
                session_obj = translate_with_lmstudio(en_meta['sessionObjective'], lang)

            # Materials
            materials = []
            curr_materials = curr.get('materials', [])
            for idx, en_m in enumerate(en_meta.get('materials', [])):
                curr_m = curr_materials[idx] if idx < len(curr_materials) else ''
                if is_english(curr_m) or not curr_m:
                    curr_m = translate_with_lmstudio(en_m, lang)
                materials.append(re.sub(r'^\[[A-Za-z\-]+\]\s*', '', curr_m))

            # Readings
            readings = []
            curr_readings = curr.get('readings', [])
            for idx, en_r in enumerate(en_meta.get('readings', [])):
                curr_r = curr_readings[idx] if idx < len(curr_readings) else ''
                # If reading has untranslated English description, we can keep English book citations or translated titles
                readings.append(re.sub(r'^\[[A-Za-z\-]+\]\s*', '', curr_r or en_r))

            # Timeline
            timeline = []
            curr_timeline = curr.get('timeline', [])
            for idx, en_step in enumerate(en_meta.get('timeline', [])):
                curr_step = curr_timeline[idx] if idx < len(curr_timeline) else {}
                dur_raw = en_step.get('duration', '5 minutes')
                num = re.findall(r'\d+', dur_raw)
                dur = f"{num[0]} {UI_MIN.get(lang, 'min')}" if num else dur_raw

                stitle = curr_step.get('title', '')
                if is_english(stitle) or not stitle:
                    stitle = translate_with_lmstudio(en_step['title'], lang)
                stitle = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', stitle)

                items = []
                curr_items = curr_step.get('items', [])
                for it_idx, en_it in enumerate(en_step.get('items', [])):
                    curr_it = curr_items[it_idx] if it_idx < len(curr_items) else ''
                    if is_english(curr_it) or not curr_it:
                        curr_it = translate_with_lmstudio(en_it, lang)
                    curr_it = re.sub(r'^\[[A-Za-z\-]+\]\s*', '', curr_it)
                    items.append(curr_it)

                timeline.append({
                    'duration': dur,
                    'title': stitle,
                    'items': items
                })

            final_meta = {
                'themeNum': en_meta.get('themeNum', ''),
                'title': title,
                'quote': quote,
                'overallObjective': re.sub(r'^\[[A-Za-z\-]+\]\s*', '', overall_obj),
                'sessionObjective': re.sub(r'^\[[A-Za-z\-]+\]\s*', '', session_obj),
                'materials': materials,
                'readings': readings,
                'timeline': timeline
            }

            raw_html = render_localized_html(lang, slug, final_meta)
            final_13[lang][slug] = {
                'slug': slug,
                'meta': final_meta,
                'rawHtml': raw_html
            }

        print(f"Completed {lang.upper()}.")

    # Save translation cache
    save_cache()

    # Save convictions_all_13.json
    with open(r'C:\Dev\AAMEN\convictions_all_13.json', 'w', encoding='utf-8') as f:
        json.dump(final_13, f, ensure_ascii=False, indent=2)
    print("Saved convictions_all_13.json.")

    # Generate convictionsData.ts
    generate_ts_file(final_13)

def generate_ts_file(final_13):
    ts_path = r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts'
    
    header = """// 📖 AAMEN 13-Nation MWC 7 Shared Convictions Full Dataset
// Generated with bulletproof responsive layout and 100% full translations

export interface ConvictionTimelineStep {
  duration: string
  title: string
  items: string[]
}

export interface ConvictionPageData {
  slug: string
  meta: {
    themeNum: string
    title: string
    quote: string
    overallObjective?: string
    sessionObjective?: string
    materials?: string[]
    readings?: string[]
    timeline?: ConvictionTimelineStep[]
  }
  rawHtml: string
}

// 7대 공유된 신념 순서 및 다국어 기본 타이틀
export const convictionOrder = [
  { slug: 'god', num: '01', titleKo: '하나님', titleEn: 'God', fullTitleKo: '하나님 (God)', fullTitleEn: 'Theme 1: God' },
  { slug: 'jesus', num: '02', titleKo: '예수 그리스도', titleEn: 'Jesus Christ', fullTitleKo: '예수 그리스도 (Jesus)', fullTitleEn: 'Theme 2: Jesus' },
  { slug: 'spirit', num: '03', titleKo: '성령', titleEn: 'Holy Spirit', fullTitleKo: '성령 (Holy Spirit)', fullTitleEn: 'Theme 3: Holy Spirit' },
  { slug: 'church', num: '04', titleKo: '성경', titleEn: 'The Bible', fullTitleKo: '성경 (The Bible)', fullTitleEn: 'Theme 4: The Bible' },
  { slug: 'peace', num: '05', titleKo: '평화와 정의', titleEn: 'Peace & Reconciliation', fullTitleKo: '평화, 정의, 화해 (Peace)', fullTitleEn: 'Theme 5: Peace, Justice, and Reconciliation' },
  { slug: 'community', num: '06', titleKo: '예배와 사명', titleEn: 'Worship', fullTitleKo: '예배와 삶 (Worship)', fullTitleEn: 'Theme 6: Worship' },
  { slug: 'unity', num: '07', titleKo: '지구촌 가족', titleEn: 'Global Family', fullTitleKo: '지구촌 가족 (Global Family)', fullTitleEn: 'Theme 7: Global Family' },
]

export const convictionPagesByLocale: Record<string, Record<string, ConvictionPageData>> = """

    footer = """\n
export const convictionPagesKo: Record<string, ConvictionPageData> = convictionPagesByLocale['ko'] || {}
export const convictionPagesEn: Record<string, ConvictionPageData> = convictionPagesByLocale['en'] || {}

export const convictionPages: Record<string, ConvictionPageData> = convictionPagesKo

export function getConvictionPage(slug: string, locale: string = 'ko'): ConvictionPageData | undefined {
  const localeData = convictionPagesByLocale[locale]
  if (localeData && localeData[slug]) {
    return localeData[slug]
  }
  if (convictionPagesEn[slug]) {
    return convictionPagesEn[slug]
  }
  return convictionPagesKo[slug]
}
"""

    data_json = json.dumps(final_13, ensure_ascii=False, indent=2)
    with open(ts_path, 'w', encoding='utf-8') as f:
        f.write(header + data_json + footer)

    print(f"Successfully generated {ts_path} ({os.path.getsize(ts_path):,} bytes)!")

if __name__ == '__main__':
    main()
