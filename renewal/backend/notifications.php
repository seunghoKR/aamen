<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $userId = $_GET['user_id'] ?? null;
    $action = $_GET['action'] ?? 'list';

    if (!$userId) {
        send_json(['success' => false, 'error' => 'user_id required'], 400);
    }

    if ($action === 'unread_count') {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM notifications WHERE user_id = ? AND is_read = 0");
        $stmt->execute([$userId]);
        $count = (int)$stmt->fetchColumn();
        send_json(['success' => true, 'unread_count' => $count]);
    }

    // 목록 조회 (최신 30건)
    $stmt = $pdo->prepare("SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 30");
    $stmt->execute([$userId]);
    $rows = $stmt->fetchAll();
    send_json(['success' => true, 'data' => $rows]);
}

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    if (!$input) {
        send_json(['success' => false, 'error' => 'Invalid JSON input'], 400);
    }

    $action = $input['action'] ?? 'mark_read';

    if ($action === 'mark_read') {
        $notiId = $input['id'] ?? null;
        $userId = $input['user_id'] ?? null;
        if ($notiId && $userId) {
            $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?")->execute([$notiId, $userId]);
        }
        send_json(['success' => true]);
    }

    if ($action === 'mark_all_read') {
        $userId = $input['user_id'] ?? null;
        if ($userId) {
            $pdo->prepare("UPDATE notifications SET is_read = 1 WHERE user_id = ?")->execute([$userId]);
        }
        send_json(['success' => true]);
    }

    if ($action === 'delete') {
        $notiId = $input['id'] ?? null;
        $userId = $input['user_id'] ?? null;
        if ($notiId && $userId) {
            $pdo->prepare("DELETE FROM notifications WHERE id = ? AND user_id = ?")->execute([$notiId, $userId]);
        }
        send_json(['success' => true]);
    }

    if ($action === 'delete_all') {
        $userId = $input['user_id'] ?? null;
        if ($userId) {
            $pdo->prepare("DELETE FROM notifications WHERE user_id = ?")->execute([$userId]);
        }
        send_json(['success' => true]);
    }

    send_json(['success' => false, 'error' => 'Invalid action'], 400);
}
