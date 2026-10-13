# -*- coding: utf-8 -*-
import json, os, sys

sys.stdout.reconfigure(encoding='utf-8')

with open(r'C:\Dev\AAMEN\parsed_en_lessons.json', 'r', encoding='utf-8') as f:
    en_lessons = f.read()
print("Loaded en_lessons successfully, length:", len(en_lessons))
