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
    "ALTER TABLE posts ADD COLUMN extra_json LONGTEXT DEFAULT NULL"
];

// 🌟 공식 7명 회원 + 1명 개발자 계정 데이터셋 (2026-10-15 확정본)
$members_v150 = [
    // 1) 개발자 계정
    [
        'id' => 'admin',
        'email' => 'leeshkr@gmail.com',
        'name' => '개발자 관리자 (이승호)',
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
    $results['tables'] = 'Created or verified successfully';

    // 2. 실서버 모든 게시판 샘플 게시물 삭제 (posts, comments, prayer_cards)
    $pdo->exec("DELETE FROM comments");
    $pdo->exec("DELETE FROM posts");
    $pdo->exec("DELETE FROM prayer_cards");
    $results['sample_posts_cleaned'] = 'All sample posts, comments, and prayers deleted successfully';

    // 3. 기존 불필요한 샘플 회원 삭제 (개발자 및 7명 이외 회원 전부 정리)
    $validIds = array_map(function($m) { return "'" . $m['id'] . "'"; }, $members_v150);
    $validIdsStr = implode(',', $validIds);
    $pdo->exec("DELETE FROM members WHERE id NOT IN ($validIdsStr)");
    $results['unregistered_members_cleaned'] = true;

    // 4. 개발자 계정 및 7명 회원 정보 실서버 DB 최신 등록/갱신
    $stmt = $pdo->prepare("REPLACE INTO members 
        (id, email, name, provider, country_code, role, status, bio, phone, affiliation) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");

    foreach ($members_v150 as $m) {
        $stmt->execute([
            $m['id'],
            $m['email'],
            $m['name'],
            $m['provider'],
            $m['country_code'],
            $m['role'],
            $m['status'],
            $m['bio'],
            $m['phone'],
            $m['affiliation']
        ]);
    }
    $results['members_updated_count'] = count($members_v150);
    $results['members_list'] = array_column($members_v150, 'name');

    send_json([
        'status' => 'success',
        'version' => 'v1.5.0',
        'message' => 'Database successfully reset: sample posts removed, 7 official members + developer updated',
        'details' => $results
    ]);
} catch (Exception $e) {
    send_json([
        'status' => 'error',
        'message' => $e->getMessage()
    ], 500);
}
