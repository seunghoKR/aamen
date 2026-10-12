import ftplib
import os

FTP_HOST = "115.68.168.242"
FTP_USER = "aamen2"
FTP_PASS = "seungho0409#"

def upload_file(ftp, local_path, remote_path):
    print(f"Uploading {local_path} -> {remote_path}...")
    with open(local_path, "rb") as f:
        ftp.storbinary(f"STOR {remote_path}", f, 32768)
    print(f"Done uploading {remote_path}!")

def main():
    print(f"Connecting to FTP {FTP_HOST}...")
    ftp = ftplib.FTP(FTP_HOST)
    ftp.login(FTP_USER, FTP_PASS)
    print("Logged in!")

    print("Changing to public_html...")
    ftp.cwd("public_html")
    print("Current dir:", ftp.pwd())

    # 업로드 deploy.zip
    upload_file(ftp, r"C:\Dev\AAMEN\deploy.zip", "deploy.zip")
    # 업로드 clean_unzip.php
    upload_file(ftp, r"C:\Dev\AAMEN\clean_unzip.php", "clean_unzip.php")

    ftp.quit()
    print("All files uploaded successfully!")

if __name__ == "__main__":
    main()
