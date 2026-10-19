<?php
require_once __DIR__ . '/db.php';

// VAPID 키 설정 (Web Push 표준)
// 공개키는 클라이언트 PushManager.subscribe()에 전달됩니다.
const VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';
const VAPID_PRIVATE_KEY = 'UU9TVE9ORV9WQVBJRF9QUklWQVRFX0tFWV9BQU1FTg';
const VAPID_SUBJECT = 'mailto:admin@aamen.net';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $action = $_GET['action'] ?? 'vapid_key';
    $userId = $_GET['user_id'] ?? null;

    if ($action === 'vapid_key') {
        send_json([
            'success' => true,
            'public_key' => VAPID_PUBLIC_KEY
        ]);
    }

    if ($action === 'status') {
        if (!$userId) {
            send_json(['success' => false, 'error' => 'user_id required'], 400);
        }
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM push_subscriptions WHERE user_id = ?");
        $stmt->execute([$userId]);
        $count = (int)$stmt->fetchColumn();
        send_json([
            'success' => true,
            'is_subscribed' => $count > 0,
            'subscription_count' => $count
        ]);
    }
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        send_json(['success' => false, 'error' => 'Invalid JSON input'], 400);
    }

    $action = $input['action'] ?? 'subscribe';
    $userId = trim($input['user_id'] ?? '');

    if (!$userId) {
        send_json(['success' => false, 'error' => 'user_id required'], 400);
    }

    // 1. 구독 토큰 등록
    if ($action === 'subscribe') {
        $endpoint = trim($input['endpoint'] ?? '');
        $p256dh = trim($input['p256dh'] ?? ($input['keys']['p256dh'] ?? ''));
        $auth = trim($input['auth'] ?? ($input['keys']['auth'] ?? ''));
        $userAgent = $_SERVER['HTTP_USER_AGENT'] ?? ($input['user_agent'] ?? '');

        if (!$endpoint || !$p256dh || !$auth) {
            send_json(['success' => false, 'error' => 'endpoint, p256dh, and auth are required'], 400);
        }

        // 중복 방지 (기존 endpoint 삭제 후 재등록 또는 갱신)
        $stmt = $pdo->prepare("DELETE FROM push_subscriptions WHERE endpoint = ?");
        $stmt->execute([$endpoint]);

        $stmt = $pdo->prepare("INSERT INTO push_subscriptions (user_id, endpoint, p256dh, auth, user_agent, created_at, updated_at) 
                               VALUES (?, ?, ?, ?, ?, NOW(), NOW())");
        $stmt->execute([$userId, $endpoint, $p256dh, $auth, $userAgent]);

        // 성공 안내 인앱 알림 자동 생성
        $notiId = 'noti_push_' . time();
        $pdo->prepare("INSERT INTO notifications (id, user_id, sender_id, sender_name, type, title, body, link_url, is_read, created_at)
                       VALUES (?, ?, 'system', 'AAMEN', 'system', '📱 브라우저 푸시 알림이 활성화되었습니다.', '이제 기도, 댓글, 새 쪽지 소식을 기기 알림으로 받아보실 수 있습니다.', '/member/mypage?tab=notifications', 0, NOW())")
            ->execute([$notiId, $userId]);

        send_json([
            'success' => true,
            'message' => 'Web push subscription registered successfully.'
        ]);
    }

    // 2. 구독 해제
    if ($action === 'unsubscribe') {
        $endpoint = trim($input['endpoint'] ?? '');
        if ($endpoint) {
            $stmt = $pdo->prepare("DELETE FROM push_subscriptions WHERE user_id = ? AND endpoint = ?");
            $stmt->execute([$userId, $endpoint]);
        } else {
            $stmt = $pdo->prepare("DELETE FROM push_subscriptions WHERE user_id = ?");
            $stmt->execute([$userId]);
        }

        send_json([
            'success' => true,
            'message' => 'Web push subscription removed successfully.'
        ]);
    }

    // 3. 테스트 알림 발송 (인앱 알림 생성)
    if ($action === 'send_test') {
        $notiId = 'noti_test_' . time() . '_' . substr(bin2hex(random_bytes(2)), 0, 4);
        $pdo->prepare("INSERT INTO notifications (id, user_id, sender_id, sender_name, type, title, body, link_url, is_read, created_at)
                       VALUES (?, ?, 'system', 'AAMEN', 'system', '🔔 AAMEN 푸시 테스트 알림', '축하합니다! AAMEN 웹앱 알림 시스템이 정상적으로 연결되었습니다.', '/member/mypage?tab=notifications', 0, NOW())")
            ->execute([$notiId, $userId]);

        send_json([
            'success' => true,
            'message' => '테스트 알림이 성공적으로 발송되었습니다.'
        ]);
    }

    send_json(['success' => false, 'error' => 'Invalid action'], 400);
}
