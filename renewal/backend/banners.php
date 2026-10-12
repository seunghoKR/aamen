<?php
// ============================================================================
// AAMEN Banners REST API (MariaDB 10.X & PHP 8.4)
// Upgraded: Multi-Banner Carousel (Max 5), Mixed Image & Text, Master Toggle
// ============================================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// site_settings 테이블 준비 (마스터 스위치 등 저장)
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS site_settings (
        setting_key VARCHAR(64) PRIMARY KEY,
        setting_value TEXT,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (\Exception $e) {}

// 기본 5개 배너 프리셋 (이미지 - 텍스트 - 이미지 - 텍스트 - 이미지)
$default_preset_banners = [
    [
        'id' => 'banner_01',
        'banner_type' => 'image',
        'title' => '아시아 13개국을 잇는 평화와 교육의 공동체',
        'subtitle' => '언어와 국경을 넘어 그리스도의 비폭력 평화와 제자도를 함께 배웁니다',
        'image_url' => 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1600&q=80',
        'link_url' => '/community/prayer',
        'badge_text' => 'AAMEN GLOBAL NETWORK',
        'bg_gradient' => 'from-emerald-700 via-teal-800 to-sky-900',
        'display_order' => 1,
        'is_active' => 1
    ],
    [
        'id' => 'banner_02',
        'banner_type' => 'text',
        'title' => '2026 MWC 아시아 아나밥티스트 연합 컨퍼런스',
        'subtitle' => '“화해의 복음, 하나 된 아시아” — 각국 코디네이터 및 청년 리더십 참가 신청 접수 중',
        'image_url' => '',
        'link_url' => '/community/announcements',
        'badge_text' => 'UPCOMING EVENT 2026',
        'bg_gradient' => 'from-blue-900 via-indigo-900 to-slate-900',
        'display_order' => 2,
        'is_active' => 1
    ],
    [
        'id' => 'banner_03',
        'banner_type' => 'image',
        'title' => '13개 언어로 완역된 7대 신념 교안 자료실',
        'subtitle' => '하나님, 예수 그리스도, 성령, 평화와 화해 등 교회 주일학교와 신학교를 위한 무료 교육 자료',
        'image_url' => 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80',
        'link_url' => '/resources',
        'badge_text' => 'CURRICULUM & RESOURCES',
        'bg_gradient' => 'from-teal-800 via-emerald-800 to-cyan-900',
        'display_order' => 3,
        'is_active' => 1
    ],
    [
        'id' => 'banner_04',
        'banner_type' => 'text',
        'title' => '“평화를 만드는 사람은 복이 있나니”',
        'subtitle' => '마태복음 5:9 — 갈등과 분쟁 속에서 평화의 도구로 부르심 받은 아시아 성도들의 고백',
        'image_url' => '',
        'link_url' => '/community/board',
        'badge_text' => 'SCRIPTURE OF PEACE',
        'bg_gradient' => 'from-emerald-800 via-teal-900 to-green-950',
        'display_order' => 4,
        'is_active' => 1
    ],
    [
        'id' => 'banner_05',
        'banner_type' => 'image',
        'title' => '함께 손잡고 드리는 기도의 벽 (Live Prayer Wall)',
        'subtitle' => '미얀마, 베트남, 인도, 네팔... 13개국에서 실시간으로 올라오는 기도의 제목에 \'아멘\'으로 응답하세요',
        'image_url' => 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=1600&q=80',
        'link_url' => '/community/prayer',
        'badge_text' => 'FELLOWSHIP & PRAYER',
        'bg_gradient' => 'from-purple-900 via-indigo-900 to-sky-900',
        'display_order' => 5,
        'is_active' => 1
    ]
];

// DB 테이블이 비어있는 경우 자동 시딩
function ensure_seeded_banners($pdo, $default_preset_banners) {
    try {
        $count = $pdo->query("SELECT COUNT(*) FROM banners")->fetchColumn();
        if ($count == 0) {
            $stmt = $pdo->prepare("INSERT INTO banners (id, banner_type, title, subtitle, image_url, link_url, badge_text, bg_gradient, display_order, is_active, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
            foreach ($default_preset_banners as $b) {
                $stmt->execute([
                    $b['id'],
                    $b['banner_type'],
                    $b['title'],
                    $b['subtitle'],
                    $b['image_url'],
                    $b['link_url'],
                    $b['badge_text'],
                    $b['bg_gradient'],
                    $b['display_order'],
                    $b['is_active']
                ]);
            }
        }
    } catch (\Exception $e) {}
}

ensure_seeded_banners($pdo, $default_preset_banners);

if ($method === 'GET') {
    $include_all = isset($_GET['all']) || isset($_GET['admin']);
    $sql = $include_all
        ? "SELECT * FROM banners ORDER BY display_order ASC, created_at ASC LIMIT 10"
        : "SELECT * FROM banners WHERE is_active = 1 ORDER BY display_order ASC, created_at ASC LIMIT 5";
    
    $stmt = $pdo->query($sql);
    $banners = $stmt->fetchAll();

    foreach ($banners as &$b) {
        $b['is_active'] = (bool)$b['is_active'];
        $b['display_order'] = (int)$b['display_order'];
    }

    // 마스터 활성화 상태 확인
    $master_enabled = true;
    try {
        $setStmt = $pdo->query("SELECT setting_value FROM site_settings WHERE setting_key = 'hero_banner_enabled'");
        $val = $setStmt->fetchColumn();
        if ($val !== false) {
            $master_enabled = ($val === '1' || $val === 'true');
        }
    } catch (\Exception $e) {}

    send_json([
        'success' => true,
        'master_enabled' => $master_enabled,
        'data' => $banners
    ]);

} elseif ($method === 'POST') {
    // 1. 파일 직접 업로드 처리 (multipart/form-data)
    if (isset($_FILES['image']) && is_uploaded_file($_FILES['image']['tmp_name'])) {
        $file = $_FILES['image'];
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        
        if (!in_array($ext, $allowed)) {
            send_json(['success' => false, 'error' => '허용되지 않는 파일 형식입니다. (jpg, png, webp, svg 가능)'], 400);
        }

        $uploadDir = dirname(__DIR__) . '/uploads/banners';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0755, true);
        }

        $fileName = 'banner_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
        $destPath = $uploadDir . '/' . $fileName;

        if (move_uploaded_file($file['tmp_name'], $destPath)) {
            $imageUrl = '/uploads/banners/' . $fileName;
            send_json(['success' => true, 'image_url' => $imageUrl, 'message' => '이미지 업로드 성공']);
        } else {
            send_json(['success' => false, 'error' => '파일 저장에 실패했습니다.'], 500);
        }
    }

    // 2. JSON 데이터 처리
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true);

    if (!$input) {
        send_json(['success' => false, 'error' => '입력 데이터가 올바르지 않습니다.'], 400);
    }

    $action = $input['action'] ?? 'save_single';

    // 2-1. 전체 배너 일괄 저장 (Admin Save All)
    if ($action === 'save_all' && isset($input['banners']) && is_array($input['banners'])) {
        $bannersList = array_slice($input['banners'], 0, 5); // 최대 5개 강제
        $master_enabled = isset($input['master_enabled']) ? ($input['master_enabled'] ? '1' : '0') : '1';

        $pdo->beginTransaction();
        try {
            // 마스터 스위치 저장
            $stmtSet = $pdo->prepare("REPLACE INTO site_settings (setting_key, setting_value) VALUES ('hero_banner_enabled', ?)");
            $stmtSet->execute([$master_enabled]);

            // 기존 배너 목록 정리 후 새로 저장
            $pdo->exec("DELETE FROM banners");
            $stmt = $pdo->prepare("INSERT INTO banners (id, banner_type, title, subtitle, image_url, link_url, badge_text, bg_gradient, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");

            $order = 1;
            foreach ($bannersList as $b) {
                $id = !empty($b['id']) ? $b['id'] : 'b_' . time() . '_' . $order;
                $type = in_array($b['banner_type'] ?? '', ['image', 'text', 'gradient_text']) ? ($b['banner_type'] === 'gradient_text' ? 'text' : $b['banner_type']) : 'image';
                $title = trim($b['title'] ?? '새 배너');
                $subtitle = $b['subtitle'] ?? '';
                $image_url = $b['image_url'] ?? '';
                $link_url = $b['link_url'] ?? '';
                $badge_text = $b['badge_text'] ?? '';
                $bg_gradient = $b['bg_gradient'] ?? 'from-emerald-700 via-teal-800 to-sky-900';
                $is_active = isset($b['is_active']) ? ((int)$b['is_active']) : 1;

                $stmt->execute([$id, $type, $title, $subtitle, $image_url, $link_url, $badge_text, $bg_gradient, $order, $is_active]);
                $order++;
            }

            $pdo->commit();
            send_json(['success' => true, 'message' => '배너 설정 및 마스터 상태가 성공적으로 저장되었습니다.']);
        } catch (\Exception $e) {
            $pdo->rollBack();
            send_json(['success' => false, 'error' => '저장 중 오류: ' . $e->getMessage()], 500);
        }
    }

    // 2-2. 배너 삭제
    if ($action === 'delete') {
        $id = $input['id'] ?? null;
        if (!$id) send_json(['success' => false, 'error' => 'ID가 필요합니다.'], 400);

        $stmt = $pdo->prepare("DELETE FROM banners WHERE id = ?");
        $stmt->execute([$id]);
        send_json(['success' => true, 'message' => '배너가 삭제되었습니다.']);
    }

    // 2-3. 단일 배너 저장 / 생성
    $id = !empty($input['id']) ? $input['id'] : ('b_' . time() . '_' . substr(bin2hex(random_bytes(3)), 0, 4));
    $type = in_array($input['banner_type'] ?? '', ['image', 'text', 'gradient_text']) ? ($input['banner_type'] === 'gradient_text' ? 'text' : $input['banner_type']) : 'image';
    $title = trim($input['title'] ?? '');
    if (empty($title)) send_json(['success' => false, 'error' => '제목을 입력해 주세요.'], 400);

    $subtitle = $input['subtitle'] ?? '';
    $image_url = $input['image_url'] ?? '';
    $link_url = $input['link_url'] ?? '';
    $badge_text = $input['badge_text'] ?? '';
    $bg_gradient = $input['bg_gradient'] ?? 'from-emerald-700 via-teal-800 to-sky-900';
    $display_order = (int)($input['display_order'] ?? 1);
    $is_active = isset($input['is_active']) ? ((int)$input['is_active']) : 1;

    $stmt = $pdo->prepare("REPLACE INTO banners (id, banner_type, title, subtitle, image_url, link_url, badge_text, bg_gradient, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
    $stmt->execute([$id, $type, $title, $subtitle, $image_url, $link_url, $badge_text, $bg_gradient, $display_order, $is_active]);

    send_json(['success' => true, 'id' => $id, 'message' => '배너가 저장되었습니다.']);
}
