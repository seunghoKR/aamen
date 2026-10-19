<?php
// ============================================================================
// AAMEN Server Cleaner and Unzip Utility
// uploads/ 및 files/ 영구 보관 보장
// ============================================================================

header('Content-Type: application/json; charset=utf-8');

$dir = __DIR__;

// 1. 기존 파일 정리 (자신, zip, uploads 및 files 폴더 제외)
$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
$files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);

foreach ($files as $file) {
    $path = $file->getRealPath();
    $name = $file->getFilename();

    // 배포 유틸리티 및 영구 저장소 보존
    if ($name === 'deploy.zip' || $name === 'clean_unzip.php') {
        continue;
    }

    // uploads/ 및 files/ 폴더 및 하위 파일 절대 보존
    $relPath = str_replace('\\', '/', substr($path, strlen($dir)));
    if (preg_match('#^/(uploads|files)(/|$)#i', $relPath)) {
        continue;
    }

    if ($file->isDir()) {
        @rmdir($path);
    } else {
        @unlink($path);
    }
}

// 2. deploy.zip 압축 해제
$zipFile = $dir . '/deploy.zip';
if (!file_exists($zipFile)) {
    echo json_encode(['status' => 'error', 'message' => 'deploy.zip not found']);
    exit;
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);

if ($res === TRUE) {
    $zip->extractTo($dir);
    $zip->close();
    @unlink($zipFile);
    @unlink(__FILE__);

    // uploads 디렉토리 권한 및 하위 폴더 생성 보장
    foreach (['posts', 'resources', 'banners', 'notices'] as $sub) {
        $upDir = $dir . '/uploads/' . $sub;
        if (!is_dir($upDir)) {
            @mkdir($upDir, 0777, true);
        }
        @chmod($upDir, 0777);
    }

    echo json_encode(['status' => 'success', 'message' => 'Cleaned and extracted successfully with uploads preserved']);
} else {
    echo json_encode(['status' => 'error', 'code' => $res, 'message' => 'Failed to open zip']);
}
