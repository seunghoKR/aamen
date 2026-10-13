import re

with open(r'C:\Dev\AAMEN\renewal\frontend\src\data\convictionsData.ts', 'r', encoding='utf-8') as f:
    text = f.read()

keys = re.findall(r'^\s{2}"([a-zA-Z0-9_\-]+)":\s*\{', text, re.MULTILINE)
print("Keys:", keys)
