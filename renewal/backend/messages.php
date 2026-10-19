<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// 테이블 자동 생성 보장
try {
    $pdo->exec("CREATE TABLE IF NOT EXISTS internal_messages (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS message_receipts (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");

    $pdo->exec("CREATE TABLE IF NOT EXISTS notifications (
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
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;");
} catch (\Exception $e) {}

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'inbox';
    $userId = $_GET['user_id'] ?? null;
    $country = $_GET['country'] ?? 'KR';
    $role = $_GET['role'] ?? 'regular';

    if (!$userId) {
        send_json(['success' => false, 'error' => 'user_id is required'], 400);
    }

    // 1. 안읽은 메시지 수 카운트
    if ($action === 'unread_count') {
        $isCoord = in_array($role, ['country_admin', 'super_admin']) ? 1 : 0;
        $sql = "SELECT COUNT(*) FROM internal_messages m
                LEFT JOIN message_receipts mr ON mr.message_id = m.id AND mr.user_id = :uid
                WHERE m.sender_id != :uid
                  AND COALESCE(mr.is_deleted, 0) = 0
                  AND (
                      (m.target_type = 'individual' AND m.receiver_id = :uid AND m.deleted_by_receiver = 0 AND m.is_read = 0 AND COALESCE(mr.is_read, 0) = 0)
                      OR (m.target_type = 'group_all' AND COALESCE(mr.is_read, 0) = 0)
                      OR (m.target_type = 'group_country' AND m.target_country = :country AND COALESCE(mr.is_read, 0) = 0)
                      OR (m.target_type = 'group_coordinators' AND :is_coord = 1 AND COALESCE(mr.is_read, 0) = 0)
                  )";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $userId,
            ':country' => $country,
            ':is_coord' => $isCoord
        ]);
        $count = (int)$stmt->fetchColumn();
        send_json(['success' => true, 'unread_count' => $count]);
    }

    // 2. 받은 쪽지함 (Inbox)
    if ($action === 'inbox') {
        $isCoord = in_array($role, ['country_admin', 'super_admin']) ? 1 : 0;
        $sql = "SELECT 
                    m.*,
                    CASE 
                        WHEN m.target_type = 'individual' THEN m.is_read
                        ELSE COALESCE(mr.is_read, 0)
                    END AS user_is_read,
                    CASE 
                        WHEN m.target_type = 'individual' THEN m.read_at
                        ELSE mr.read_at
                    END AS user_read_at
                FROM internal_messages m
                LEFT JOIN message_receipts mr ON mr.message_id = m.id AND mr.user_id = :uid
                WHERE m.sender_id != :uid
                  AND COALESCE(mr.is_deleted, 0) = 0
                  AND (
                      (m.target_type = 'individual' AND m.receiver_id = :uid AND m.deleted_by_receiver = 0)
                      OR (m.target_type = 'group_all')
                      OR (m.target_type = 'group_country' AND m.target_country = :country)
                      OR (m.target_type = 'group_coordinators' AND :is_coord = 1)
                  )
                ORDER BY m.created_at DESC
                LIMIT 100";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $userId,
            ':country' => $country,
            ':is_coord' => $isCoord
        ]);
        $rows = $stmt->fetchAll();
        send_json(['success' => true, 'data' => $rows]);
    }

    // 3. 보낸 쪽지함 (Outbox)
    if ($action === 'outbox') {
        $sql = "SELECT m.* FROM internal_messages m
                WHERE m.sender_id = :uid AND m.deleted_by_sender = 0
                ORDER BY m.created_at DESC
                LIMIT 100";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([':uid' => $userId]);
        $rows = $stmt->fetchAll();
        send_json(['success' => true, 'data' => $rows]);
    }

    // 4. 단일 쪽지 상세 조회 (자동 읽음 처리)
    if ($action === 'detail') {
        $msgId = $_GET['id'] ?? null;
        if (!$msgId) {
            send_json(['success' => false, 'error' => 'Message id required'], 400);
        }
        $stmt = $pdo->prepare("SELECT * FROM internal_messages WHERE id = ?");
        $stmt->execute([$msgId]);
        $msg = $stmt->fetch();
        if (!$msg) {
            send_json(['success' => false, 'error' => 'Message not found'], 404);
        }

        // 수신자가 열람한 경우 읽음 처리
        if ($msg['sender_id'] !== $userId) {
            if ($msg['target_type'] === 'individual' && $msg['receiver_id'] === $userId) {
                $pdo->prepare("UPDATE internal_messages SET is_read = 1, read_at = NOW() WHERE id = ? AND is_read = 0")
                    ->execute([$msgId]);
            }
            // 영수증 upsert
            $pdo->prepare("INSERT INTO message_receipts (message_id, user_id, is_read, read_at) 
                           VALUES (?, ?, 1, NOW()) 
                           ON DUPLICATE KEY UPDATE is_read = 1, read_at = COALESCE(read_at, NOW())")
                ->execute([$msgId, $userId]);
        }

        send_json(['success' => true, 'data' => $msg]);
    }

    send_json(['success' => false, 'error' => 'Invalid action'], 400);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        send_json(['success' => false, 'error' => 'Invalid JSON input'], 400);
    }

    $action = $input['action'] ?? 'send';

    // 1. 쪽지 발송 (1:1 또는 그룹 공지)
    if ($action === 'send') {
        $senderId = trim($input['sender_id'] ?? '');
        $senderName = trim($input['sender_name'] ?? '');
        $senderCountry = trim($input['sender_country'] ?? 'KR');
        $senderRole = trim($input['sender_role'] ?? 'regular');
        $targetType = trim($input['target_type'] ?? 'individual');
        $targetCountry = !empty($input['target_country']) ? trim($input['target_country']) : null;
        $receiverId = !empty($input['receiver_id']) ? trim($input['receiver_id']) : null;
        $receiverName = !empty($input['receiver_name']) ? trim($input['receiver_name']) : null;
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        $translationsJson = !empty($input['translations_json']) ? (is_string($input['translations_json']) ? $input['translations_json'] : json_encode($input['translations_json'], JSON_UNESCAPED_UNICODE)) : null;

        if (!$senderId || !$title || !$content) {
            send_json(['success' => false, 'error' => 'sender_id, title, and content are required'], 400);
        }

        // 권한 체크 1: 준회원(associate)은 발신 불가 (정회원 Level 2+ 이상만 발신 가능)
        if ($senderRole === 'associate') {
            send_json(['success' => false, 'error' => '준회원은 쪽지를 발신할 수 없습니다. 관리자 승인 후 정회원부터 발신 가능합니다.'], 403);
        }

        // 권한 체크 2: 그룹 메시지는 Level 4(country_admin) 및 Level 5(super_admin)만 발신 가능
        if (in_array($targetType, ['group_country', 'group_coordinators', 'group_all'])) {
            if (!in_array($senderRole, ['country_admin', 'super_admin'])) {
                send_json(['success' => false, 'error' => '그룹 공지 쪽지는 코디네이터(Level 4) 및 총괄 관리자만 발신할 수 있습니다.'], 403);
            }
        }

        if ($targetType === 'individual' && !$receiverId) {
            send_json(['success' => false, 'error' => '1:1 쪽지는 수신자(receiver_id)가 필수입니다.'], 400);
        }

        $msgId = 'msg_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6);

        $stmt = $pdo->prepare("INSERT INTO internal_messages 
            (id, sender_id, sender_name, sender_country, sender_role, target_type, target_country, receiver_id, receiver_name, title, content, translations_json, created_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $stmt->execute([
            $msgId,
            $senderId,
            $senderName,
            $senderCountry,
            $senderRole,
            $targetType,
            $targetCountry,
            $receiverId,
            $receiverName,
            $title,
            $content,
            $translationsJson
        ]);

        // 인앱 알림 센터 연동 (1:1인 경우 수신자에게 notifications 추가)
        if ($targetType === 'individual' && $receiverId) {
            try {
                $notiId = 'noti_' . time() . '_' . substr(bin2hex(random_bytes(3)), 0, 5);
                $pdo->prepare("INSERT INTO notifications (id, user_id, sender_id, sender_name, type, title, body, link_url, is_read, created_at)
                               VALUES (?, ?, ?, ?, 'message', ?, ?, '/member/mypage?tab=messages', 0, NOW())")
                    ->execute([
                        $notiId,
                        $receiverId,
                        $senderId,
                        $senderName,
                        "✉️ {$senderName}님으로부터 새로운 쪽지가 도착했습니다.",
                        $title
                    ]);
            } catch (\Exception $e) {}
        }

        send_json([
            'success' => true,
            'message' => '쪽지가 성공적으로 발송되었습니다.',
            'message_id' => $msgId
        ]);
    }

    // 2. 읽음 처리
    if ($action === 'mark_read') {
        $msgId = $input['message_id'] ?? null;
        $userId = $input['user_id'] ?? null;
        if (!$msgId || !$userId) {
            send_json(['success' => false, 'error' => 'message_id and user_id required'], 400);
        }

        $pdo->prepare("UPDATE internal_messages SET is_read = 1, read_at = NOW() WHERE id = ? AND receiver_id = ?")
            ->execute([$msgId, $userId]);

        $pdo->prepare("INSERT INTO message_receipts (message_id, user_id, is_read, read_at) 
                       VALUES (?, ?, 1, NOW()) 
                       ON DUPLICATE KEY UPDATE is_read = 1, read_at = COALESCE(read_at, NOW())")
            ->execute([$msgId, $userId]);

        send_json(['success' => true]);
    }

    // 3. 전체 모두 읽음 처리
    if ($action === 'mark_all_read') {
        $userId = $input['user_id'] ?? null;
        $country = $input['country'] ?? 'KR';
        $role = $input['role'] ?? 'regular';
        if (!$userId) {
            send_json(['success' => false, 'error' => 'user_id required'], 400);
        }

        $isCoord = in_array($role, ['country_admin', 'super_admin']) ? 1 : 0;
        // 1:1 메시지 읽음 처리
        $pdo->prepare("UPDATE internal_messages SET is_read = 1, read_at = NOW() WHERE receiver_id = ? AND is_read = 0")
            ->execute([$userId]);

        // 대상 메시지들 영수증 등록
        $sql = "INSERT INTO message_receipts (message_id, user_id, is_read, read_at)
                SELECT m.id, :uid, 1, NOW()
                FROM internal_messages m
                LEFT JOIN message_receipts mr ON mr.message_id = m.id AND mr.user_id = :uid
                WHERE m.sender_id != :uid
                  AND (
                      (m.target_type = 'individual' AND m.receiver_id = :uid)
                      OR (m.target_type = 'group_all')
                      OR (m.target_type = 'group_country' AND m.target_country = :country)
                      OR (m.target_type = 'group_coordinators' AND :is_coord = 1)
                  )
                  AND (mr.id IS NULL OR mr.is_read = 0)
                ON DUPLICATE KEY UPDATE is_read = 1, read_at = NOW()";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([
            ':uid' => $userId,
            ':country' => $country,
            ':is_coord' => $isCoord
        ]);

        send_json(['success' => true]);
    }

    // 4. 쪽지 삭제
    if ($action === 'delete') {
        $msgId = $input['message_id'] ?? null;
        $userId = $input['user_id'] ?? null;
        $boxType = $input['type'] ?? 'inbox'; // 'inbox' or 'outbox'

        if (!$msgId || !$userId) {
            send_json(['success' => false, 'error' => 'message_id and user_id required'], 400);
        }

        if ($boxType === 'outbox') {
            $pdo->prepare("UPDATE internal_messages SET deleted_by_sender = 1 WHERE id = ? AND sender_id = ?")
                ->execute([$msgId, $userId]);
        } else {
            // inbox
            $pdo->prepare("UPDATE internal_messages SET deleted_by_receiver = 1 WHERE id = ? AND receiver_id = ?")
                ->execute([$msgId, $userId]);
            $pdo->prepare("INSERT INTO message_receipts (message_id, user_id, is_read, is_deleted) 
                           VALUES (?, ?, 1, 1) 
                           ON DUPLICATE KEY UPDATE is_deleted = 1")
                ->execute([$msgId, $userId]);
        }

        send_json(['success' => true]);
    }

    send_json(['success' => false, 'error' => 'Invalid action'], 400);
}
