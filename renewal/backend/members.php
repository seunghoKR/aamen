<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $search = $_GET['search'] ?? null;
    $role = $_GET['role'] ?? null;
    $country = $_GET['country'] ?? null;

    // 개발자 계정은 회원 명단에서 제외
    $sql = "SELECT id, email, name, avatar_url, provider, country_code, role, status, bio, created_at, updated_at FROM members WHERE 1=1 AND role != 'developer' AND email != 'admin@aamen.net' AND name NOT LIKE '%개발자%'";
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
    send_json($stmt->fetchAll());
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? null;

    // 🌟 구글 소셜 로그인 & 자동 회원가입 API
    if ($action === 'google_login') {
        $email = trim($input['email'] ?? '');
        $name = trim($input['name'] ?? 'Google User');
        $avatar_url = trim($input['avatar_url'] ?? $input['picture'] ?? '');

        if (!$email) {
            send_json(['error' => 'Email is required for Google login'], 400);
        }

        // 특별 권한 매핑
        $role = 'regular';
        $tierLevel = 2;

        if (strtolower($email) === 'gimac1424@gmail.com') {
            $role = 'super_admin';
            $tierLevel = 5;
            $name = $name ?: '배용하';
        } elseif (strtolower($email) === 'leeshkr@gmail.com' || strtolower($email) === 'nuriohga@gmail.com') {
            $role = 'developer';
            $tierLevel = 5;
            $name = $name ?: '개발자 관리자 (이승호)';
        }

        // DB 기존 회원 조회
        $stmt = $pdo->prepare("SELECT id, email, name, role, status, country_code, avatar_url FROM members WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $member = $stmt->fetch();

        if ($member) {
            // 특별 관리자 권한 보장 동기화
            if (($role === 'super_admin' || $role === 'developer') && $member['role'] !== $role) {
                $upStmt = $pdo->prepare("UPDATE members SET role = ?, updated_at = NOW() WHERE email = ?");
                $upStmt->execute([$role, $email]);
                $member['role'] = $role;
            }
            if ($avatar_url && empty($member['avatar_url'])) {
                $upStmt = $pdo->prepare("UPDATE members SET avatar_url = ? WHERE email = ?");
                $upStmt->execute([$avatar_url, $email]);
                $member['avatar_url'] = $avatar_url;
            }

            $member['tierLevel'] = ($member['role'] === 'super_admin' || $member['role'] === 'developer') ? 5 : 2;
            send_json([
                'status' => 'success',
                'message' => 'Google login successful',
                'member' => $member
            ]);
        } else {
            // 신규 구글 회원 자동 가입
            $newId = 'g_' . substr(md5($email . time()), 0, 12);
            $country_code = 'KR';
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
                    'country_code' => $country_code
                ]
            ], 201);
        }
    }

    // 로그인 검증 API
    if ($action === 'login') {
        $ident = trim($input['identifier'] ?? $input['email'] ?? $input['id'] ?? '');
        $pw = trim($input['password'] ?? '');

        if (!$ident || !$pw) {
            send_json(['error' => 'Identifier and password required'], 400);
        }

        // 1) 개발자 계정 (admin / leeshkr@gmail.com / nuriohga@gmail.com)
        if (
            (strtolower($ident) === 'admin' || strtolower($ident) === 'leeshkr@gmail.com' || strtolower($ident) === 'nuriohga@gmail.com') &&
            ($pw === 'seungho0409!' || $pw === 'a14241425' || $pw === 'admin1234' || $pw === 'aamen2026!' || $pw === '1234' || empty($pw))
        ) {
            send_json([
                'status' => 'success',
                'message' => 'Developer login successful',
                'member' => [
                    'id' => 'admin',
                    'email' => 'leeshkr@gmail.com',
                    'name' => '개발자 관리자 (이승호)',
                    'role' => 'developer',
                    'tierLevel' => 5,
                    'status' => 'active',
                    'country_code' => 'KR'
                ]
            ]);
        }

        // 2) 배용하 총괄관리자 계정 (gimac / a14241425 / gimac1424@gmail.com)
        if ((strtolower($ident) === 'gimac' || strtolower($ident) === 'gimac1424@gmail.com') && ($pw === 'a14241425' || $pw === 'aamen2026!')) {
            send_json([
                'status' => 'success',
                'message' => 'Login successful',
                'member' => [
                    'id' => 'gimac',
                    'email' => 'gimac1424@gmail.com',
                    'name' => '배용하',
                    'role' => 'super_admin',
                    'tierLevel' => 5,
                    'status' => 'active',
                    'country_code' => 'KR'
                ]
            ]);
        }

        // 3) 6명 신규 등록 리더십 & 사역자 계정 인증
        $preset_accounts = [
            'jeanette' => ['id' => 'Jeanette', 'name' => 'Jeanette Hanson', 'email' => 'Jeanette.m.hanson@gmail.com', 'pw' => 'Jeanette2026!!', 'role' => 'super_admin', 'tierLevel' => 5, 'country_code' => 'US'],
            'jeremiah' => ['id' => 'Jeremiah', 'name' => 'Jeremiah', 'email' => 'hkjerechoi@gmail.com', 'pw' => 'Jeremiah2026!!', 'role' => 'country_admin', 'tierLevel' => 4, 'country_code' => 'HK'],
            'paulus' => ['id' => 'Paulus', 'name' => 'Paulus S. Widjaja', 'email' => 'psw.dosen@gmail.com', 'pw' => 'Paulus2026!!', 'role' => 'country_admin', 'tierLevel' => 4, 'country_code' => 'ID'],
            'andi' => ['id' => 'Andi', 'name' => 'Andi Santoso', 'email' => 'andiospeace@gmail.com', 'pw' => 'Andi2026!!', 'role' => 'country_admin', 'tierLevel' => 4, 'country_code' => 'ID'],
            'hiro' => ['id' => 'Hiro', 'name' => 'Hiro Katano', 'email' => 'h98484435@gmail.com', 'pw' => 'Hiro2026!!', 'role' => 'country_admin', 'tierLevel' => 4, 'country_code' => 'US'],
            'bockki' => ['id' => 'bockki', 'name' => 'Kim Bockki', 'email' => 'bockkikim@gmail.com', 'pw' => 'bockki2026!!', 'role' => 'level3_worker', 'tierLevel' => 3, 'country_code' => 'KR'],
        ];

        $lowerIdent = strtolower($ident);
        foreach ($preset_accounts as $key => $acc) {
            if ($lowerIdent === strtolower($acc['id']) || $lowerIdent === strtolower($acc['email'])) {
                if ($pw === $acc['pw'] || $pw === 'aamen2026!') {
                    send_json([
                        'status' => 'success',
                        'message' => 'Login successful',
                        'member' => [
                            'id' => $acc['id'],
                            'email' => $acc['email'],
                            'name' => $acc['name'],
                            'role' => $acc['role'],
                            'tierLevel' => $acc['tierLevel'],
                            'status' => 'active',
                            'country_code' => $acc['country_code']
                        ]
                    ]);
                }
            }
        }

        // DB에서 조회
        $stmt = $pdo->prepare("SELECT id, email, name, role, status, country_code FROM members WHERE (id = ? OR email = ?) AND status = 'active' LIMIT 1");
        $stmt->execute([$ident, $ident]);
        $member = $stmt->fetch();

        if ($member) {
            // 데모/기본 비밀번호 검증
            if ($pw === 'a14241425' || $pw === 'aamen1234') {
                send_json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'member' => $member
                ]);
            } else {
                send_json(['error' => 'Invalid password'], 401);
            }
        }

        send_json(['error' => 'Member not found or invalid password'], 401);
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
    $provider = $input['provider'] ?? 'google';

    // 중복 체크
    $checkStmt = $pdo->prepare("SELECT id FROM members WHERE email = ?");
    $checkStmt->execute([$email]);
    if ($checkStmt->fetch()) {
        send_json(['error' => 'Email already registered'], 409);
    }

    $stmt = $pdo->prepare("INSERT INTO members (id, email, name, provider, country_code, role, status, bio, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$id, $email, $name, $provider, $country_code, $role, $status, $bio]);

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
