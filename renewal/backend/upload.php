<?php
/**
 * AAMEN Unified File & Image Upload API
 * 단일/다중 이미지 및 자료실 첨부 파일 업로드 처리기
 */

require_once __DIR__ . '/db.php';

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    send_json(['success' => false, 'error' => 'Method not allowed'], 405);
}

// 업로드 루트 디렉토리 (/public_html/uploads)
$rootDir = dirname(__DIR__);
$targetType = $_POST['type'] ?? $_GET['type'] ?? 'posts'; // posts, resources, banners, notices

// 타입별 서브폴더 및 허용 확장자
$subDir = 'posts';
$allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

if ($targetType === 'resources') {
    $subDir = 'resources';
    $allowedExtensions = ['pdf', 'hwp', 'hwpx', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'zip', 'txt', 'jpg', 'jpeg', 'png', 'webp'];
} elseif ($targetType === 'banners') {
    $subDir = 'banners';
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
} elseif ($targetType === 'notices') {
    $subDir = 'notices';
    $allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'zip'];
}

$uploadDir = $rootDir . '/uploads/' . $subDir;

if (!is_dir($uploadDir)) {
    if (!@mkdir($uploadDir, 0777, true)) {
        // 혹시 권한 문제로 실패한 경우
        $uploadDir = __DIR__ . '/uploads/' . $subDir;
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }
    }
}

// 헬퍼: 파일 크기 포맷
function format_bytes($bytes, $precision = 1) {
    $units = ['B', 'KB', 'MB', 'GB'];
    $bytes = max($bytes, 0);
    $pow = floor(($bytes ? log($bytes) : 0) / log(1024));
    $pow = min($pow, count($units) - 1);
    $bytes /= pow(1024, $pow);
    return round($bytes, $precision) . ' ' . $units[$pow];
}

$results = [];
$urls = [];

// 1. 다중 파일 'images[]' 또는 'files[]' 최우선 처리
$multiFiles = $_FILES['images'] ?? $_FILES['files'] ?? null;
if ($multiFiles && is_array($multiFiles['name']) && count($multiFiles['name']) > 0) {
    $count = count($multiFiles['name']);

    for ($i = 0; $i < $count; $i++) {
        $tmpName = $multiFiles['tmp_name'][$i];
        if (!is_uploaded_file($tmpName)) {
            continue;
        }

        $origName = $multiFiles['name'][$i];
        $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

        if (!in_array($ext, $allowedExtensions)) {
            continue;
        }

        $fileName = $subDir . '_' . date('Ymd_His') . '_' . $i . '_' . bin2hex(random_bytes(2)) . '.' . $ext;
        $destPath = $uploadDir . '/' . $fileName;

        if (move_uploaded_file($tmpName, $destPath)) {
            @chmod($destPath, 0644);
            $fileUrl = '/uploads/' . $subDir . '/' . $fileName;
            $urls[] = $fileUrl;
            $results[] = [
                'name' => $origName,
                'url' => $fileUrl,
                'size' => format_bytes($multiFiles['size'][$i]),
                'type' => strtoupper($ext),
            ];
        }
    }

    if (!empty($urls)) {
        send_json([
            'success' => true,
            'image_url' => $urls[0], // 첫 번째를 대표 썸네일로
            'image_urls' => $urls,
            'uploaded' => $results,
            'count' => count($urls),
            'message' => count($urls) . '개 파일 업로드 완료',
        ]);
    } else {
        send_json(['success' => false, 'error' => '업로드된 유효한 파일이 없습니다.'], 400);
    }
}

// 2. 단일 'image' 또는 'file' 처리
$singleFile = $_FILES['image'] ?? $_FILES['file'] ?? null;
if ($singleFile && is_uploaded_file($singleFile['tmp_name'])) {
    $origName = $singleFile['name'];
    $ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));

    if (!in_array($ext, $allowedExtensions)) {
        send_json(['success' => false, 'error' => '지원하지 않는 파일 형식입니다. (.' . $ext . ')'], 400);
    }

    $fileName = $subDir . '_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
    $destPath = $uploadDir . '/' . $fileName;

    if (move_uploaded_file($singleFile['tmp_name'], $destPath)) {
        @chmod($destPath, 0644);
        $fileUrl = '/uploads/' . $subDir . '/' . $fileName;
        $fileSizeStr = format_bytes($singleFile['size']);

        send_json([
            'success' => true,
            'image_url' => $fileUrl,
            'image_urls' => [$fileUrl],
            'file_url' => $fileUrl,
            'name' => $origName,
            'file_name' => $origName,
            'file_size' => $fileSizeStr,
            'file_type' => strtoupper($ext),
            'count' => 1,
            'message' => '업로드 성공',
        ]);
    } else {
        send_json(['success' => false, 'error' => '파일 저장에 실패했습니다. 권한을 확인해주세요.'], 500);
    }
}

send_json(['success' => false, 'error' => '업로드할 파일이 전달되지 않았습니다.'], 400);
