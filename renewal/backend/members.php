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

    // 개발자 계정은 회원 명단에서 제외하고 7명 공식 회원 + 기타 승인 회원 조회
    $sql = "SELECT id, email, name, avatar_url, provider, country_code, role, status, bio, phone, affiliation, created_at, updated_at FROM members WHERE 1=1 AND role != 'developer' AND email != 'admin@aamen.net' AND name NOT LIKE '%개발자%'";
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
        if ($official) {
            // DB에 최신 정보 동기화
            try {
                $upStmt = $pdo->prepare("REPLACE INTO members (id, email, name, provider, country_code, role, status, phone, affiliation) VALUES (?, ?, ?, 'google', ?, ?, 'active', ?, ?)");
                $upStmt->execute([
                    $official['id'],
                    $official['emails'][0],
                    $official['name'],
                    $official['country_code'],
                    $official['role'],
                    $official['phone'],
                    $official['affiliation']
                ]);
            } catch (\Exception $e) {}

            send_json([
                'status' => 'success',
                'message' => 'Google login verified for official member',
                'member' => [
                    'id' => $official['id'],
                    'email' => $official['emails'][0],
                    'name' => $official['name'],
                    'role' => $official['role'],
                    'tierLevel' => $official['tierLevel'],
                    'country_code' => $official['country_code'],
                    'phone' => $official['phone'],
                    'affiliation' => $official['affiliation'],
                    'status' => 'active',
                    'provider' => 'google'
                ]
            ]);
        }

        // 2) DB 기존 회원 조회
        $stmt = $pdo->prepare("SELECT id, email, name, role, status, country_code, avatar_url, phone, affiliation FROM members WHERE email = ? LIMIT 1");
        $stmt->execute([$email]);
        $member = $stmt->fetch();

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

    // 🔐 아이디 / 비밀번호 로그인 검증 API
    if ($action === 'login') {
        $ident = trim($input['identifier'] ?? $input['email'] ?? $input['id'] ?? '');
        $pw = trim($input['password'] ?? '');

        if (!$ident || !$pw) {
            send_json(['error' => 'Identifier and password required'], 400);
        }

        // 1) 공식 8명 계정 검증 (아이디 또는 이메일)
        $official = find_official_member($ident, $OFFICIAL_MEMBERS);
        if ($official) {
            $pwMatched = false;
            foreach ($official['passwords'] as $presetPw) {
                if ($pw === $presetPw) {
                    $pwMatched = true;
                    break;
                }
            }
            if ($pw === 'aamen2026!' || ($official['role'] === 'developer' && $pw === 'seungho0409!')) {
                $pwMatched = true;
            }

            if ($pwMatched) {
                send_json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'member' => [
                        'id' => $official['id'],
                        'email' => $official['emails'][0],
                        'name' => $official['name'],
                        'role' => $official['role'],
                        'tierLevel' => $official['tierLevel'],
                        'status' => 'active',
                        'country_code' => $official['country_code'],
                        'phone' => $official['phone'],
                        'affiliation' => $official['affiliation'],
                        'provider' => 'local'
                    ]
                ]);
            } else {
                send_json(['error' => 'Invalid password for member ' . $official['name']], 401);
            }
        }

        // 2) DB에서 일반 회원 조회
        $stmt = $pdo->prepare("SELECT id, email, name, role, status, country_code, phone, affiliation FROM members WHERE (id = ? OR email = ?) AND status = 'active' LIMIT 1");
        $stmt->execute([$ident, $ident]);
        $member = $stmt->fetch();

        if ($member) {
            if ($pw === 'aamen2026!' || $pw === 'a14241425' || $pw === 'aamen1234') {
                $member['tierLevel'] = ($member['role'] === 'super_admin' || $member['role'] === 'developer') ? 5 : ($member['role'] === 'country_admin' ? 4 : 2);
                send_json([
                    'status' => 'success',
                    'message' => 'Login successful',
                    'member' => $member
                ]);
            } else {
                send_json(['error' => 'Invalid password'], 401);
            }
        }

        send_json(['error' => 'Member not found or invalid credentials'], 401);
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
