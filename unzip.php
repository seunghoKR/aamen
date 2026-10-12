<?php
// ============================================================================
// AAMEN Deployment Unzip Utility
// ============================================================================

header('Content-Type: application/json; charset=utf-8');

$zipFile = __DIR__ . '/deploy.zip';

if (!file_exists($zipFile)) {
    echo json_encode(['status' => 'error', 'message' => 'deploy.zip file not found']);
    exit;
}

$zip = new ZipArchive;
$res = $zip->open($zipFile);

if ($res === TRUE) {
    $zip->extractTo(__DIR__);
    $zip->close();
    unlink($zipFile);
    @unlink(__FILE__);
    echo json_encode(['status' => 'success', 'message' => 'Deployment unzipped successfully']);
} else {
    echo json_encode(['status' => 'error', 'code' => $res, 'message' => 'Failed to open zip']);
}
