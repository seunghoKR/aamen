<?php
// ============================================================================
// AAMEN Country Coordinators API
// Version: v1.5.8
// ============================================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// coordinators 테이블 자동 생성
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS coordinators (
        id VARCHAR(64) PRIMARY KEY,
        country_code VARCHAR(10) NOT NULL,
        country_name VARCHAR(100) NOT NULL,
        flag VARCHAR(20) DEFAULT '',
        name VARCHAR(200) NOT NULL,
        name_native VARCHAR(200) DEFAULT '',
        name_en VARCHAR(200) DEFAULT '',
        role VARCHAR(200) NOT NULL,
        email VARCHAR(200) DEFAULT '',
        phone VARCHAR(50) DEFAULT '',
        member_id VARCHAR(64) DEFAULT NULL,
        is_registered_member TINYINT(1) DEFAULT 0,
        display_order INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_coord_country (country_code),
        INDEX idx_coord_order (display_order ASC, created_at ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (\Exception $e) {}

// 초기 15개국 대표 코디네이터 기본 데이터
function get_default_coordinators() {
    return [
        [
            'id' => 'coord_hk',
            'country_code' => 'HK',
            'country_name' => '홍콩 (HK)',
            'flag' => '🇭🇰',
            'name' => 'Jeremiah',
            'name_native' => 'Jeremiah',
            'name_en' => 'Jeremiah',
            'role' => '홍콩 코디네이터 (Hong Kong Coord.)',
            'email' => 'hkjerechoi@gmail.com',
            'phone' => '+852 9123-4567',
            'member_id' => 'Jeremiah',
            'is_registered_member' => 1,
            'display_order' => 1
        ],
        [
            'id' => 'coord_id',
            'country_code' => 'ID',
            'country_name' => '인도네시아 (ID)',
            'flag' => '🇮🇩',
            'name' => 'Paulus S. Widjaja',
            'name_native' => 'Paulus S. Widjaja',
            'name_en' => 'Paulus S. Widjaja',
            'role' => '인도네시아 코디네이터 (Indonesia Coord.)',
            'email' => 'psw.dosen@gmail.com',
            'phone' => '+62 812-3456-7890',
            'member_id' => 'Paulus',
            'is_registered_member' => 1,
            'display_order' => 2
        ],
        [
            'id' => 'coord_in',
            'country_code' => 'IN',
            'country_name' => '인도 (IN)',
            'flag' => '🇮🇳',
            'name' => 'Priya Sharma',
            'name_native' => 'प्रिया शर्मा',
            'name_en' => 'Priya Sharma',
            'role' => '인도 코디네이터 (India Coord.)',
            'email' => 'priya.sharma@india.org',
            'phone' => '+91 98765-43210',
            'member_id' => 'priya',
            'is_registered_member' => 1,
            'display_order' => 3
        ],
        [
            'id' => 'coord_jp',
            'country_code' => 'JP',
            'country_name' => '일본 (JP)',
            'flag' => '🇯🇵',
            'name' => 'Hiro Katano',
            'name_native' => '片野 ヒロ',
            'name_en' => 'Hiro Katano',
            'role' => '일본 코디네이터 (Japan Coord.)',
            'email' => 'h98484435@gmail.com',
            'phone' => '+81 90-1234-5678',
            'member_id' => 'Hiro',
            'is_registered_member' => 1,
            'display_order' => 4
        ],
        [
            'id' => 'coord_kh',
            'country_code' => 'KH',
            'country_name' => '캄보디아 (KH)',
            'flag' => '🇰🇭',
            'name' => 'Sokha Chea',
            'name_native' => 'សុខា ជា',
            'name_en' => 'Sokha Chea',
            'role' => '캄보디아 코디네이터 (Cambodia Coord.)',
            'email' => 'sokha.chea@cambodia.org',
            'phone' => '+855 12-345-678',
            'member_id' => 'sokha',
            'is_registered_member' => 0,
            'display_order' => 5
        ],
        [
            'id' => 'coord_kr_yongha',
            'country_code' => 'KR',
            'country_name' => '대한민국 (KR)',
            'flag' => '🇰🇷',
            'name' => 'Bae Yongha',
            'name_native' => '배용하',
            'name_en' => 'Bae Yongha',
            'role' => '한국 코디네이터 (Korea Coord. / MCSK)',
            'email' => 'byh1424@gmail.com',
            'phone' => '+82 10-1234-5678',
            'member_id' => 'Yongha',
            'is_registered_member' => 1,
            'display_order' => 6
        ],
        [
            'id' => 'coord_la',
            'country_code' => 'LA',
            'country_name' => '라오스 (LA)',
            'flag' => '🇱🇦',
            'name' => 'Kham Souk',
            'name_native' => 'ຄຳສຸກ',
            'name_en' => 'Kham Souk',
            'role' => '라오스 코디네이터 (Laos Coord.)',
            'email' => 'kham.souk@laos.net',
            'phone' => '+856 20-1234-5678',
            'member_id' => 'kham',
            'is_registered_member' => 0,
            'display_order' => 7
        ],
        [
            'id' => 'coord_mm',
            'country_code' => 'MM',
            'country_name' => '미얀마 (MM)',
            'flag' => '🇲🇲',
            'name' => 'Zaw Min',
            'name_native' => 'ဇော်မင်း',
            'name_en' => 'Zaw Min',
            'role' => '미얀마 코디네이터 (Myanmar Coord.)',
            'email' => 'zawmin@aamen.net',
            'phone' => '+95 9-1234-5678',
            'member_id' => 'zawmin',
            'is_registered_member' => 1,
            'display_order' => 8
        ],
        [
            'id' => 'coord_mn',
            'country_code' => 'MN',
            'country_name' => '몽골 (MN)',
            'flag' => '🇲🇳',
            'name' => 'Bat-Erdene',
            'name_native' => 'Бат-Эрдэнэ',
            'name_en' => 'Bat-Erdene',
            'role' => '몽골 코디네이터 (Mongolia Coord.)',
            'email' => 'baterdene@mongolia.net',
            'phone' => '+976 99-12-3456',
            'member_id' => 'baterdene',
            'is_registered_member' => 0,
            'display_order' => 9
        ],
        [
            'id' => 'coord_np',
            'country_code' => 'NP',
            'country_name' => '네팔 (NP)',
            'flag' => '🇳🇵',
            'name' => 'Ramesh Adhikari',
            'name_native' => 'रमेश अधिकारी',
            'name_en' => 'Ramesh Adhikari',
            'role' => '네팔 코디네이터 (Nepal Coord.)',
            'email' => 'ramesh.ad@nepal.org',
            'phone' => '+977 98-1234-5678',
            'member_id' => 'ramesh',
            'is_registered_member' => 1,
            'display_order' => 10
        ],
        [
            'id' => 'coord_ph',
            'country_code' => 'PH',
            'country_name' => '필리핀 (PH)',
            'flag' => '🇵🇭',
            'name' => 'Juan Dela Cruz',
            'name_native' => 'Juan Dela Cruz',
            'name_en' => 'Juan Dela Cruz',
            'role' => '필리핀 코디네이터 (Philippines Coord.)',
            'email' => 'juan.delacruz@aamen.ph',
            'phone' => '+63 912-345-6789',
            'member_id' => 'juan',
            'is_registered_member' => 0,
            'display_order' => 11
        ],
        [
            'id' => 'coord_th',
            'country_code' => 'TH',
            'country_name' => '태국 (TH)',
            'flag' => '🇹🇭',
            'name' => 'Somchai Prasert',
            'name_native' => 'สมชาย ประเสริฐ',
            'name_en' => 'Somchai Prasert',
            'role' => '태국 코디네이터 (Thailand Coord.)',
            'email' => 'somchai@aamen.net',
            'phone' => '+66 81-234-5678',
            'member_id' => 'somchai',
            'is_registered_member' => 1,
            'display_order' => 12
        ],
        [
            'id' => 'coord_tw',
            'country_code' => 'TW',
            'country_name' => '대만 (TW)',
            'flag' => '🇹🇼',
            'name' => 'Lin Mei-Ling',
            'name_native' => '林美玲',
            'name_en' => 'Lin Mei-Ling',
            'role' => '대만 코디네이터 (Taiwan Coord.)',
            'email' => 'meiling.lin@taiwan.org',
            'phone' => '+886 912-345-678',
            'member_id' => 'meiling',
            'is_registered_member' => 0,
            'display_order' => 13
        ],
        [
            'id' => 'coord_us_andi',
            'country_code' => 'US',
            'country_name' => '미국 (USA)',
            'flag' => '🇺🇸',
            'name' => 'Andi Santoso',
            'name_native' => 'Andi Santoso',
            'name_en' => 'Andi Santoso',
            'role' => '미국 코디네이터 (USA / MNN Coord.)',
            'email' => 'andiospeace@gmail.com',
            'phone' => '+1 234-567-8901',
            'member_id' => 'Andi',
            'is_registered_member' => 1,
            'display_order' => 14
        ],
        [
            'id' => 'coord_vn',
            'country_code' => 'VN',
            'country_name' => '베트남 (VN)',
            'flag' => '🇻🇳',
            'name' => 'Sarah Nguyen',
            'name_native' => 'Nguyễn Thị Sarah',
            'name_en' => 'Sarah Nguyen',
            'role' => '베트남 코디네이터 (Vietnam Coord.)',
            'email' => 'sarah.nguyen@aamen.net',
            'phone' => '+84 90-123-4567',
            'member_id' => 'sarah',
            'is_registered_member' => 1,
            'display_order' => 15
        ]
    ];
}

// 초기 데이터 1회 시딩
$initFlagFile = __DIR__ . '/.coordinators_initialized';
if (!file_exists($initFlagFile)) {
    $checkInit = $pdo->query("SELECT COUNT(*) FROM coordinators")->fetchColumn();
    if ($checkInit == 0) {
        $insertStmt = $pdo->prepare("INSERT IGNORE INTO coordinators (
            id, country_code, country_name, flag, name, name_native, name_en, role, email, phone, member_id, is_registered_member, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        foreach (get_default_coordinators() as $c) {
            $insertStmt->execute([
                $c['id'], $c['country_code'], $c['country_name'], $c['flag'],
                $c['name'], $c['name_native'], $c['name_en'], $c['role'],
                $c['email'], $c['phone'], $c['member_id'], $c['is_registered_member'],
                $c['display_order']
            ]);
        }
    }
    @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
}

// Helper: 포맷 매핑
function formatCoordinatorRow($r) {
    return [
        'id' => $r['id'],
        'countryCode' => $r['country_code'],
        'country_code' => $r['country_code'],
        'countryName' => $r['country_name'],
        'country_name' => $r['country_name'],
        'flag' => $r['flag'],
        'name' => $r['name'],
        'nameNative' => !empty($r['name_native']) ? $r['name_native'] : $r['name'],
        'name_native' => !empty($r['name_native']) ? $r['name_native'] : $r['name'],
        'nameEn' => !empty($r['name_en']) ? $r['name_en'] : $r['name'],
        'name_en' => !empty($r['name_en']) ? $r['name_en'] : $r['name'],
        'role' => $r['role'],
        'email' => $r['email'] ?? '',
        'phone' => $r['phone'] ?? '',
        'memberId' => $r['member_id'] ?? '',
        'member_id' => $r['member_id'] ?? '',
        'isRegisteredMember' => (bool)$r['is_registered_member'],
        'is_registered_member' => (bool)$r['is_registered_member'],
        'displayOrder' => (int)$r['display_order'],
        'display_order' => (int)$r['display_order'],
        'createdAt' => $r['created_at'] ?? '',
        'updatedAt' => $r['updated_at'] ?? '',
    ];
}

// --- 1. GET: 목록 조회 ---
if ($method === 'GET') {
    $country = $_GET['country'] ?? $_GET['countryCode'] ?? null;
    $sql = "SELECT * FROM coordinators WHERE 1=1";
    $params = [];

    if ($country) {
        $sql .= " AND country_code = ?";
        $params[] = strtoupper($country);
    }

    $sql .= " ORDER BY display_order ASC, country_code ASC, created_at ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    $result = [];
    foreach ($rows as $r) {
        $result[] = formatCoordinatorRow($r);
    }

    echo json_encode([
        'success' => true,
        'count' => count($result),
        'data' => $result
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// --- 2. POST: 추가, 수정, 삭제 ---
if ($method === 'POST') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true) ?: $_POST;

    $action = $input['action'] ?? 'save';

    // 삭제 액션
    if ($action === 'delete') {
        $id = $input['id'] ?? '';
        if (!$id) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Missing coordinator ID']);
            exit;
        }

        $stmt = $pdo->prepare("DELETE FROM coordinators WHERE id = ?");
        $stmt->execute([$id]);

        echo json_encode([
            'success' => true,
            'message' => "Coordinator {$id} deleted successfully"
        ]);
        exit;
    }

    // 추가 또는 수정 액션
    $id = trim($input['id'] ?? '');
    $countryCode = strtoupper(trim($input['countryCode'] ?? $input['country_code'] ?? 'KR'));
    $countryName = trim($input['countryName'] ?? $input['country_name'] ?? '');
    $flag = trim($input['flag'] ?? '');
    $name = trim($input['name'] ?? '');
    $nameNative = trim($input['nameNative'] ?? $input['name_native'] ?? '');
    $nameEn = trim($input['nameEn'] ?? $input['name_en'] ?? '');
    $role = trim($input['role'] ?? '');
    $email = trim($input['email'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $memberId = trim($input['memberId'] ?? $input['member_id'] ?? '');
    $isRegisteredMember = !empty($input['isRegisteredMember']) || !empty($input['is_registered_member']) || !empty($memberId) ? 1 : 0;
    $displayOrder = isset($input['displayOrder']) ? (int)$input['displayOrder'] : (isset($input['display_order']) ? (int)$input['display_order'] : 0);

    if (empty($name)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Name is required']);
        exit;
    }

    // 기본값 보정
    if (empty($nameNative)) {
        $nameNative = $name;
    }
    if (empty($nameEn)) {
        $nameEn = $name;
    }
    if (empty($role)) {
        $role = "{$countryCode} 코디네이터 ({$countryCode} Coord.)";
    }

    // 국기 이모지 매핑
    $flagMap = [
        'KR' => '🇰🇷', 'US' => '🇺🇸', 'ID' => '🇮🇩', 'HK' => '🇭🇰', 'JP' => '🇯🇵',
        'MM' => '🇲🇲', 'VN' => '🇻🇳', 'TH' => '🇹🇭', 'NP' => '🇳🇵', 'IN' => '🇮🇳',
        'KH' => '🇰🇭', 'LA' => '🇱🇦', 'MN' => '🇲🇳', 'TW' => '🇹🇼', 'PH' => '🇵🇭'
    ];
    if (empty($flag) && isset($flagMap[$countryCode])) {
        $flag = $flagMap[$countryCode];
    }

    // 국가명 매핑
    $countryNameMap = [
        'KR' => '대한민국 (KR)', 'US' => '미국 (USA)', 'ID' => '인도네시아 (ID)',
        'HK' => '홍콩 (HK)', 'JP' => '일본 (JP)', 'MM' => '미얀마 (MM)',
        'VN' => '베트남 (VN)', 'TH' => '태국 (TH)', 'NP' => '네팔 (NP)',
        'IN' => '인도 (IN)', 'KH' => '캄보디아 (KH)', 'LA' => '라오스 (LA)',
        'MN' => '몽골 (MN)', 'TW' => '대만 (TW)', 'PH' => '필리핀 (PH)'
    ];
    if (empty($countryName) && isset($countryNameMap[$countryCode])) {
        $countryName = $countryNameMap[$countryCode];
    }

    // ID 존재 여부 확인
    $existing = null;
    if (!empty($id)) {
        $chk = $pdo->prepare("SELECT * FROM coordinators WHERE id = ?");
        $chk->execute([$id]);
        $existing = $chk->fetch();
    }

    if ($existing) {
        // 기존 레코드 업데이트
        $updateStmt = $pdo->prepare("UPDATE coordinators SET
            country_code = ?,
            country_name = ?,
            flag = ?,
            name = ?,
            name_native = ?,
            name_en = ?,
            role = ?,
            email = ?,
            phone = ?,
            member_id = ?,
            is_registered_member = ?,
            display_order = ?
            WHERE id = ?");

        $updateStmt->execute([
            $countryCode, $countryName, $flag, $name, $nameNative, $nameEn,
            $role, $email, $phone, $memberId ?: null, $isRegisteredMember,
            $displayOrder, $id
        ]);
    } else {
        // 신규 레코드 생성
        if (empty($id)) {
            $id = 'coord_' . strtolower($countryCode) . '_' . substr(md5(uniqid(mt_rand(), true)), 0, 6);
        }

        $insertStmt = $pdo->prepare("INSERT INTO coordinators (
            id, country_code, country_name, flag, name, name_native, name_en,
            role, email, phone, member_id, is_registered_member, display_order
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

        $insertStmt->execute([
            $id, $countryCode, $countryName, $flag, $name, $nameNative, $nameEn,
            $role, $email, $phone, $memberId ?: null, $isRegisteredMember,
            $displayOrder
        ]);
    }

    // 저장된 최신 데이터 반환
    $savedStmt = $pdo->prepare("SELECT * FROM coordinators WHERE id = ?");
    $savedStmt->execute([$id]);
    $savedRow = $savedStmt->fetch();

    echo json_encode([
        'success' => true,
        'message' => 'Coordinator saved successfully',
        'data' => formatCoordinatorRow($savedRow)
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

// --- 3. DELETE (HTTP DELETE) ---
if ($method === 'DELETE') {
    $rawInput = file_get_contents('php://input');
    $input = json_decode($rawInput, true) ?: [];
    $id = $_GET['id'] ?? $input['id'] ?? '';

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'Missing coordinator ID']);
        exit;
    }

    $stmt = $pdo->prepare("DELETE FROM coordinators WHERE id = ?");
    $stmt->execute([$id]);

    echo json_encode([
        'success' => true,
        'message' => "Coordinator {$id} deleted successfully"
    ]);
    exit;
}
