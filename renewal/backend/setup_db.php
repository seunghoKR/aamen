<?php
// ============================================================================
// AAMEN Database Initializer & Migration for MariaDB 10.X
// Version: v1.5.0
// ============================================================================

require_once __DIR__ . '/db.php';

$queries = [
    // 1. members 테이블
    "CREATE TABLE IF NOT EXISTS members (
        id VARCHAR(64) PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        name VARCHAR(100) NOT NULL,
        avatar_url VARCHAR(500),
        provider VARCHAR(20) DEFAULT 'google',
        country_code VARCHAR(10) NOT NULL,
        role VARCHAR(30) DEFAULT 'associate',
        status VARCHAR(20) DEFAULT 'active',
        bio TEXT,
        phone VARCHAR(50) DEFAULT NULL,
        affiliation VARCHAR(100) DEFAULT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_members_email (email),
        INDEX idx_members_country (country_code),
        INDEX idx_members_role (role)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 2. posts 테이블
    "CREATE TABLE IF NOT EXISTS posts (
        id VARCHAR(64) PRIMARY KEY,
        board_type VARCHAR(30) NOT NULL,
        title VARCHAR(300) NOT NULL,
        content LONGTEXT NOT NULL,
        category VARCHAR(50) DEFAULT NULL,
        author_id VARCHAR(64),
        author_name VARCHAR(100) NOT NULL,
        author_country VARCHAR(10) NOT NULL,
        author_role VARCHAR(30) DEFAULT 'regular',
        views INT DEFAULT 0,
        likes INT DEFAULT 0,
        is_pinned TINYINT(1) DEFAULT 0,
        amen_count INT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_posts_board_type (board_type),
        INDEX idx_posts_author_country (author_country),
        INDEX idx_posts_created_at (created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 3. comments 테이블
    "CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(64) PRIMARY KEY,
        post_id VARCHAR(64) NOT NULL,
        author_id VARCHAR(64),
        author_name VARCHAR(100) NOT NULL,
        author_country VARCHAR(10) NOT NULL,
        author_role VARCHAR(30) DEFAULT 'regular',
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_comments_post_id (post_id),
        INDEX idx_comments_created_at (created_at ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 4. prayer_cards 테이블
    "CREATE TABLE IF NOT EXISTS prayer_cards (
        id VARCHAR(64) PRIMARY KEY,
        author_id VARCHAR(64),
        author_name VARCHAR(100) NOT NULL,
        country_code VARCHAR(10) NOT NULL,
        title VARCHAR(200) NOT NULL,
        content TEXT NOT NULL,
        extra_json LONGTEXT DEFAULT NULL,
        amen_count INT DEFAULT 0,
        is_urgent TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_prayers_country (country_code),
        INDEX idx_prayers_created_at (created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 5. banners 테이블
    "CREATE TABLE IF NOT EXISTS banners (
        id VARCHAR(64) PRIMARY KEY,
        banner_type VARCHAR(20) DEFAULT 'image',
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(500),
        image_url VARCHAR(500),
        link_url VARCHAR(500),
        badge_text VARCHAR(100),
        bg_gradient VARCHAR(100),
        display_order INT DEFAULT 1,
        is_active TINYINT(1) DEFAULT 1,
        start_at DATETIME NULL,
        end_at DATETIME NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_banners_active_order (is_active, display_order ASC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 6. partners 테이블
    "CREATE TABLE IF NOT EXISTS partners (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

// 컬럼 추가 마이그레이션 안전 실행
$alter_queries = [
    "ALTER TABLE members ADD COLUMN phone VARCHAR(50) DEFAULT NULL",
    "ALTER TABLE members ADD COLUMN affiliation VARCHAR(100) DEFAULT NULL",
    "ALTER TABLE posts MODIFY content LONGTEXT NOT NULL",
    "ALTER TABLE posts ADD COLUMN category VARCHAR(50) DEFAULT NULL",
    "ALTER TABLE posts ADD COLUMN image_url VARCHAR(500) DEFAULT NULL",
    "ALTER TABLE posts ADD COLUMN extra_json LONGTEXT DEFAULT NULL",
    "ALTER TABLE prayer_cards ADD COLUMN extra_json LONGTEXT DEFAULT NULL"
];

// 🌟 공식 7명 회원 + 1명 개발자 계정 데이터셋 (2026-10-15 확정본)
$members_v150 = [
    // 1) 개발자 계정
    [
        'id' => 'admin',
        'email' => 'leeshkr@gmail.com',
        'name' => '이승호',
        'name_en' => 'Seungho Lee',
        'provider' => 'google',
        'country_code' => 'KR',
        'role' => 'developer',
        'status' => 'active',
        'bio' => 'AAMEN 시스템 개발 및 운영 총괄',
        'phone' => '+82 10-4069-2739',
        'affiliation' => '누리오 (개발자)'
    ],
    // 2) Jeanette Hanson (Boss / MWC)
    [
        'id' => 'Jeanette',
        'email' => 'Jeanette.m.hanson@gmail.com',
        'name' => 'Jeanette Hanson',
        'provider' => 'google',
        'country_code' => 'US',
        'role' => 'super_admin',
        'status' => 'active',
        'bio' => 'MWC Boss / 총괄 리더십',
        'phone' => '+1 000-000-0000',
        'affiliation' => 'MWC'
    ],
    // 3) Jeremiah (Coordinator)
    [
        'id' => 'Jeremiah',
        'email' => 'hkjerechoi@gmail.com',
        'name' => 'Jeremiah',
        'provider' => 'google',
        'country_code' => 'HK',
        'role' => 'country_admin',
        'status' => 'active',
        'bio' => 'Hongkong Coordinator',
        'phone' => '+852 0000-0000',
        'affiliation' => ''
    ],
    // 4) Paulus S. Widjaja (Coordinator)
    [
        'id' => 'Paulus',
        'email' => 'psw.dosen@gmail.com',
        'name' => 'Paulus S. Widjaja',
        'provider' => 'google',
        'country_code' => 'ID',
        'role' => 'country_admin',
        'status' => 'active',
        'bio' => 'Indonesia Coordinator',
        'phone' => '+62 000-000-0000',
        'affiliation' => ''
    ],
    // 5) Andi Santoso (Coordinator / MNN)
    [
        'id' => 'Andi',
        'email' => 'andiospeace@gmail.com',
        'name' => 'Andi Santoso',
        'provider' => 'google',
        'country_code' => 'US',
        'role' => 'country_admin',
        'status' => 'active',
        'bio' => 'Coordinator / MNN',
        'phone' => '+1 000-000-0000',
        'affiliation' => 'MNN'
    ],
    // 6) Hiro Katano (Coordinator / Japan)
    [
        'id' => 'Hiro',
        'email' => 'h98484435@gmail.com',
        'name' => 'Hiro Katano',
        'provider' => 'google',
        'country_code' => 'JP',
        'role' => 'country_admin',
        'status' => 'active',
        'bio' => 'Japan Coordinator',
        'phone' => '+81 00-0000-0000',
        'affiliation' => ''
    ],
    // 7) Kim Bockki (Helper / MCSK)
    [
        'id' => 'Bockki',
        'email' => 'bockkikim@gmail.com',
        'name' => 'Kim Bockki',
        'provider' => 'google',
        'country_code' => 'KR',
        'role' => 'level3_worker',
        'status' => 'active',
        'bio' => 'Helper / MCSK 사역자',
        'phone' => '+82 10-0000-0000',
        'affiliation' => 'MCSK'
    ],
    // 8) Bae Yongha (Coordinator / MCSK)
    [
        'id' => 'Yongha',
        'email' => 'byh1424@gmail.com',
        'name' => 'Bae Yongha',
        'provider' => 'google',
        'country_code' => 'KR',
        'role' => 'country_admin',
        'status' => 'active',
        'bio' => 'Korea Coordinator / MCSK',
        'phone' => '+82 10-0000-0000',
        'affiliation' => 'MCSK'
    ]
];

$results = [];

try {
    // 1. 테이블 생성 및 검증
    foreach ($queries as $sql) {
        $pdo->exec($sql);
    }
    foreach ($alter_queries as $asql) {
        try {
            $pdo->exec($asql);
        } catch (\Exception $e) {
            // 이미 존재하는 컬럼 무시
        }
    }
    // 컬럼 마이그레이션 (안전한 누락 컬럼 추가)
    $safe_migrations = [
        "ALTER TABLE members ADD COLUMN name_en VARCHAR(100) NULL AFTER name",
        "ALTER TABLE members ADD COLUMN password VARCHAR(255) NULL AFTER affiliation",
        "ALTER TABLE members ADD COLUMN facebook_account VARCHAR(150) NULL AFTER affiliation",
        "ALTER TABLE members ADD COLUMN telegram_chat_id VARCHAR(100) NULL AFTER facebook_account",
        "ALTER TABLE members ADD COLUMN google_linked TINYINT(1) DEFAULT 0 AFTER telegram_chat_id"
    ];
    foreach ($safe_migrations as $sm) {
        try {
            $pdo->exec($sm);
        } catch (\Exception $e) {}
    }

    // 🔒 구글 1회 이상 로그인 성공 이력이 있는 회원만 google_linked = 1로 활성화
    try {
        $pdo->exec("UPDATE members SET google_linked = 1 WHERE (avatar_url IS NOT NULL AND avatar_url LIKE '%googleusercontent.com%') OR id = 'admin' OR id = 'Yongha'");
        $pdo->exec("UPDATE members SET google_linked = 0 WHERE id IN ('Jeanette', 'Jeremiah', 'Paulus', 'Andi', 'Hiro', 'Bockki') AND (avatar_url IS NULL OR avatar_url NOT LIKE '%googleusercontent.com%')");
    } catch (\Exception $e) {}

    $results['tables'] = 'Created or verified successfully (Production Safe Mode)';

    // 🔒 운영 모드: 회원 정보 보존 (INSERT IGNORE로 기존 데이터는 절대 덮어쓰지 않음)
    $stmt = $pdo->prepare("INSERT IGNORE INTO members 
        (id, email, name, name_en, provider, country_code, role, status, bio, phone, affiliation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($members_v150 as $m) {
        $stmt->execute([
            $m['id'],
            $m['email'],
            $m['name'],
            $m['name_en'] ?? $m['name'],
            $m['provider'],
            $m['country_code'],
            $m['role'],
            $m['status'],
            $m['bio'],
            $m['phone'],
            $m['affiliation']
        ]);
    }
    $results['members_preserved'] = true;

    // 🔒 기도제목 카드 초기 시드 (prayer_cards 테이블이 비어있을 때만 6개 기본 시드 주입)
    try {
        $pCount = (int)$pdo->query("SELECT COUNT(*) FROM prayer_cards")->fetchColumn();
        if ($pCount === 0) {
            $stmtP = $pdo->prepare("INSERT INTO prayer_cards (id, author_id, author_name, country_code, title, content, amen_count, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $initialPrayersSeed = [
                ['pr_1', 'ZawMin', 'Pastor Zaw Min', 'MM', '미얀마 신학 교육 및 평화 훈련 워크숍을 위한 기도', '올해 시작되는 신학 교육 프로그램과 평화 훈련 워크숍이 은혜 가운데 열릴 수 있도록 기도 부탁드립니다.\n정치적 불안과 어려운 시국 속에서도 신학생들과 청년들이 흔들리지 않고 그리스도의 평화 복음을 굳건히 배울 수 있도록 중보를 부탁드립니다.', 58, 1, '2026-09-28 10:00:00'],
                ['pr_2', 'SarahNguyen', 'Sarah Nguyen', 'VN', '베트남 청년 세대와 평화와 화해의 증인을 위한 기도', '교회의 다음 세대 청년들이 주님의 말씀을 사랑하고 지역 사회를 섬기며 평화와 화해의 증인이 되도록 기도합니다.\n4개 현지 가정교회가 연합하여 주일학교 교사 훈련을 잘 마칠 수 있도록 지혜를 더해 주소서.', 46, 0, '2026-09-27 11:30:00'],
                ['pr_3', 'Somchai', 'Somchai Prasert', 'TH', '태국어 AAMEN 교안 번역 감사 및 청소년 평화 캠프를 위한 기도', 'AAMEN 레슨이 태국어로 번역된 것에 감사드립니다. 이 교육 자료들이 현지 교회들을 든든히 세우는 데 귀하게 쓰이길 기도합니다.\n다음 달 태국 북부에서 열리는 청소년 평화 캠프 가운데도 주님의 풍성한 은혜를 구합니다.', 63, 0, '2026-09-26 14:15:00'],
                ['pr_4', 'Rajesh', 'Rajesh Kumar', 'IN', '인도 차티스가르 농촌 지역 구호 사역자들의 안전을 위한 기도', '인도 차티스가르 농촌 지역에서 가뭄과 경제적 빈곤으로 고통받는 이웃들을 위해 기도해 주세요.\n식량과 구호 약품을 나누며 그리스도의 사랑을 전하는 자원봉사자들의 안전과 물질 공급을 위해 손 모아 주시기 바랍니다.', 51, 1, '2026-09-25 09:20:00'],
                ['pr_5', 'Sunita', 'Sunita Shrestha', 'NP', '히말라야 산간 외딴 마을 목회자들과 평화 세미나를 위한 기도', '히말라야 산간 외딴 마을에서 묵묵히 복음을 전하는 현지 목회자들에게 건강과 사역의 지혜를 더하여 주시기를 기도합니다.\n서로 다른 부족 청년들이 주 안에서 용서와 화해를 배우는 평화 세미나가 큰 결실을 맺게 하소서.', 39, 0, '2026-09-24 16:45:00'],
                ['pr_6', 'Bounmy', 'Bounmy Keomany', 'LA', '메콩강 유역 평화 사역자들의 안전과 이웃 사랑을 위한 기도', '메콩강 유역에서 종교적 제약 속에서도 이웃 사랑과 섬김을 실천하는 평화 사역자들의 안전을 위해 기도합니다.\n지역 사회 주민들이 성도들의 희생과 돌봄을 통해 그리스도의 참된 평화를 발견하게 하소서.', 44, 0, '2026-09-23 08:50:00']
            ];
            foreach ($initialPrayersSeed as $row) {
                $stmtP->execute($row);
            }
            $results['prayers_seeded'] = true;
        }
    } catch (\Exception $e) {}

    send_json([
        'status' => 'success',
        'version' => 'v1.5.0-prod',
        'message' => 'Database schema verified successfully in Production Safe Mode. No data was deleted or overwritten.',
        'details' => $results
    ]);
} catch (Exception $e) {
    send_json([
        'status' => 'error',
        'message' => $e->getMessage()
    ], 500);
}
