import os
import gzip

backup_root = r'y:\SynologyDrive\AAMEN\backup'
dump_path = None
for root, dirs, files in os.walk(backup_root):
    for f in files:
        if f.endswith('202512042214.sql.gz'):
            dump_path = os.path.join(root, f)
            break

print("Found dump:", dump_path)
with gzip.open(dump_path, 'rt', encoding='utf-8', errors='ignore') as f:
    text = f.read()

pos = text.find('INSERT INTO `rx_documents` VALUES')
end_pos = text.find(';\n', pos)
print("=== RX_DOCUMENTS ===")
print(text[pos:end_pos])

pos_m = text.find('INSERT INTO `rx_menu_item` VALUES')
if pos_m != -1:
    end_m = text.find(';\n', pos_m)
    print("=== RX_MENU_ITEM ===")
    print(text[pos_m:pos_m+1500])
