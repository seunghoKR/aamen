# -*- coding: utf-8 -*-
"""
AAMEN 13-Nation Full Dataset Generator
Generates full JSON and TypeScript data for all 13 Asian languages
"""

import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

# Read baseline English data
with open(r'C:\Dev\AAMEN\convictions_en_data.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Read baseline Korean data from convictionsData.ts
with open(r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts', 'r', encoding='utf-8') as f:
    ts_text = f.read()

p1 = ts_text.find('convictionPagesKo: Record<string, ConvictionPageData> = ') + len('convictionPagesKo: Record<string, ConvictionPageData> = ')
p2 = ts_text.find('// 영어 (Y:\\SynologyDrive\\AAMEN\\source')
ko_pages_raw = ts_text[p1:p2].strip().rstrip(';')

# 13개 언어 정의
LANGS_INFO = {
    'ko': {'name': '한국어', 'flag': '🇰🇷', 'themePrefix': '주제'},
    'en': {'name': 'English', 'flag': '🌐', 'themePrefix': 'Theme'},
    'ja': {'name': '日本語', 'flag': '🇯🇵', 'themePrefix': '主題'},
    'zh-TW': {'name': '繁體中文', 'flag': '🇹🇼', 'themePrefix': '主題'},
    'vi': {'name': 'Tiếng Việt', 'flag': '🇻🇳', 'themePrefix': 'Chủ đề'},
    'id': {'name': 'Bahasa Indonesia', 'flag': '🇮🇩', 'themePrefix': 'Tema'},
    'th': {'name': 'ภาษาไทย', 'flag': '🇹🇭', 'themePrefix': 'หัวข้อที่'},
    'my': {'name': 'မြန်မာစာ', 'flag': '🇲🇲', 'themePrefix': 'အကြောင်းအရာ'},
    'hi': {'name': 'हिन्दी', 'flag': '🇮🇳', 'themePrefix': 'विषय'},
    'ne': {'name': 'नेपाली', 'flag': '🇳🇵', 'themePrefix': 'विषय'},
    'km': {'name': 'ភាសាខ្មែរ', 'flag': '🇰🇭', 'themePrefix': 'ប្រធានបទ'},
    'lo': {'name': 'ພາສາລາວ', 'flag': '🇱🇦', 'themePrefix': 'ຫົວຂໍ້'},
    'mn': {'name': 'Монгол хэл', 'flag': '🇲🇳', 'themePrefix': 'Сэдэв'},
}

# UI 번역 레이블 (학습 목표, 준비물, 시간 등)
UI_LABELS = {
    'ko': {'objectives': '🎯 학습 목표', 'overall': '전체 목표:', 'session': '세션 목표:', 'materials': '📚 준비물 및 읽을거리', 'mat': '준비물:', 'read': '필독서:'},
    'en': {'objectives': '🎯 Learning Objectives', 'overall': 'Overall Objective:', 'session': 'One-Hour Session Objective:', 'materials': '📚 Materials & Required Readings', 'mat': 'Materials:', 'read': 'Required Readings:'},
    'ja': {'objectives': '🎯 学習目標', 'overall': '全体目標:', 'session': 'セッション目標:', 'materials': '📚 準備物および必読書', 'mat': '準備物:', 'read': '必読文献:'},
    'zh-TW': {'objectives': '🎯 學習目標', 'overall': '整體目標:', 'session': '一小時課程目標:', 'materials': '📚 課前準備與必讀材料', 'mat': '所需材料:', 'read': '必讀書目:'},
    'vi': {'objectives': '🎯 Mục tiêu học tập', 'overall': 'Mục tiêu tổng quát:', 'session': 'Mục tiêu phiên 1 giờ:', 'materials': '📚 Tài liệu & Bài đọc bắt buộc', 'mat': 'Tài liệu:', 'read': 'Bài đọc bắt buộc:'},
    'id': {'objectives': '🎯 Tujuan Pembelajaran', 'overall': 'Tujuan Keseluruhan:', 'session': 'Tujuan Sesi Satu Jam:', 'materials': '📚 Bahan & Bacaan Wajib', 'mat': 'Bahan:', 'read': 'Bacaan Wajib:'},
    'th': {'objectives': '🎯 วัตถุประสงค์การเรียนรู้', 'overall': 'วัตถุประสงค์โดยรวม:', 'session': 'วัตถุประสงค์ของบทเรียน 1 ชั่วโมง:', 'materials': '📚 อุปกรณ์และบทอ่านที่จำเป็น', 'mat': 'อุปกรณ์:', 'read': 'บทอ่านที่จำเป็น:'},
    'my': {'objectives': '🎯 သင်ယူမှု ရည်မှန်းချက်များ', 'overall': 'အလုံးစုံ ရည်မှန်းချက်:', 'session': 'တစ်နာရီ သင်ခန်းစာ ရည်မှန်းချက်:', 'materials': '📚 လိုအပ်သော အထောက်အကူပြု ပစ္စည်းများနှင့် ဖတ်ရှုရန်များ', 'mat': 'ပစ္စည်းများ:', 'read': 'ဖတ်ရှုရန်များ:'},
    'hi': {'objectives': '🎯 सीखने के उद्देश्य', 'overall': 'समग्र उद्देश्य:', 'session': 'एक घंटे के सत्र का उद्देश्य:', 'materials': '📚 सामग्री और अनिवार्य अध्ययन', 'mat': 'सामग्री:', 'read': 'अनिवार्य अध्ययन:'},
    'ne': {'objectives': '🎯 सिकाइका उद्देश्यहरू', 'overall': 'समग्र उद्देश्य:', 'session': 'एक घण्टाको सत्रको उद्देश्य:', 'materials': '📚 सामग्री र आवश्यक अध्ययन', 'mat': 'सामग्री:', 'read': 'आवश्यक अध्ययन:'},
    'km': {'objectives': '🎯 គោលបំណងនៃការរៀនសូត្រ', 'overall': 'គោលបំណងរួម៖', 'session': 'គោលបំណងមេរៀនមួយម៉ោង៖', 'materials': '📚 សម្ភារៈ និងអត្ថបទអានចាំបាច់', 'mat': 'សម្ភារៈ៖', 'read': 'អត្ថបទអានចាំបាច់៖'},
    'lo': {'objectives': '🎯 ຈຸດປະສົງການຮຽນຮູ້', 'overall': 'ຈຸດປະສົງລວມ:', 'session': 'ຈຸດປະສົງບົດຮຽນ 1 ຊົ່ວໂມງ:', 'materials': '📚 ອຸປະກອນ ແລະ ບົດອ່ານທີ່ຈຳເປັນ', 'mat': 'ອຸປະກອນ:', 'read': 'ບົດອ່ານທີ່ຈຳເປັນ:'},
    'mn': {'objectives': '🎯 Суралцах зорилго', 'overall': 'Ерөнхий зорилго:', 'session': 'Нэг цагийн хичээлийн зорилго:', 'materials': '📚 Хэрэглэгдэхүүн ба унших материалууд', 'mat': 'Хэрэглэгдэхүүн:', 'read': 'Унших материал:'},
}

print("Base setup ready.")
