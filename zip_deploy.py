import os
import zipfile

def zipdir(path, ziph):
    for root, dirs, files in os.walk(path):
        for file in files:
            full_path = os.path.join(root, file)
            # 상대 경로를 구하고 모든 백슬래시를 포워드 슬래시로 변환
            rel_path = os.path.relpath(full_path, path).replace('\\', '/')
            ziph.write(full_path, rel_path)

if __name__ == '__main__':
    zip_path = r'C:\Dev\AAMEN\deploy.zip'
    deploy_dir = r'C:\Dev\AAMEN\deploy'
    if os.path.exists(zip_path):
        os.remove(zip_path)
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        zipdir(deploy_dir, zipf)
    print("Created deploy.zip successfully with forward slashes!")
