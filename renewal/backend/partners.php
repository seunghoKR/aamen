<?php
// ============================================================================
// AAMEN Global Partner Organizations API
// Version: v1.5.0
// ============================================================================

require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// partners 테이블 자동 생성
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS partners (
        id VARCHAR(64) PRIMARY KEY,
        name_ko VARCHAR(200) NOT NULL,
        name_en VARCHAR(200) NOT NULL,
        category VARCHAR(100) DEFAULT '국제기구',
        website_url VARCHAR(500) DEFAULT 'https://aamen.net',
        headquarters VARCHAR(200) DEFAULT 'Asia',
        established VARCHAR(50) DEFAULT '2026',
        contact_email VARCHAR(200) DEFAULT NULL,
        phone VARCHAR(50) DEFAULT NULL,
        desc_ko TEXT,
        desc_en TEXT,
        display_order INT DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_partners_order (display_order ASC, created_at ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (\Exception $e) {}

// 초기 6개 협력단체 기본 데이터
function get_default_partners() {
    return [
        [
            'id' => 'pt_1',
            'name_ko' => '메노나이트 세계 협의회 (MWC)',
            'name_en' => 'Mennonite World Conference',
            'category' => '국제기구',
            'website_url' => 'https://mwc-cmm.org',
            'headquarters' => 'Bogotá, Colombia & Kitchener, Canada',
            'established' => '1925',
            'contact_email' => 'info@mwc-cmm.org',
            'phone' => '',
            'desc_ko' => '전 세계 80여 개국 150만 신자들의 글로벌 아나밥티스트 메노나이트 신앙 공동체입니다. AAMEN의 7대 신념의 신학적 뿌리입니다.',
            'desc_en' => 'A global community of Anabaptist-related churches worldwide representing 1.5 million baptized believers in 80 nations.',
            'display_order' => 1
        ],
        [
            'id' => 'pt_2',
            'name_ko' => '메노나이트 중앙위원회 (MCC)',
            'name_en' => 'Mennonite Central Committee',
            'category' => '선교구호',
            'website_url' => 'https://mcc.org',
            'headquarters' => 'Akron, PA, USA & Winnipeg, Canada',
            'established' => '1920',
            'contact_email' => 'mailbox@mcc.org',
            'phone' => '',
            'desc_ko' => '아시아를 비롯한 전 세계 분쟁 지역과 빈곤 지역에서 구호, 개발, 평화 사역을 감당하는 글로벌 기독교 비정부기구입니다.',
            'desc_en' => 'A worldwide ministry of Anabaptist churches sharing God’s love through relief, development, and peace in more than 45 countries.',
            'display_order' => 2
        ],
        [
            'id' => 'pt_3',
            'name_ko' => '아시아 아나밥티스트 네트워크 (AAN)',
            'name_en' => 'Asia Anabaptist Network',
            'category' => '선교구호',
            'website_url' => 'https://aamen.net/network',
            'headquarters' => 'Bangkok, Thailand',
            'established' => '2016',
            'contact_email' => 'network@aamen.net',
            'phone' => '',
            'desc_ko' => '아시아 각국의 평화 연구소, 신학교, 지역 공동체가 모여 신학 자료와 사역 경험을 상호 교류하는 연합 플랫폼입니다.',
            'desc_en' => 'A regional platform connecting Anabaptist theological institutes, peace centers, and local fellowships across Asia.',
            'display_order' => 3
        ],
        [
            'id' => 'pt_4',
            'name_ko' => '한국 메노나이트 교회 연합 (KMA)',
            'name_en' => 'Korean Mennonite Association',
            'category' => '교단연합',
            'website_url' => 'https://kma.or.kr',
            'headquarters' => 'Seoul, Korea',
            'established' => '2001',
            'contact_email' => 'kma@kma.or.kr',
            'phone' => '',
            'desc_ko' => '한반도 평화와 화해의 복음을 실천하며 아시아 사역자 교육과 교재 번역을 주도하는 한국 교회 연합체입니다.',
            'desc_en' => 'Fellowship of Korean Mennonite congregations committed to active peacemaking, reconciliation, and Asian network support.',
            'display_order' => 4
        ],
        [
            'id' => 'pt_5',
            'name_ko' => '동남아시아 평화 교육 센터 (SEAPEC)',
            'name_en' => 'Southeast Asia Peace Education Center',
            'category' => '선교구호',
            'website_url' => 'https://seapec.org',
            'headquarters' => 'Chiang Mai, Thailand',
            'established' => '2019',
            'contact_email' => 'office@seapec.org',
            'phone' => '',
            'desc_ko' => '미얀마, 태국, 라오스, 캄보디아 다문화 청소년들을 위한 갈등 해결 및 평화 커리큘럼을 연구·보급합니다.',
            'desc_en' => 'Dedicated to empowering Southeast Asian youth leaders with contextualized peace education and restorative practices.',
            'display_order' => 5
        ],
        [
            'id' => 'pt_6',
            'name_ko' => '아시아 기독교 평화 연대 (ACPA)',
            'name_en' => 'Asian Christian Peace Alliance',
            'category' => '선교구호',
            'website_url' => 'https://aamen.net',
            'headquarters' => 'Manila, Philippines',
            'established' => '2022',
            'contact_email' => 'peace@acpa-asia.org',
            'phone' => '',
            'desc_ko' => '필리핀 및 동남아시아 분쟁 지역의 화해 사역과 비폭력 평화 교육 훈련을 지원하는 초교파 선교 연대체입니다.',
            'desc_en' => 'An ecumenical alliance supporting reconciliation ministries and nonviolent peace training across Southeast Asia.',
            'display_order' => 6
        ]
    ];
}

// 초기 데이터 확인 및 테이블 최초 생성 시에만 1회 채우기
$checkInit = $pdo->query("SELECT COUNT(*) FROM partners")->fetchColumn();
// 테이블이 완전히 비어있고 테이블이 방금 생성된 상태인지 확인 (초기화 플래그 파일 검사)
$initFlagFile = __DIR__ . '/.partners_initialized';
if ($checkInit == 0 && !file_exists($initFlagFile)) {
    $insertStmt = $pdo->prepare("INSERT INTO partners (id, name_ko, name_en, category, website_url, headquarters, established, contact_email, phone, desc_ko, desc_en, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach (get_default_partners() as $p) {
        $insertStmt->execute([
            $p['id'], $p['name_ko'], $p['name_en'], $p['category'],
            $p['website_url'], $p['headquarters'], $p['established'],
            $p['contact_email'], $p['phone'], $p['desc_ko'], $p['desc_en'],
            $p['display_order']
        ]);
    }
    @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
}

if ($method === 'GET') {
    $search = $_GET['search'] ?? null;
    $sql = "SELECT * FROM partners WHERE 1=1";
    $params = [];

    if ($search) {
        $sql .= " AND (name_ko LIKE ? OR name_en LIKE ? OR category LIKE ? OR headquarters LIKE ?)";
        $term = "%{$search}%";
        $params = [$term, $term, $term, $term];
    }

    $sql .= " ORDER BY display_order ASC, created_at ASC";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    // 프론트엔드 호환 포맷 (camelCase & snake_case 모두 지원)
    $result = [];
    foreach ($rows as $r) {
        $result[] = [
            'id' => $r['id'],
            'nameKo' => $r['name_ko'],
            'nameEn' => $r['name_en'],
            'name_ko' => $r['name_ko'],
            'name_en' => $r['name_en'],
            'category' => $r['category'],
            'websiteUrl' => $r['website_url'],
            'website_url' => $r['website_url'],
            'headquarters' => $r['headquarters'],
            'established' => $r['established'],
            'contactEmail' => $r['contact_email'] ?? '',
            'contact_email' => $r['contact_email'] ?? '',
            'phone' => $r['phone'] ?? '',
            'descKo' => $r['desc_ko'] ?? '',
            'descEn' => $r['desc_en'] ?? '',
            'desc_ko' => $r['desc_ko'] ?? '',
            'desc_en' => $r['desc_en'] ?? '',
            'display_order' => (int)$r['display_order']
        ];
    }

    send_json(['success' => true, 'data' => $result]);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? null;

    // 1. 삭제 액션
    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare("DELETE FROM partners WHERE id = ?");
        $stmt->execute([$id]);
        @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
        send_json(['success' => true, 'message' => 'Partner deleted successfully']);
    }

    // 2. 전체 초기화 (기본값 복원) 액션
    if ($action === 'reset') {
        $pdo->exec("DELETE FROM partners");
        $insertStmt = $pdo->prepare("INSERT INTO partners (id, name_ko, name_en, category, website_url, headquarters, established, contact_email, phone, desc_ko, desc_en, display_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
        foreach (get_default_partners() as $p) {
            $insertStmt->execute([
                $p['id'], $p['name_ko'], $p['name_en'], $p['category'],
                $p['website_url'], $p['headquarters'], $p['established'],
                $p['contact_email'], $p['phone'], $p['desc_ko'], $p['desc_en'],
                $p['display_order']
            ]);
        }
        @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
        send_json(['success' => true, 'message' => 'Restored default partner organizations']);
    }

    // 3. 신규 등록 및 수정
    $nameKo = trim($input['nameKo'] ?? $input['name_ko'] ?? '');
    $nameEn = trim($input['nameEn'] ?? $input['name_en'] ?? '');

    if (empty($nameKo) && empty($nameEn)) {
        send_json(['success' => false, 'error' => 'Organization name required'], 400);
    }

    $pid = $id ?: ('pt_' . time() . '_' . substr(bin2hex(random_bytes(3)), 0, 4));
    $category = $input['category'] ?? '국제기구';
    $websiteUrl = $input['websiteUrl'] ?? $input['website_url'] ?? 'https://aamen.net';
    $headquarters = $input['headquarters'] ?? 'Asia';
    $established = $input['established'] ?? '2026';
    $contactEmail = $input['contactEmail'] ?? $input['contact_email'] ?? '';
    $phone = $input['phone'] ?? '';
    $descKo = $input['descKo'] ?? $input['desc_ko'] ?? '';
    $descEn = $input['descEn'] ?? $input['desc_en'] ?? '';
    $displayOrder = isset($input['display_order']) ? (int)$input['display_order'] : 1;

    $stmt = $pdo->prepare("REPLACE INTO partners (id, name_ko, name_en, category, website_url, headquarters, established, contact_email, phone, desc_ko, desc_en, display_order, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([
        $pid, $nameKo, $nameEn, $category, $websiteUrl, $headquarters,
        $established, $contactEmail, $phone, $descKo, $descEn, $displayOrder
    ]);

    @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
    send_json(['success' => true, 'data' => ['id' => $pid], 'message' => 'Partner saved successfully']);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        send_json(['success' => false, 'error' => 'Partner ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM partners WHERE id = ?");
    $stmt->execute([$id]);
    @file_put_contents($initFlagFile, date('Y-m-d H:i:s'));
    send_json(['success' => true, 'message' => 'Partner deleted successfully']);
}
