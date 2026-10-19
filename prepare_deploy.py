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

# API 폴더 초기화 및 백엔드 PHP 복사 (Next.js가 생성한 정적 api 더미 파일 완전 제거)
api_dir = os.path.join(deploy_dir, 'api')
if os.path.exists(api_dir):
    shutil.rmtree(api_dir)
os.makedirs(api_dir, exist_ok=True)

print("Copying backend PHP to deploy/api...")
for item in os.listdir(backend_dir):
    src = os.path.join(backend_dir, item)
    dst = os.path.join(api_dir, item)
    if os.path.isfile(src):
        shutil.copy2(src, dst)
        print(f"  Copied {item}")

# uploads 기본 폴더 생성
for sub in ['posts', 'resources', 'banners', 'notices']:
    up_sub = os.path.join(deploy_dir, 'uploads', sub)
    os.makedirs(up_sub, exist_ok=True)
    # .gitkeep 생성하여 빈 폴더 유지
    with open(os.path.join(up_sub, '.gitkeep'), 'w') as f:
        f.write('')

# .htaccess 작성
htaccess_content = """# ============================================================================
# AAMEN Apache Configuration (.htaccess)
# ============================================================================

Options -MultiViews
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# 1. SSL 항상 사용 (HTTP -> HTTPS 강제 리다이렉트)
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# 2. RESTful PHP API 라우팅 (정적 파일 및 디렉토리 검사보다 최우선 실행)
RewriteRule ^api/setup_db/?$ api/setup_db.php [L,QSA]
RewriteRule ^api/upload/?$ api/upload.php [L,QSA]
RewriteRule ^api/posts/([a-zA-Z0-9_\\-]+)/comments/?$ api/comments.php?post_id=$1 [L,QSA]
RewriteRule ^api/posts/([a-zA-Z0-9_\\-]+)/?$ api/posts.php?id=$1 [L,QSA]
RewriteRule ^api/posts/?$ api/posts.php [L,QSA]
RewriteRule ^api/comments/?$ api/comments.php [L,QSA]
RewriteRule ^api/prayers/?$ api/prayers.php [L,QSA]
RewriteRule ^api/members/?$ api/members.php [L,QSA]
RewriteRule ^api/banners/?$ api/banners.php [L,QSA]
RewriteRule ^api/partners/?$ api/partners.php [L,QSA]
RewriteRule ^api/calendar/?$ api/calendar.php [L,QSA]

# 3. 정적 파일 및 디렉터리 존재 시 바로 서빙 (uploads, _next, css, js 등)
RewriteCond %{REQUEST_FILENAME} -f [OR]
RewriteCond %{REQUEST_FILENAME} -d
RewriteRule ^ - [L]

# 4. Next.js trailing slash 및 HTML 서빙
RewriteCond %{DOCUMENT_ROOT}/$1/index.html -f
RewriteRule ^(.*)/?$ $1/index.html [L]

RewriteCond %{DOCUMENT_ROOT}/$1.html -f
RewriteRule ^(.*)$ $1.html [L]

# 5. Fallback: index.html
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^.*$ index.html [L]

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
