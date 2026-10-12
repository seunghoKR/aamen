<?php
// ============================================================================
// AAMEN Database Initializer for MariaDB 10.X
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
        content TEXT NOT NULL,
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;"
];

$seed_members = [
    ['gimac', 'gimac1424@gmail.com', '배용하', 'google', 'KR', 'super_admin', 'active', 'AAMEN 총괄 사이트 관리자'],
    ['m_admin_kr', 'admin@aamen.net', 'AAMEN 총괄본부', 'google', 'KR', 'super_admin', 'active', 'AAMEN 사무국 및 시스템 총괄 관리자'],
    ['m_coord_mm', 'myanmar.leader@aamen.net', 'Zaw Min (미얀마 연합)', 'google', 'MM', 'country_admin', 'active', '미얀마 메노나이트 평화신학교 코디네이터'],
    ['m_coord_vn', 'vietnam.leader@aamen.net', 'Nguyen Van Thanh (베트남 연합)', 'google', 'VN', 'country_admin', 'active', '베트남 하노이 가정교회 연합 리더'],
    ['m_user_kr1', 'peace.korea@gmail.com', '이은혜 사역자', 'google', 'KR', 'regular', 'active', '한국 평화교육 네트워크 실무자'],
    ['m_user_in1', 'rajesh.kumar@gmail.com', 'Rajesh Kumar', 'google', 'IN', 'regular', 'active', '인도 차티스가르 선교 코디네이터'],
    ['m_user_guest', 'newbie@aamen.net', '김희망 (신규가입)', 'google', 'KR', 'associate', 'active', '청년 평화훈련 참가자 (승인 대기)']
];

$seed_posts = [
    ['p_ann_01', 'announce', '2026 아시아 아나밥티스트 메노나이트 연합 수련회 개최 안내', '2026년 가을, 아시아 13개국 멘토와 청년들이 한자리에 모여 평화와 복음을 나누는 글로벌 연합 수련회가 열립니다. 각국 코디네이터를 통해 참가 신청을 받고 있으니 많은 기도와 참여를 바랍니다.', 'AAMEN 총괄본부', 'KR', 'super_admin', 256, 45, 1, 0, '2026-09-20 09:00:00'],
    ['p_ann_02', 'announce', 'AAMEN 13개 언어 레슨 플랜 개정판 배포 소식', '아나밥티스트 7대 확신을 바탕으로 한 청소년/성인용 교육 교재 개정판이 13개국 언어로 완역되어 자료실에 업로드되었습니다. 각 지역 교회에서 무료로 내려받아 사용하실 수 있습니다.', '교육위원회', 'KR', 'super_admin', 198, 38, 0, 0, '2026-09-22 14:00:00'],
    ['p_board_01', 'board', '미얀마 양곤 평화신학교 가을학기 개강 소식 나눕니다', '어려운 시국 속에서도 하나님 나라의 평화와 비폭력 복음을 배우고자 하는 30명의 신학생들이 이번 학기를 시작했습니다. 안전과 배움을 위해 13개국 성도님들의 기도를 부탁드립니다.', 'Zaw Min', 'MM', 'country_admin', 162, 31, 0, 0, '2026-09-24 11:30:00'],
    ['p_board_02', 'board', '베트남 하노이 가정교회 모임 사진 및 은혜 나눔', '지난 주말 베트남 현지 4개 가정교회가 모여 아나밥티스트 찬송을 배우고 화해의 복음에 대해 교제하는 시간을 가졌습니다. 함께 예배할 수 있어 큰 감동이었습니다.', 'Nguyen Van Thanh', 'VN', 'country_admin', 145, 22, 0, 0, '2026-09-25 16:45:00'],
    ['p_board_03', 'board', '네팔 카트만두 평화 캠프 소식과 감사', '청년들을 위한 평화 구축 워크숍이 은혜 가운데 마무리되었습니다. 서로 다른 배경을 가진 청년들이 용서와 회복을 고백하는 귀한 시간이었습니다.', 'Sunita Shrestha', 'NP', 'regular', 105, 18, 0, 0, '2026-09-26 10:20:00'],
    ['p_board_04', 'board', '인도 차티스가르 메노나이트 교회 방문 후기', '오랜 역사와 전통을 가진 차티스가르 교회를 방문하여 성도님들과 따뜻한 교제를 나누었습니다. 가난한 이웃을 섬기는 그들의 헌신에 큰 도전을 받았습니다.', 'Rajesh Kumar', 'IN', 'regular', 128, 25, 0, 0, '2026-09-27 15:10:00'],
    ['p_share_01', 'share', '청소년을 위한 비폭력 평화 교육 워크시트 공유', '교회 주일학교 및 청소년부에서 바로 인쇄하여 활용할 수 있는 갈등 해결 실습 워크시트(PDF)를 공유합니다. 한국어와 영어 버전이 함께 포함되어 있습니다.', '이은혜 사역자', 'KR', 'regular', 230, 52, 0, 0, '2026-09-23 13:00:00'],
    ['p_share_02', 'share', '아나밥티스트 찬송가 모음집 오디오 음원 링크', '13개국 언어로 번역되어 불리는 대표적인 평화 찬양 음원과 악보 자료집 링크입니다. 주일 예배 찬양 시간에 유용하게 사용하실 수 있습니다.', '찬양사역팀', 'KR', 'regular', 189, 41, 0, 0, '2026-09-25 18:20:00']
];

