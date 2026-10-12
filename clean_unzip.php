<?php
// ============================================================================
// AAMEN Server Cleaner and Unzip Utility
// ============================================================================

header('Content-Type: application/json; charset=utf-8');

$dir = __DIR__;

// 1. 기존 public_html 내부의 잘못 풀린 파일 정리 (자신과 zip 파일 제외)
$it = new RecursiveDirectoryIterator($dir, RecursiveDirectoryIterator::SKIP_DOTS);
$files = new RecursiveIteratorIterator($it, RecursiveIteratorIterator::CHILD_FIRST);

foreach ($files as $file) {
    $path = $file->getRealPath();
    $name = $file->getFilename();
    if ($name === 'deploy.zip' || $name === 'clean_unzip.php') {
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
    echo json_encode(['status' => 'success', 'message' => 'Cleaned and extracted successfully']);
} else {
    echo json_encode(['status' => 'error', 'code' => $res, 'message' => 'Failed to open zip']);
}
