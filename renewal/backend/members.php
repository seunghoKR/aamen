<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// 회원 등급 레벨 계산 헬퍼 함수 (0: 비회원, 1: 준회원, 2: 정회원, 3: 사역자, 4: 코디네이터, 5: 총괄관리자, 6: 개발자)
function get_tier_level($role) {
    if ($role === 'developer') return 6;
    if ($role === 'super_admin' || $role === 'level5_super_admin') return 5;
    if ($role === 'country_admin' || $role === 'level4_leader') return 4;
    if ($role === 'level3_worker') return 3;
    if ($role === 'regular' || $role === 'level2_regular') return 2;
    if ($role === 'associate' || $role === 'level1_associate') return 1;
    return 0;
}

// 비밀번호 컬럼 제거 (구글 단일 SSO 전환으로 DB 비밀번호 컬럼 영구 정리)
try {
    $colStmt = $pdo->query("SHOW COLUMNS FROM members LIKE 'password'");
    if ($colStmt->fetch()) {
        $pdo->exec("ALTER TABLE members DROP COLUMN password");
    }
} catch (\Exception $e) {}

if ($method === 'GET') {
    $search = $_GET['search'] ?? null;
    $role = $_GET['role'] ?? null;
    $country = $_GET['country'] ?? null;
    $singleId = $_GET['id'] ?? $_GET['user_id'] ?? null;
    $includeDev = isset($_GET['include_developer']) && ($_GET['include_developer'] === '1' || $_GET['include_developer'] === 'true');

    // 단일 회원 조회 (마이페이지 실시간 DB 동기화 및 관리자 상세조회)
    if ($singleId) {
        $stmt = $pdo->prepare("SELECT id, email, name, name_en, avatar_url, provider, country_code, role, status, bio, phone, affiliation, facebook_account, telegram_chat_id, google_linked, created_at, updated_at FROM members WHERE id = ? OR email = ? LIMIT 1");
        $stmt->execute([$singleId, $singleId]);
        $member = $stmt->fetch();
        if ($member) {
            $member['tierLevel'] = get_tier_level($member['role']);
            send_json(['status' => 'success', 'member' => $member]);
        } else {
            send_json(['status' => 'not_found', 'message' => 'Member not found'], 404);
        }
    }

    // 개발자 포함 여부 옵션 지원 (기본은 일반 회원 명단 조회)
    $sql = "SELECT id, email, name, name_en, avatar_url, provider, country_code, role, status, bio, phone, affiliation, facebook_account, telegram_chat_id, google_linked, created_at, updated_at FROM members WHERE 1=1";
    if (!$includeDev) {
        $sql .= " AND role != 'developer' AND email != 'admin@aamen.net' AND name NOT LIKE '%개발자%'";
    }
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

    foreach ($rows as &$r) {
        $r['tierLevel'] = get_tier_level($r['role']);
    }

    send_json($rows);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? null;

    // 🌟 구글 단일 소셜 로그인 & 자동 회원가입 API (구글 인증 전용)
    if ($action === 'google_login') {
        $email = trim($input['email'] ?? '');
        $name = trim($input['name'] ?? 'Google User');
        $avatar_url = trim($input['avatar_url'] ?? $input['picture'] ?? '');

        if (!$email) {
            send_json(['error' => 'Email is required for Google login'], 400);
        }

        // 1) DB에서 기존 회원 조회 (이메일 기준 단일 조회)
        $stmt = $pdo->prepare("SELECT id, email, name, name_en, role, status, country_code, avatar_url, phone, affiliation, facebook_account, telegram_chat_id, google_linked FROM members WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $memberInDb = $stmt->fetch();

        if ($memberInDb) {
            // 🛡️ 기존 회원이 이미 DB에 존재할 때: 관리자가 승인/조정한 등급(role) 및 사용자가 저장한 프로필 정보를 100% 영구 보존!
            try {
                $upSql = "UPDATE members SET google_linked = 1" . (!empty($avatar_url) ? ", avatar_url = COALESCE(NULLIF(avatar_url, ''), ?)" : "") . " WHERE email = ?";
                $upParams = !empty($avatar_url) ? [$avatar_url, $email] : [$email];
                $pdo->prepare($upSql)->execute($upParams);
                if (!empty($avatar_url) && empty($memberInDb['avatar_url'])) {
                    $memberInDb['avatar_url'] = $avatar_url;
                }
                $memberInDb['google_linked'] = 1;
            } catch (\Exception $e) {}

            $memberInDb['tierLevel'] = get_tier_level($memberInDb['role']);
            $memberInDb['provider'] = 'google';

            send_json([
                'status' => 'success',
                'is_new' => false,
                'message' => 'Google login successful (Existing member profile preserved)',
                'member' => $memberInDb
            ]);
        }

        // 2) 신규 구글 회원 등록: 모든 신규 회원은 예외 없이 1단계: 준회원(associate, tierLevel 1)으로 최초 가입!
        // (단, 시스템 개발자 이메일 leeshkr@gmail.com 만 developer로 초기 설정)
        $isDev = ($email === 'leeshkr@gmail.com' || $email === 'admin@aamen.net');
        $newId = $isDev ? 'admin' : ('g_' . substr(md5($email . time()), 0, 10));
        $country_code = 'KR';
        $role = $isDev ? 'developer' : 'associate';
        $tierLevel = get_tier_level($role);
        $status = 'active';

        $insStmt = $pdo->prepare("INSERT INTO members (id, email, name, avatar_url, provider, country_code, role, status, bio, google_linked, created_at) VALUES (?, ?, ?, ?, 'google', ?, ?, ?, ?, 1, NOW())");
        $insStmt->execute([
            $newId,
            $email,
            $name,
            $avatar_url,
            $country_code,
            $role,
            $status,
            $isDev ? 'AAMEN 시스템 개발 및 운영 총괄' : 'Google 계정 신규 가입 (1단계: 준회원)'
        ]);

        send_json([
            'status' => 'success',
            'is_new' => true,
            'message' => 'Google account registered as Tier 1 Associate Member',
            'member' => [
                'id' => $newId,
                'email' => $email,
                'name' => $name,
                'avatar_url' => $avatar_url,
                'role' => $role,
                'tierLevel' => $tierLevel,
                'status' => $status,
                'country_code' => $country_code,
                'provider' => 'google',
                'google_linked' => 1,
                'is_new' => true
            ]
        ], 201);
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
            // 회원이 존재하는지 확인
            $chk = $pdo->prepare("SELECT id, name, name_en, affiliation, country_code, phone, avatar_url FROM members WHERE id = ? OR email = ? LIMIT 1");
            $chk->execute([$userId, $userId]);
            $existing = $chk->fetch();

            if ($existing) {
                // 기존 회원 정보 유지하면서 전달된 유효 항목만 안전하게 갱신 (빈값으로 덮어쓰기 방지)
                $finalName = ($name !== '') ? $name : $existing['name'];
                $finalNameEn = ($nameEn !== '') ? $nameEn : (!empty($existing['name_en']) ? $existing['name_en'] : $finalName);
                $finalAffiliation = ($affiliation !== '') ? $affiliation : $existing['affiliation'];
                $finalCountry = ($countryCode !== '') ? $countryCode : $existing['country_code'];
                $finalPhone = ($phone !== '') ? $phone : $existing['phone'];
                $finalAvatar = ($avatarUrl !== '') ? $avatarUrl : $existing['avatar_url'];

                $upStmt = $pdo->prepare("UPDATE members SET name = ?, name_en = ?, affiliation = ?, country_code = ?, phone = ?, avatar_url = ?, updated_at = NOW() WHERE id = ? OR email = ?");
                $upStmt->execute([$finalName, $finalNameEn, $finalAffiliation, $finalCountry, $finalPhone, $finalAvatar, $userId, $userId]);
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

    // 🌟 1) 회원 전체 정보 수정 / 등급 변경 / 연동 설정 (관리자/개발자 권한 지원)
    if ($action === 'update_role' || $action === 'admin_update_member' || ($action === 'update' && $id)) {
        $targetId = $id ?? ($input['id'] ?? $input['user_id'] ?? null);
        if (!$targetId) {
            send_json(['error' => 'Target member ID required'], 400);
        }

        $fields = [];
        $params = [];

        $allowedFields = [
            'role', 'status', 'name', 'name_en', 'email', 'phone', 
            'affiliation', 'country_code', 'bio', 'avatar_url', 
            'google_linked', 'facebook_account', 'telegram_chat_id'
        ];

        foreach ($allowedFields as $field) {
            if (array_key_exists($field, $input)) {
                $fields[] = "{$field} = ?";
                $params[] = $input[$field];
            }
        }

        if (!empty($fields)) {
            $params[] = $targetId;
            $params[] = $targetId;
            $sql = "UPDATE members SET " . implode(', ', $fields) . ", updated_at = NOW() WHERE id = ? OR email = ?";
            try {
                $stmt = $pdo->prepare($sql);
                $stmt->execute($params);

                // 갱신된 회원 정보 재조회 반환
                $fStmt = $pdo->prepare("SELECT id, email, name, name_en, avatar_url, provider, country_code, role, status, bio, phone, affiliation, facebook_account, telegram_chat_id, google_linked, created_at, updated_at FROM members WHERE id = ? OR email = ? LIMIT 1");
                $fStmt->execute([$targetId, $targetId]);
                $updatedMem = $fStmt->fetch();
                if ($updatedMem) {
                    $updatedMem['tierLevel'] = get_tier_level($updatedMem['role']);
                }

                send_json([
                    'status' => 'success', 
                    'message' => 'Member updated successfully',
                    'member' => $updatedMem
                ]);
            } catch (\Exception $e) {
                send_json(['error' => 'Failed to update member: ' . $e->getMessage()], 500);
            }
        } else {
            send_json(['error' => 'No valid fields provided for update'], 400);
        }
    }

    // 🗑️ 2) POST로 회원 완전 삭제 (MariaDB 영구 삭제)
    if ($action === 'delete') {
        $targetId = $id ?? ($input['id'] ?? $input['email'] ?? null);
        if (!$targetId) {
            send_json(['error' => 'Target member ID or email required for deletion'], 400);
        }

        if ($targetId === 'admin' || $targetId === 'leeshkr@gmail.com') {
            send_json(['error' => 'Developer account cannot be deleted'], 403);
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM members WHERE id = ? OR email = ?");
            $stmt->execute([$targetId, $targetId]);

            // 관련 테이블에서도 안전하게 정리
            try {
                $pdo->prepare("DELETE FROM message_receipts WHERE user_id = ?")->execute([$targetId]);
                $pdo->prepare("DELETE FROM notifications WHERE user_id = ?")->execute([$targetId]);
            } catch (\Exception $e) {}

            send_json(['status' => 'success', 'message' => "Member '{$targetId}' permanently deleted from database"]);
        } catch (\Exception $e) {
            send_json(['error' => 'Failed to delete member: ' . $e->getMessage()], 500);
        }
    }

    // 신규 등록 API (구글 인증 외 직접 추가 시에도 1단계 준회원 기본)
    if (empty($input['email']) || empty($input['name'])) {
        send_json(['error' => 'Email and name required'], 400);
    }

    $id = $input['id'] ?? ('m_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6));
    $email = trim($input['email']);
    $name = trim($input['name']);
    $country_code = $input['country_code'] ?? $input['countryCode'] ?? 'KR';
    $role = $input['role'] ?? 'associate'; // 기본 1단계: 준회원
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

    $stmt = $pdo->prepare("INSERT INTO members (id, email, name, provider, country_code, role, status, bio, phone, affiliation, google_linked, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, NOW())");
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
            'tierLevel' => get_tier_level($role),
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

    if ($id === 'admin' || $id === 'leeshkr@gmail.com') {
        send_json(['error' => 'Developer account cannot be deleted'], 403);
    }

    $stmt = $pdo->prepare("DELETE FROM members WHERE id = ? OR email = ?");
    $stmt->execute([$id, $id]);

    try {
        $pdo->prepare("DELETE FROM message_receipts WHERE user_id = ?")->execute([$id]);
        $pdo->prepare("DELETE FROM notifications WHERE user_id = ?")->execute([$id]);
    } catch (\Exception $e) {}

    send_json(['status' => 'success', 'message' => "Member '{$id}' permanently deleted from database"]);
}
