<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// 🌟 공식 8명 (개발자 1명 + 공식 회원 7명) 통합 계정 마스터 데이터 (2026-10-15 확정)
$OFFICIAL_MEMBERS = [
    'admin' => [
        'id' => 'admin',
        'name' => '개발자 관리자 (이승호)',
        'emails' => ['leeshkr@gmail.com', 'nuriohga@gmail.com', 'admin@aamen.net'],
        'passwords' => ['seungho0409!', 'aamen2026!', '1234'],
        'role' => 'developer',
        'tierLevel' => 5,
        'country_code' => 'KR',
        'phone' => '+82 10-4069-2739',
        'affiliation' => '누리오 (개발자)'
    ],
    'Jeanette' => [
        'id' => 'Jeanette',
        'name' => 'Jeanette Hanson',
        'emails' => ['jeanette.m.hanson@gmail.com'],
        'passwords' => ['Jeanette2026!!', 'aamen2026!'],
        'role' => 'super_admin',
        'tierLevel' => 5,
        'country_code' => 'US',
        'phone' => '+1 000-000-0000',
        'affiliation' => 'MWC'
    ],
    'Jeremiah' => [
        'id' => 'Jeremiah',
        'name' => 'Jeremiah',
        'emails' => ['hkjerechoi@gmail.com'],
        'passwords' => ['Jeremiah2026!!', 'aamen2026!'],
        'role' => 'country_admin',
        'tierLevel' => 4,
        'country_code' => 'HK',
        'phone' => '+852 0000-0000',
        'affiliation' => ''
    ],
    'Paulus' => [
        'id' => 'Paulus',
        'name' => 'Paulus S. Widjaja',
        'emails' => ['psw.dosen@gmail.com'],
        'passwords' => ['Paulus2026!!', 'aamen2026!'],
        'role' => 'country_admin',
        'tierLevel' => 4,
        'country_code' => 'ID',
        'phone' => '+62 000-0000-0000',
        'affiliation' => ''
    ],
    'Andi' => [
        'id' => 'Andi',
        'name' => 'Andi Santoso',
        'emails' => ['andiospeace@gmail.com'],
        'passwords' => ['Andi2026!!', 'aamen2026!'],
        'role' => 'country_admin',
        'tierLevel' => 4,
        'country_code' => 'US',
        'phone' => '+1 000-000-0000',
        'affiliation' => 'MNN'
    ],
    'Hiro' => [
        'id' => 'Hiro',
        'name' => 'Hiro Katano',
        'emails' => ['h98484435@gmail.com'],
        'passwords' => ['Hiro2026!!', 'aamen2026!'],
        'role' => 'country_admin',
        'tierLevel' => 4,
        'country_code' => 'JP',
        'phone' => '+81 00-0000-0000',
        'affiliation' => ''
    ],
    'Bockki' => [
        'id' => 'Bockki',
        'name' => 'Kim Bockki',
        'emails' => ['bockkikim@gmail.com'],
        'passwords' => ['bockki2026!!', 'aamen2026!'],
        'role' => 'level3_worker',
        'tierLevel' => 3,
        'country_code' => 'KR',
        'phone' => '+82 10-0000-0000',
        'affiliation' => 'MCSK'
    ],
    'Yongha' => [
        'id' => 'Yongha',
        'name' => 'Bae Yongha',
        'emails' => ['byh1424@gmail.com', 'gimac1424@gmail.com'],
        'passwords' => ['yongha2026!!', 'a14241425', 'aamen2026!'],
        'role' => 'country_admin',
        'tierLevel' => 4,
        'country_code' => 'KR',
        'phone' => '+82 10-0000-0000',
        'affiliation' => 'MCSK'
    ]
];

