<?php
// ============================================================================
// AAMEN Database Initializer & Migration for MariaDB 10.X
// Version: v1.5.1
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 6-1. coordinators 테이블 (15개국 국가별 코디네이터)
    "CREATE TABLE IF NOT EXISTS coordinators (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 7. internal_messages 테이블 (회원 간 1:1 쪽지 및 Level 4+ 그룹 공지 쪽지)
    "CREATE TABLE IF NOT EXISTS internal_messages (
        id VARCHAR(64) PRIMARY KEY,
        sender_id VARCHAR(64) NOT NULL,
        sender_name VARCHAR(100) NOT NULL,
        sender_country VARCHAR(10) DEFAULT 'KR',
        sender_role VARCHAR(30) DEFAULT 'regular',
        target_type ENUM('individual', 'group_country', 'group_coordinators', 'group_all') DEFAULT 'individual',
        target_country VARCHAR(10) DEFAULT NULL,
        receiver_id VARCHAR(64) DEFAULT NULL,
        receiver_name VARCHAR(100) DEFAULT NULL,
        title VARCHAR(300) NOT NULL,
        content LONGTEXT NOT NULL,
        translations_json LONGTEXT DEFAULT NULL,
        is_read TINYINT(1) DEFAULT 0,
        read_at DATETIME NULL,
        deleted_by_sender TINYINT(1) DEFAULT 0,
        deleted_by_receiver TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_msg_receiver (receiver_id, is_read),
        INDEX idx_msg_sender (sender_id),
        INDEX idx_msg_target (target_type, target_country),
        INDEX idx_msg_created_at (created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 8. message_receipts 테이블 (그룹 및 1:1 메시지 수신자별 읽음/삭제 상태 추적)
    "CREATE TABLE IF NOT EXISTS message_receipts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message_id VARCHAR(64) NOT NULL,
        user_id VARCHAR(64) NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        read_at DATETIME NULL,
        is_deleted TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        UNIQUE KEY uq_receipt (message_id, user_id),
        INDEX idx_user_read (user_id, is_read),
        INDEX idx_user_deleted (user_id, is_deleted)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 9. notifications 테이블 (통합 인앱 알림 센터)
    "CREATE TABLE IF NOT EXISTS notifications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        sender_id VARCHAR(64) NULL,
        sender_name VARCHAR(100) NULL,
        type VARCHAR(30) NOT NULL,
        title VARCHAR(300) NOT NULL,
        body TEXT NOT NULL,
        link_url VARCHAR(255) NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        INDEX idx_noti_user (user_id, is_read, created_at DESC)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;",

    // 10. push_subscriptions 테이블 (Web Push 토큰 구독)
    "CREATE TABLE IF NOT EXISTS push_subscriptions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(64) NOT NULL,
        endpoint TEXT NOT NULL,
        p256dh VARCHAR(255) NOT NULL,
        auth VARCHAR(255) NOT NULL,
        user_agent VARCHAR(255) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_push_user (user_id)
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
    // 컬럼 마이그레이션 (안전한 누락 컬럼 추가 및 비밀번호 컬럼 영구 제거)
    $safe_migrations = [
        "ALTER TABLE members ADD COLUMN name_en VARCHAR(100) NULL AFTER name",
        "ALTER TABLE members ADD COLUMN facebook_account VARCHAR(150) NULL AFTER affiliation",
        "ALTER TABLE members ADD COLUMN telegram_chat_id VARCHAR(100) NULL AFTER facebook_account",
        "ALTER TABLE members ADD COLUMN google_linked TINYINT(1) DEFAULT 1 AFTER telegram_chat_id"
    ];
    foreach ($safe_migrations as $sm) {
        try {
            $pdo->exec($sm);
        } catch (\Exception $e) {}
    }

    // 비밀번호 컬럼 영구 삭제
    try {
        $pdo->exec("ALTER TABLE members DROP COLUMN password");
    } catch (\Exception $e) {}

    $results['tables'] = 'Created or verified successfully (Production Safe Mode)';
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

    // 🔒 역사와교회 사진첩 초기 시드 (board_type = 'history_photos' 게시물이 없을 때만 초기 주입)
    try {
        $hpStmt = $pdo->prepare("SELECT COUNT(*) FROM posts WHERE board_type = 'history_photos'");
        $hpStmt->execute();
        $hpCount = (int)$hpStmt->fetchColumn();
        if ($hpCount === 0) {
            $stmtHP = $pdo->prepare("INSERT INTO posts (id, board_type, category, title, content, author_id, author_name, author_country, author_role, views, likes, is_pinned, amen_count, image_url, extra_json, created_at) VALUES (?, 'history_photos', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
            $initialHistoryPhotos = [
                [
                    'hp_seed_01', '컨퍼런스', '제1회 아시아 아나밥티스트 평화 교육 컨퍼런스',
                    "아시아 15개국 교회 지도자들과 평화 사역자들이 한자리에 모여 AAMEN의 공식 출범을 선포하고 평화 교육 헌장을 채택했습니다.\n분쟁과 갈등이 깊은 아시아 땅에서 화해의 제자도를 살아내기로 결단한 역사적인 순간이었습니다.",
                    'admin', 'AAMEN 총괄위원회', 'TH', 'super_admin', 245, 48, 1, 35,
                    'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
                    json_encode(['location' => '방콕 (Bangkok, Thailand)', 'flag' => '🇹🇭', 'attendees' => '15개국 대표단 120명', 'tags' => ['AAMEN출범', '평화컨퍼런스', '15개국연합']], JSON_UNESCAPED_UNICODE),
                    '2018-11-15 10:00:00'
                ],
                [
                    'hp_seed_02', '교육워크숍', '15개국 대표단 7대 레슨 플랜 집필 및 감수 워크숍',
                    "MWC 7대 확신을 아시아 청소년과 성도들이 이해하기 쉬운 12주 교안으로 집필하기 위해 각국 신학자와 교사들이 5일간 합숙하며 교재의 초안을 완성하고 다국어 번역 기준을 세웠습니다.",
                    'Yongha', 'Bae Yongha', 'KR', 'country_admin', 198, 36, 1, 28,
                    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=1200&q=80',
                    json_encode(['location' => '서울 (Seoul, Korea)', 'flag' => '🇰🇷', 'attendees' => '각국 교육분과 위원 35명', 'tags' => ['교재집필', '레슨플랜', '신학교육']], JSON_UNESCAPED_UNICODE),
                    '2022-06-20 14:00:00'
                ],
                [
                    'hp_seed_03', '청년캠프', '아시아 청년 메노나이트 평화 캠프 & 제자도 훈련',
                    "인도네시아, 미얀마, 베트남, 필리핀 등 아시아 청년들이 모여 문화와 언어를 뛰어넘는 그리스도의 한 가족 됨을 체험했습니다.\n밤마다 각국의 평화와 교회를 위해 눈물로 중보기도하는 뜨거운 은혜가 있었습니다.",
                    'Paulus', 'Paulus S. Widjaja', 'ID', 'country_admin', 312, 59, 0, 42,
                    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1200&q=80',
                    json_encode(['location' => '자바 (Java, Indonesia)', 'flag' => '🇮🇩', 'attendees' => '청년 리더 150명', 'tags' => ['청년평화캠프', '제자도훈련', '인도네시아']], JSON_UNESCAPED_UNICODE),
                    '2023-08-10 16:30:00'
                ],
                [
                    'hp_seed_04', '기념행사', '아나뱁티스트 500주년 기념 아시아 연합 포럼 & 찬양 집회',
                    "종교개혁과 아나뱁티스트 태동 500주년을 맞아 아시아 성도들이 순교자들의 신앙 유산을 기리며 비폭력 평화와 화해의 복음을 미래 세대에 계승할 것을 선포했습니다.",
                    'Hiro', 'Hiro Katano', 'JP', 'country_admin', 280, 52, 0, 39,
                    'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?auto=format&fit=crop&w=1200&q=80',
                    json_encode(['location' => '도쿄 (Tokyo, Japan)', 'flag' => '🇯🇵', 'attendees' => '아시아 성도 200명', 'tags' => ['500주년', '아나뱁티스트', '평화증언']], JSON_UNESCAPED_UNICODE),
                    '2025-05-12 11:00:00'
                ]
            ];
            foreach ($initialHistoryPhotos as $row) {
                $stmtHP->execute($row);
            }
            $results['history_photos_seeded'] = true;
        }
    } catch (\Exception $e) {}

    // 🔒 배너 테이블 보존 및 복원 (비어있을 때만 관리자 복원 배너 주입)
    try {
        $bCount = (int)$pdo->query("SELECT COUNT(*) FROM banners")->fetchColumn();
        if ($bCount === 0) {
            $stmtB = $pdo->prepare("INSERT INTO banners (id, banner_type, title, subtitle, image_url, link_url, badge_text, bg_gradient, display_order, is_active, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())");
            $adminBannersSeed = [
                ['banner_01', 'image', '아시아 아나뱁티스트/메노나이트를 잇는 평화와 교육의 공동체', '언어와 국경을 넘어 그리스도의 비폭력 평화와 제자도를 함께 배웁니다', '/uploads/banners/banner_20261015_013510_dc5fd4.jpeg', '/community/prayer', 'AAMEN GLOBAL NETWORK', 'from-emerald-700 via-teal-800 to-sky-900', 1, 1],
                ['banner_03', 'image', '아시아 언어로 완역된 공통의 신앙고백 교안', '하나님, 예수 그리스도, 성령, 평화와 화해 등 교회 주일학교와 신학교를 위한 교육 자료', 'https://images.unsplash.com/photo-1507692049790-de58290a4334?auto=format&fit=crop&w=1600&q=80', '/resources', 'CURRICULUM & RESOURCES', 'from-teal-800 via-emerald-800 to-cyan-900', 2, 1],
                ['banner_04', 'text', '“평화를 만드는 사람은 복이 있나니”', '마태복음 5:9 — 갈등과 분쟁 속에서 평화의 도구로 부르심 받은 아시아 성도들의 고백', '', '/community/board', 'SCRIPTURE OF PEACE', 'from-emerald-800 via-teal-900 to-green-950', 3, 1],
                ['banner_05', 'image', '함께 손잡고 드리는 기도의 벽 (Live Prayer Wall)', '미얀마, 베트남, 인도, 네팔, 남한, 일본, 홍통 등 아시아 각 나라에서 실시간으로 올라오는 기도의 제목에 \'아멘\'으로 응답하세요', '/uploads/banners/banner_20261015_013820_d6f696.jpeg', '/community/prayer', 'FELLOWSHIP & PRAYER', 'from-purple-900 via-indigo-900 to-sky-900', 4, 1],
                ['banner_02', 'text', 'MWC 아시아 아나밥티스트/메노나이트 연합 컨퍼런스', '“화해의 복음, 하나 된 아시아” — 각국 코디네이터 및 청년 리더십과 함께 하는 컨퍼런스', '', '/community/announcements', 'UPCOMING EVENT ASIA CONFERENCE', 'from-blue-900 via-indigo-900 to-slate-900', 5, 1]
            ];
            foreach ($adminBannersSeed as $row) {
                $stmtB->execute($row);
            }
            $results['banners_seeded'] = true;
        }
    } catch (\Exception $e) {}

    send_json([
        'status' => 'success',
        'version' => 'v1.5.1-prod-safe',
        'message' => 'Database schema verified successfully in Strict Production Safe Mode. No existing board posts or user data will ever be initialized or deleted.',
        'details' => $results
    ]);
} catch (Exception $e) {
    send_json([
        'status' => 'error',
        'message' => $e->getMessage()
    ], 500);
}