$seed_prayers = [
    ['pr_01', 'Zaw Min', 'MM', '미얀마 평화와 지역 성도들의 안전을 위하여', '정치적 불안과 갈등 속에서도 성도들이 평화의 복음을 굳건히 지키고, 소외된 이웃들에게 그리스도의 사랑을 전할 수 있도록 기도해 주세요.', 158, 1, '2026-09-26 08:00:00'],
    ['pr_02', 'Sunita', 'NP', '네팔 히말라야 산간 마을 교회 지도자들을 위하여', '지리적으로 고립된 산간 지역에서 묵묵히 복음을 전하는 현지 목회자들에게 영육 간의 강건함과 사역의 지혜를 더하여 주시기를 기도합니다.', 96, 0, '2026-09-26 14:30:00'],
    ['pr_03', 'Nguyen', 'VN', '베트남 가정교회 다음세대 청년들을 위하여', '물질주의와 급격한 사회 변화 속에서 청년들이 아나밥티스트 신앙의 본질인 제자도를 배우고 교회 공동체의 기둥으로 자라나도록 손 모아 주세요.', 108, 0, '2026-09-27 09:15:00'],
    ['pr_04', 'Rajesh', 'IN', '인도 농촌 지역 빈민 구제 사역을 위하여', '가뭄과 경제적 빈곤으로 고통받는 차티스가르 농촌 지역 이웃들에게 실제적인 도움과 위로의 손길이 닿을 수 있도록 기도해 주세요.', 84, 0, '2026-09-27 17:00:00'],
    ['pr_05', 'Bounmy', 'LA', '라오스 메콩강 유역 평화 사역자들을 위하여', '종교적 제약 속에서도 이웃 사랑을 묵묵히 실천하는 사역자들의 안전과 복음의 평화로운 확장을 위해 기도합니다.', 72, 0, '2026-09-28 07:45:00']
];

$results = [];

try {
    foreach ($queries as $sql) {
        $pdo->exec($sql);
    }
    $results['tables'] = 'Created or verified successfully';

    // 회원 시드 데이터
    $stmt = $pdo->prepare("REPLACE INTO members (id, email, name, provider, country_code, role, status, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seed_members as $m) {
        $stmt->execute($m);
    }
    $results['members_seeded'] = count($seed_members);

    // 게시물 시드 데이터
    $stmt = $pdo->prepare("INSERT IGNORE INTO posts (id, board_type, title, content, author_name, author_country, author_role, views, likes, is_pinned, amen_count, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seed_posts as $p) {
        $stmt->execute($p);
    }
    $results['posts_seeded'] = count($seed_posts);

    // 기도 카드 시드 데이터
    $stmt = $pdo->prepare("INSERT IGNORE INTO prayer_cards (id, author_name, country_code, title, content, amen_count, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    foreach ($seed_prayers as $pr) {
        $stmt->execute($pr);
    }
    $results['prayers_seeded'] = count($seed_prayers);

    send_json([
        'status' => 'success',
        'message' => 'MariaDB database initialized successfully',
        'details' => $results
    ]);
} catch (Exception $e) {
    send_json([
        'status' => 'error',
        'message' => $e->getMessage()
    ], 500);
}
