import os
import shutil

deploy_dir = r'C:\Dev\AAMEN\deploy'
out_dir = r'C:\Dev\AAMEN\renewal\frontend\out'
backend_dir = r'C:\Dev\AAMEN\renewal\backend'

print("Clearing deploy dir...")
if os.path.exists(deploy_dir):
    shutil.rmtree(deploy_dir)
os.makedirs(deploy_dir, exist_ok=True)

print("Copying out to deploy...")
shutil.copytree(out_dir, deploy_dir, dirs_exist_ok=True)

# 한국어(ko) 폴더 내용을 루트에도 복사 (prefix 없는 URL 지원)
ko_dir = os.path.join(deploy_dir, 'ko')
if os.path.exists(ko_dir):
    print("Copying ko/ subdirectories to root for non-prefixed URLs (/convictions, /community, /admin, etc.)...")
    for item in os.listdir(ko_dir):
        src = os.path.join(ko_dir, item)
        dst = os.path.join(deploy_dir, item)
        if os.path.isdir(src):
            shutil.copytree(src, dst, dirs_exist_ok=True)
            print(f"  Copied dir {item} to root")
        else:
            if item == 'index.html':
                # 루트 index.html은 메인 홈페이지로 유지
                shutil.copy2(src, dst)
                print("  Copied ko/index.html to root index.html")

# API 폴더 복사
api_dir = os.path.join(deploy_dir, 'api')
os.makedirs(api_dir, exist_ok=True)
print("Copying backend PHP to deploy/api...")
for item in os.listdir(backend_dir):
    src = os.path.join(backend_dir, item)
    dst = os.path.join(api_dir, item)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"  Copied {item}")

# .htaccess 작성
htaccess_content = """# ============================================================================
# AAMEN Apache Configuration (.htaccess)
# ============================================================================

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# 1. SSL 항상 사용 (HTTP -> HTTPS 강제 리다이렉트)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. RESTful PHP API 라우팅
RewriteRule ^api/setup_db/?$ api/setup_db.php [L,QSA]
RewriteRule ^api/posts/([a-zA-Z0-9_\\-]+)/comments/?$ api/comments.php?post_id=$1 [L,QSA]
RewriteRule ^api/posts/([a-zA-Z0-9_\\-]+)/?$ api/posts.php?id=$1 [L,QSA]
RewriteRule ^api/posts/?$ api/posts.php [L,QSA]
RewriteRule ^api/comments/?$ api/comments.php [L,QSA]
RewriteRule ^api/prayers/?$ api/prayers.php [L,QSA]
RewriteRule ^api/members/?$ api/members.php [L,QSA]
RewriteRule ^api/banners/?$ api/banners.php [L,QSA]

# 3. 정적 파일 및 디렉터리 존재 시 바로 서빙
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 4. 끝에 슬래시 없는 경로를 index.html로 매핑
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^(.*)/?$ $1/index.html [L]

</IfModule>

DirectoryIndex index.html index.php
AddDefaultCharset UTF-8
AddType text/html .html
AddType application/json .json
AddType application/javascript .js
AddType text/css .css
"""

with open(os.path.join(deploy_dir, '.htaccess'), 'w', encoding='utf-8') as f:
    f.write(htaccess_content)

print(".htaccess created successfully!")