// 이메일이나 아이디로 공식 계정 조회 함수
function find_official_member($ident, $OFFICIAL_MEMBERS) {
    $lower = strtolower(trim($ident));
    foreach ($OFFICIAL_MEMBERS as $acc) {
        if (strtolower($acc['id']) === $lower) {
            return $acc;
        }
        foreach ($acc['emails'] as $em) {
            if (strtolower($em) === $lower) {
                return $acc;
            }
        }
    }
    return null;
}

if ($method === 'GET') {
    $search = $_GET['search'] ?? null;
    $role = $_GET['role'] ?? null;
    $country = $_GET['country'] ?? null;
    $singleId = $_GET['id'] ?? $_GET['user_id'] ?? null;

    // 단일 회원 조회 (마이페이지 실시간 DB 동기화)
    if ($singleId) {
        $stmt = $pdo->prepare("SELECT id, email, name, name_en, avatar_url, provider, country_code, role, status, bio, phone, affiliation, facebook_account, telegram_chat_id, google_linked, created_at, updated_at FROM members WHERE id = ? OR email = ? LIMIT 1");
        $stmt->execute([$singleId, $singleId]);
        $member = $stmt->fetch();
        if ($member) {
            send_json(['status' => 'success', 'member' => $member]);
        } else {
            send_json(['status' => 'not_found', 'message' => 'Member not found'], 404);
        }
    }

    // 개발자 계정은 회원 명단에서 제외하고 7명 공식 회원 + 기타 승인 회원 조회
    $sql = "SELECT id, email, name, name_en, avatar_url, provider, country_code, role, status, bio, phone, affiliation, facebook_account, telegram_chat_id, google_linked, created_at, updated_at FROM members WHERE 1=1 AND role != 'developer' AND email != 'admin@aamen.net' AND name NOT LIKE '%개발자%'";
    $params = [];

    if ($search) {
        $sql .= " AND (name LIKE ? OR email LIKE ?)";
        $params[] = "%{$search}%";
        $params[] = "%{$search}%";
    }

    if ($role && $role !== 'ALL') {
        $sql .= " AND role = ?";
        $params[] = $role;
    }

    if ($country && $country !== 'ALL') {
        $sql .= " AND country_code = ?";
        $params[] = $country;
    }

    $sql .= " ORDER BY created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $rows = $stmt->fetchAll();

    send_json($rows);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? null;

    // 🌟 구글 소셜 로그인 & 자동 회원가입 API (구글 계정 선택 후 연동)
    if ($action === 'google_login') {
        $email = trim($input['email'] ?? '');
        $name = trim($input['name'] ?? 'Google User');
        $avatar_url = trim($input['avatar_url'] ?? $input['picture'] ?? '');

        if (!$email) {
            send_json(['error' => 'Email is required for Google login'], 400);
        }

        // 1) 공식 8명 계정 매핑 확인 (Jeanette, Jeremiah, Paulus, Andi, Hiro, Bockki, Yongha, admin)
        $official = find_official_member($email, $OFFICIAL_MEMBERS);
        $officialId = $official ? $official['id'] : null;

        // 2) DB에서 기존 회원 조회 (사용자 수정본 보존 최우선)
        $stmt = $pdo->prepare("SELECT id, email, name, name_en, role, status, country_code, avatar_url, phone, affiliation, facebook_account, telegram_chat_id, google_linked FROM members WHERE email = ? " . ($officialId ? "OR id = ?" : "") . " LIMIT 1");
        if ($officialId) {
            $stmt->execute([$email, $officialId]);
        } else {
            $stmt->execute([$email]);
        }
        $memberInDb = $stmt->fetch();

        if ($memberInDb) {
            // 🛡️ 기존 회원이 존재하면: 사용자가 수정한 모든 정보(이름, 영문이름, 소속, 연락처, 소셜)를 100% 영구 보존!
            // 구글 로그인 성공 플래그(google_linked = 1)를 활성화하고, 아바타가 비어있을 때만 구글 프로필 사진 채우기
            try {
                $upSql = "UPDATE members SET google_linked = 1" . (!empty($avatar_url) ? ", avatar_url = COALESCE(NULLIF(avatar_url, ''), ?)" : "") . " WHERE id = ?";
                $upParams = !empty($avatar_url) ? [$avatar_url, $memberInDb['id']] : [$memberInDb['id']];
                $pdo->prepare($upSql)->execute($upParams);
                if (!empty($avatar_url) && empty($memberInDb['avatar_url'])) {
                    $memberInDb['avatar_url'] = $avatar_url;
                }
                $memberInDb['google_linked'] = 1;
            } catch (\Exception $e) {}

            $memberInDb['tierLevel'] = ($memberInDb['role'] === 'super_admin' || $memberInDb['role'] === 'developer') ? 5 : ($memberInDb['role'] === 'country_admin' ? 4 : 2);
            $memberInDb['provider'] = 'google';

            send_json([
                'status' => 'success',
                'message' => 'Google login successful (Existing member profile preserved)',
                'member' => $memberInDb
            ]);
        }

        // 3) DB에 없는 경우에만 최초 등록!
        if ($official) {
            try {
                $insStmt = $pdo->prepare("INSERT IGNORE INTO members (id, email, name, name_en, provider, country_code, role, status, phone, affiliation, avatar_url, created_at) VALUES (?, ?, ?, ?, 'google', ?, ?, 'active', ?, ?, ?, NOW())");
                $insStmt->execute([
                    $official['id'],
                    $official['emails'][0],
                    $official['name'],
                    $official['name'],
                    $official['country_code'],
                    $official['role'],
                    $official['phone'],
                    $official['affiliation'],
                    $avatar_url
                ]);
            } catch (\Exception $e) {}

            $stmt = $pdo->prepare("SELECT id, email, name, name_en, role, status, country_code, avatar_url, phone, affiliation, facebook_account, telegram_chat_id FROM members WHERE id = ? LIMIT 1");
            $stmt->execute([$official['id']]);
            $newOfficial = $stmt->fetch();
            $newOfficial['tierLevel'] = $official['tierLevel'];
            $newOfficial['provider'] = 'google';

            send_json([
                'status' => 'success',
                'message' => 'Official member registered and logged in',
                'member' => $newOfficial
            ]);
        }

        if ($member) {
            $member['tierLevel'] = ($member['role'] === 'super_admin' || $member['role'] === 'developer') ? 5 : ($member['role'] === 'country_admin' ? 4 : 2);
            $member['provider'] = 'google';
            send_json([
                'status' => 'success',
                'message' => 'Google login successful',
                'member' => $member
            ]);
        } else {
            // 신규 구글 회원 등록
            $newId = 'g_' . substr(md5($email . time()), 0, 10);
            $country_code = 'KR';
            $role = 'regular';
            $tierLevel = 2;
            $status = 'active';

            $insStmt = $pdo->prepare("INSERT INTO members (id, email, name, avatar_url, provider, country_code, role, status, bio, created_at) VALUES (?, ?, ?, ?, 'google', ?, ?, ?, 'Google 계정 인증 회원', NOW())");
            $insStmt->execute([$newId, $email, $name, $avatar_url, $country_code, $role, $status]);

            send_json([
                'status' => 'success',
                'message' => 'Google account registered and logged in',
                'member' => [
                    'id' => $newId,
                    'email' => $email,
                    'name' => $name,
                    'avatar_url' => $avatar_url,
                    'role' => $role,
                    'tierLevel' => $tierLevel,
                    'status' => $status,
                    'country_code' => $country_code,
                    'provider' => 'google'
                ]
            ], 201);
        }
    }

    // 🌟 0) 프로필 정보 영구 저장 및 수정 API (마이페이지 실시간 DB 동기화)
    if ($action === 'update_profile') {
        $userId = trim($input['user_id'] ?? $input['id'] ?? '');
        $name = trim($input['name'] ?? '');
        $nameEn = trim($input['name_en'] ?? '');
        $affiliation = trim($input['affiliation'] ?? '');
        $countryCode = trim($input['country_code'] ?? 'KR');
        $phone = trim($input['phone'] ?? '');
        $avatarUrl = trim($input['avatar_url'] ?? $input['avatar'] ?? '');

        if (!$userId) {
            send_json(['error' => 'User ID is required for profile update'], 400);
        }

        try {
            // name_en 컬럼 부재 시 생성
            try {
                $colStmt = $pdo->query("SHOW COLUMNS FROM members LIKE 'name_en'");
                if (!$colStmt->fetch()) {
                    $pdo->exec("ALTER TABLE members ADD COLUMN name_en VARCHAR(100) NULL AFTER name");
                }
            } catch (\Exception $e) {}

            // 회원이 존재하는지 확인
            $chk = $pdo->prepare("SELECT id FROM members WHERE id = ? OR email = ? LIMIT 1");
            $chk->execute([$userId, $userId]);
            $existing = $chk->fetch();

            if ($existing) {
                // 기존 회원 정보 유지하면서 전달된 유효 항목만 안전하게 갱신 (빈값으로 덮어쓰기 원천 차단)
                $finalName = ($name !== '') ? $name : $existing['name'];
                $finalNameEn = ($nameEn !== '') ? $nameEn : (!empty($existing['name_en']) ? $existing['name_en'] : $finalName);
                $finalAffiliation = ($affiliation !== '') ? $affiliation : $existing['affiliation'];
                $finalCountry = ($countryCode !== '') ? $countryCode : $existing['country_code'];
                $finalPhone = ($phone !== '') ? $phone : $existing['phone'];
                $finalAvatar = ($avatarUrl !== '') ? $avatarUrl : $existing['avatar_url'];

                $upStmt = $pdo->prepare("UPDATE members SET name = ?, name_en = ?, affiliation = ?, country_code = ?, phone = ?, avatar_url = ?, updated_at = NOW() WHERE id = ? OR email = ?");
                $upStmt->execute([$finalName, $finalNameEn, $finalAffiliation, $finalCountry, $finalPhone, $finalAvatar, $userId, $userId]);
            } else {
                // 신규 회원 INSERT
                $insStmt = $pdo->prepare("INSERT INTO members (id, email, name, name_en, affiliation, country_code, phone, avatar_url, role, status, provider, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'regular', 'active', 'local', NOW())");
                $insStmt->execute([$userId, $userId . '@aamen.net', $name, $nameEn ?: $name, $affiliation, $countryCode ?: 'KR', $phone, $avatarUrl]);
            }

            // DB에서 최신 저장본 조회하여 반환
            $fStmt = $pdo->prepare("SELECT id, email, name, name_en, affiliation, country_code, phone, avatar_url, role, status FROM members WHERE id = ? OR email = ? LIMIT 1");
            $fStmt->execute([$userId, $userId]);
            $latestMember = $fStmt->fetch();

            send_json([
                'status' => 'success',
                'message' => 'Profile updated and permanently stored in database',
                'member' => $latestMember
            ]);
        } catch (\Exception $e) {
            send_json(['error' => 'Failed to save profile to database: ' . $e->getMessage()], 500);
        }
    }

    // 🌟 0-1) 페이스북 & 텔레그램 연동 상태 및 계정 정보 영구 저장 API
    if ($action === 'update_social') {
        $userId = trim($input['user_id'] ?? $input['id'] ?? '');
        $platform = trim($input['platform'] ?? '');
        $account = trim($input['account'] ?? '');
        $connected = ($input['connected'] ?? true);

        if (!$userId || !$platform) {
            send_json(['error' => 'User ID and platform are required'], 400);
        }

        try {
            // 컬럼 부재 시 생성
            try {
                $pdo->exec("ALTER TABLE members ADD COLUMN facebook_account VARCHAR(150) NULL AFTER affiliation");
            } catch (\Exception $e) {}
            try {
                $pdo->exec("ALTER TABLE members ADD COLUMN telegram_chat_id VARCHAR(100) NULL AFTER facebook_account");
            } catch (\Exception $e) {}

            if ($platform === 'facebook') {
                $val = ($connected && $account) ? $account : null;
                $upStmt = $pdo->prepare("UPDATE members SET facebook_account = ?, updated_at = NOW() WHERE id = ? OR email = ?");
                $upStmt->execute([$val, $userId, $userId]);
            } elseif ($platform === 'telegram') {
                $val = ($connected && $account) ? $account : null;
                $upStmt = $pdo->prepare("UPDATE members SET telegram_chat_id = ?, updated_at = NOW() WHERE id = ? OR email = ?");
                $upStmt->execute([$val, $userId, $userId]);
            }

            send_json([
                'status' => 'success',
                'message' => "Social account ($platform) updated successfully",
                'platform' => $platform,
                'connected' => (bool)$connected,
                'account' => $connected ? $account : null
            ]);
        } catch (\Exception $e) {
            send_json(['error' => 'Failed to update social account: ' . $e->getMessage()], 500);
        }
    }

    // 🌟 1) 비밀번호 및 계정 보안 변경 API (마이페이지 연동)
    if ($action === 'update_security' || $action === 'update_password' || $action === 'update_credentials') {
        $userId = trim($input['user_id'] ?? $input['id'] ?? '');
        $newId = trim($input['new_id'] ?? '');
        $newPassword = trim($input['new_password'] ?? $input['password'] ?? '');

        if (!$userId) {
            send_json(['error' => 'User ID is required'], 400);
        }

        try {
            // password 컬럼 부재 시 생성
            try {
                $colStmt = $pdo->query("SHOW COLUMNS FROM members LIKE 'password'");
                if (!$colStmt->fetch()) {
                    $pdo->exec("ALTER TABLE members ADD COLUMN password VARCHAR(255) NULL AFTER affiliation");
                }
            } catch (\Exception $e) {}

            // 비밀번호 업데이트
            if ($newPassword) {
                $upStmt = $pdo->prepare("UPDATE members SET password = ? WHERE id = ? OR email = ?");
                $upStmt->execute([$newPassword, $userId, $userId]);
            }

            // 아이디(User ID) 업데이트
            if ($newId && $newId !== $userId) {
                // 중복 체크
                $chkStmt = $pdo->prepare("SELECT id FROM members WHERE id = ? AND id != ? LIMIT 1");
                $chkStmt->execute([$newId, $userId]);
                if ($chkStmt->fetch()) {
                    send_json(['error' => 'This ID is already taken.'], 409);
                }

                $idStmt = $pdo->prepare("UPDATE members SET id = ? WHERE id = ?");
                $idStmt->execute([$newId, $userId]);
            }

            send_json([
                'status' => 'success',
                'message' => 'Account security credentials updated successfully',
                'id' => $newId ?: $userId
            ]);
        } catch (\Exception $e) {
            send_json(['error' => 'Failed to update credentials: ' . $e->getMessage()], 500);
        }
    }

    // 🔐 2) 아이디 / 비밀번호 로그인 검증 API
    if ($action === 'login') {
        $ident = trim($input['identifier'] ?? $input['email'] ?? $input['id'] ?? '');
        $pw = trim($input['password'] ?? '');

        if (!$ident || !$pw) {
            send_json(['error' => 'Identifier and password required'], 400);
        }

        // password 컬럼 부재 시 자동 생성
        try {
            $colStmt = $pdo->query("SHOW COLUMNS FROM members LIKE 'password'");
            if (!$colStmt->fetch()) {
                $pdo->exec("ALTER TABLE members ADD COLUMN password VARCHAR(255) NULL AFTER affiliation");
            }
        } catch (\Exception $e) {}

        // 1) DB에서 먼저 회원 조회
        $memberInDb = null;
        try {
            $stmt = $pdo->prepare("SELECT id, email, name, role, status, country_code, avatar_url, phone, affiliation, password FROM members WHERE (id = ? OR email = ?) LIMIT 1");
            $stmt->execute([$ident, $ident]);
            $memberInDb = $stmt->fetch();
        } catch (\Exception $e) {}

        // 2) 공식 8명 계정 확인 (admin, Jeanette, Jeremiah, Paulus, Andi, Hiro, Bockki, Yongha)
        $official = find_official_member($ident, $OFFICIAL_MEMBERS);

        // 비밀번호 일치 여부 확인
        $isAuthorized = false;

        // A. 마스터 공통 패스워드 허용
        if ($pw === 'aamen2026!' || $pw === 'seungho0409!' || $pw === '1234' || $pw === 'a14241425' || $pw === 'seungho' || $pw === 'seungho0409' || $pw === 'aamen1234' || $pw === 'admin' || $pw === 'admin1234' || $pw === 'aamen!') {
            $isAuthorized = true;
        }

        // B. DB에 저장된 비밀번호와 일치하는지 확인
        if ($memberInDb && !empty($memberInDb['password'])) {
            if ($pw === $memberInDb['password'] || (function_exists('password_verify') && @password_verify($pw, $memberInDb['password']))) {
                $isAuthorized = true;
            }
        }

        // C. 공식 계정 프리셋 비밀번호 확인
        if ($official) {
            if (in_array($pw, $official['passwords'], true)) {
                $isAuthorized = true;
            }
        }

        if ($isAuthorized) {
            $targetId = $official ? $official['id'] : ($memberInDb['id'] ?? $ident);

            // DB 비밀번호 동기화
            try {
                $pdo->prepare("UPDATE members SET password = ? WHERE id = ? OR email = ?")->execute([$pw, $targetId, $ident]);
            } catch (\Exception $e) {}

            // DB에서 최신 회원 정보 조회 (사용자가 수정한 이름, 영문명, 소속, 연락처, 소셜 정보 100% 보존)
            $dbUser = null;
            try {
                $stmt = $pdo->prepare("SELECT id, email, name, name_en, role, status, country_code, avatar_url, phone, affiliation, facebook_account, telegram_chat_id FROM members WHERE id = ? OR email = ? LIMIT 1");
                $stmt->execute([$targetId, $ident]);
                $dbUser = $stmt->fetch();
            } catch (\Exception $e) {}

            if (!$dbUser && $official) {
                // DB에 아직 없으면 최초 1회 안전하게 생성
                try {
                    $ins = $pdo->prepare("INSERT IGNORE INTO members (id, email, name, name_en, role, status, country_code, phone, affiliation, provider, created_at) VALUES (?, ?, ?, ?, ?, 'active', ?, ?, ?, 'local', NOW())");
                    $ins->execute([
                        $official['id'],
                        $official['emails'][0],
                        $official['name'],
                        $official['name'],
                        $official['role'],
                        $official['country_code'],
                        $official['phone'],
                        $official['affiliation']
                    ]);
                    $stmt = $pdo->prepare("SELECT id, email, name, name_en, role, status, country_code, avatar_url, phone, affiliation, facebook_account, telegram_chat_id FROM members WHERE id = ? LIMIT 1");
                    $stmt->execute([$official['id']]);
                    $dbUser = $stmt->fetch();
                } catch (\Exception $e) {}
            }

            if ($dbUser) {
                $tierLevel = ($dbUser['role'] === 'super_admin' || $dbUser['role'] === 'developer') ? 5 : ($dbUser['role'] === 'country_admin' ? 4 : 2);
                $dbUser['tierLevel'] = $official ? $official['tierLevel'] : $tierLevel;
                $dbUser['provider'] = 'local';
                send_json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'member' => $dbUser
                ]);
            }
        }

        // 불일치 시
        if ($official) {
            send_json(['error' => 'Invalid password for member ' . $official['name']], 401);
        } elseif ($memberInDb) {
            send_json(['error' => 'Invalid password for member ' . $memberInDb['name']], 401);
        } else {
            send_json(['error' => 'Member not found or invalid credentials'], 401);
        }
    }

    // POST로 회원 수정/등급변경
    if ($action === 'update_role' || ($action === 'update' && $id)) {
        $fields = [];
        $params = [];
        if (isset($input['role'])) {
            $fields[] = "role = ?";
            $params[] = $input['role'];
        }
        if (isset($input['status'])) {
            $fields[] = "status = ?";
            $params[] = $input['status'];
        }
        if (isset($input['name'])) {
            $fields[] = "name = ?";
            $params[] = $input['name'];
        }
        if (isset($input['phone'])) {
            $fields[] = "phone = ?";
            $params[] = $input['phone'];
        }
        if (isset($input['affiliation'])) {
            $fields[] = "affiliation = ?";
            $params[] = $input['affiliation'];
        }
        if (!empty($fields)) {
            $params[] = $id;
            $sql = "UPDATE members SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ?";
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            send_json(['status' => 'success', 'message' => 'Member updated successfully']);
        }
    }

    // POST로 회원 삭제
    if ($action === 'delete' && $id) {
        $stmt = $pdo->prepare("DELETE FROM members WHERE id = ?");
        $stmt->execute([$id]);
        send_json(['status' => 'success', 'message' => 'Member deleted']);
    }

    // 신규 등록
    if (empty($input['email']) || empty($input['name'])) {
        send_json(['error' => 'Email and name required'], 400);
    }

    $id = $input['id'] ?? ('m_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6));
    $email = trim($input['email']);
    $name = trim($input['name']);
    $country_code = $input['country_code'] ?? $input['countryCode'] ?? 'KR';
    $role = $input['role'] ?? 'regular';
    $status = $input['status'] ?? 'active';
    $bio = $input['bio'] ?? null;
    $phone = $input['phone'] ?? null;
    $affiliation = $input['affiliation'] ?? null;
    $provider = $input['provider'] ?? 'google';

    // 중복 체크
    $checkStmt = $pdo->prepare("SELECT id FROM members WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        send_json(['error' => 'Email already registered'], 409);
    }

    $stmt = $pdo->prepare("INSERT INTO members (id, email, name, provider, country_code, role, status, bio, phone, affiliation, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$id, $email, $name, $provider, $country_code, $role, $status, $bio, $phone, $affiliation]);

    send_json([
        'status' => 'success',
        'message' => 'Member registered successfully',
        'member' => [
            'id' => $id,
            'email' => $email,
            'name' => $name,
            'country_code' => $country_code,
            'role' => $role,
            'status' => $status
        ]
    ], 201);
} elseif ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $_GET['id'] ?? $input['id'] ?? null;

    if (!$id) {
        send_json(['error' => 'Member ID required'], 400);
    }

    $fields = [];
    $params = [];

    if (isset($input['role'])) {
        $fields[] = "role = ?";
        $params[] = $input['role'];
    }
    if (isset($input['status'])) {
        $fields[] = "status = ?";
        $params[] = $input['status'];
    }
    if (isset($input['name'])) {
        $fields[] = "name = ?";
        $params[] = $input['name'];
    }
    if (isset($input['phone'])) {
        $fields[] = "phone = ?";
        $params[] = $input['phone'];
    }
    if (isset($input['affiliation'])) {
        $fields[] = "affiliation = ?";
        $params[] = $input['affiliation'];
    }

    if (empty($fields)) {
        send_json(['error' => 'No fields to update'], 400);
    }

    $params[] = $id;
    $sql = "UPDATE members SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);

    send_json(['status' => 'success', 'message' => 'Member updated successfully']);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        send_json(['error' => 'Member ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM members WHERE id = ?");
    $stmt->execute([$id]);
    send_json(['status' => 'success', 'message' => 'Member deleted']);
}
