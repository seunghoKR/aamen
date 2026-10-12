import os
import gzip
import re

backup_root = r'y:\SynologyDrive\AAMEN\backup'
dump_path = None
for root, dirs, files in os.walk(backup_root):
    for f in files:
        if f.endswith('202512042214.sql.gz'): # 최신 덤프
            dump_path = os.path.join(root, f)
            break
    if dump_path: break

if not dump_path:
    for root, dirs, files in os.walk(backup_root):
        for f in files:
            if f.endswith('.sql.gz'):
                dump_path = os.path.join(root, f)
                break
        if dump_path: break

print("Using dump:", dump_path)
with gzip.open(dump_path, 'rt', encoding='utf-8', errors='ignore') as f:
    text = f.read()

# rx_documents 파싱
# 보통 (document_srl, module_srl, category_srl, lang_code, is_notice, title, content, ...) 형태
docs = re.findall(r"\(([0-9]+),\s*([0-9]+),\s*([0-9]+),\s*'([^']*)',\s*'([^']*)',\s*'([^']*)',\s*'(.*?)',\s*([0-9]+)", text)
print(f"Found {len(docs)} documents by regex")

# 더 관대한 방식으로 rx_documents 추출
pos = text.find("INSERT INTO `rx_documents` VALUES")
if pos != -1:
    end_pos = text.find(";\n", pos)
    chunk = text[pos:end_pos]
    print("Found rx_documents block length:", len(chunk))
    # 제목들 추출
    titles = re.findall(r",\s*'([^']{2,200})',\s*'<p", chunk)
    print("Document titles with HTML content:")
    for t in titles:
        print("  -", t)

# rx_modules (페이지/게시판 목록)
pos_m = text.find("INSERT INTO `rx_modules` VALUES")
if pos_m != -1:
    end_m = text.find(";\n", pos_m)
    chunk_m = text[pos_m:end_m]
    mid_matches = re.findall(r"'([a-zA-Z0-9_\-]+)',\s*'([a-zA-Z0-9_\-]+)'", chunk_m)
    print("\nModules / Mid found:")
    for m in mid_matches[:20]:
        print("  -", m)
