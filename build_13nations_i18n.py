# -*- coding: utf-8 -*-
"""
AAMEN 13개국 MWC 7대 신념 교안 & 요약 페이지 완역 데이터셋 빌더
13개 언어: ko, en, ja, zh-TW, vi, id, th, my, hi, ne, km, lo, mn
"""

import json, sys

sys.stdout.reconfigure(encoding='utf-8')

# 13개 언어 정의
LANGS = ['ko', 'en', 'ja', 'zh-TW', 'vi', 'id', 'th', 'my', 'hi', 'ne', 'km', 'lo', 'mn']

print("Building 13-nation translations dataset...")
