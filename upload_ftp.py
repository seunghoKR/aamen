import ftplib
import os
import sys

SERVERS = {
    "prod": {
        "host": "115.68.168.246",
        "user": "aamen1",
        "pass": "seungho0409#",
        "domain": "https://aamen.net"
    },
    "test": {
        "host": "115.68.168.242",
        "user": "aamen2",
        "pass": "seungho0409#",
        "domain": "https://aamen2.iwinv.net"
    }
}

def upload_file(ftp, local_path, remote_path):
    print(f"Uploading {local_path} -> {remote_path}...")
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f, 32768)
    print(f"Done uploading {remote_path}!")

def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "prod"
    if target not in SERVERS:
        print(f"Unknown target: {target}. Available: prod, test")
        sys.exit(1)

    cfg = SERVERS[target]
    print(f"=== Deploying to {target.upper()} ({cfg['domain']}) on {cfg['host']} ===")

    ftp = ftplib.FTP(cfg['host'], timeout=30)
    ftp.login(cfg['user'], cfg['pass'])
    print(f"Logged in as {cfg['user']}!")

    ftp.cwd("public_html")
    print("Current dir:", ftp.pwd())

    upload_file(ftp, r"C:\Dev\AAMEN\deploy.zip", "deploy.zip")
    upload_file(ftp, r"C:\Dev\AAMEN\clean_unzip.php", "clean_unzip.php")

    ftp.quit()
    print(f"All files uploaded successfully to {target.upper()} ({cfg['domain']})!")

    # 실서버 압축 해제 자동 실행
    print(f"Triggering unzipper via HTTP: {cfg['domain']}/clean_unzip.php ...")
    try:
        import urllib.request
        import ssl
        ctx = ssl.create_default_context()
        ctx.check_hostname = False
        ctx.verify_mode = ssl.CERT_NONE
        req = urllib.request.Request(f"{cfg['domain']}/clean_unzip.php", headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req, timeout=90, context=ctx) as response:
            res_body = response.read().decode('utf-8')
            print(f"Unzip response: {res_body}")
    except Exception as e:
        print(f"Warning: Could not trigger unzip via HTTP: {e}")

if __name__ == "__main__":
    main()
