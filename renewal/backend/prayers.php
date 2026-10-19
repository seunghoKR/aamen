<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $country = $_GET['country'] ?? null;
    $sql = "SELECT * FROM prayer_cards WHERE 1=1";
    $params = [];

    if ($country && $country !== 'ALL') {
        $sql .= " AND country_code = ?";
        $params[] = $country;
    }

    $sql .= " ORDER BY is_urgent DESC, created_at DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $prayers = $stmt->fetchAll();

    foreach ($prayers as &$p) {
        $p['amen_count'] = (int)$p['amen_count'];
        $p['is_urgent'] = (bool)$p['is_urgent'];
    }

    send_json($prayers);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? null;

    // POST로 들어온 삭제 처리
    if ($action === 'delete') {
        if (!$id) {
            send_json(['error' => 'Prayer ID required'], 400);
        }
        $stmt = $pdo->prepare("DELETE FROM prayer_cards WHERE id = ?");
        $stmt->execute([$id]);
        send_json(['status' => 'success', 'message' => 'Prayer deleted']);
    }

    // POST로 들어온 아멘 카운트 증가 처리
    if ($action === 'amen' || ($id && !isset($input['title']))) {
        $stmt = $pdo->prepare("UPDATE prayer_cards SET amen_count = amen_count + 1 WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $pdo->prepare("SELECT amen_count FROM prayer_cards WHERE id = ?");
        $stmt->execute([$id]);
        $amen_count = (int)$stmt->fetchColumn();

        send_json(['status' => 'success', 'amen_count' => $amen_count]);
    }

    // 신규 기도 카드 등록
    if (empty($input['title']) || empty($input['content'])) {
        send_json(['error' => 'Title and content required'], 400);
    }

    $id = 'pr_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6);
    $title = trim($input['title']);
    $content = trim($input['content']);
    $author_id = $input['author_id'] ?? null;
    $author_name = $input['author_name'] ?? '성도';
    $country_code = $input['country_code'] ?? 'KR';
    $is_urgent = !empty($input['is_urgent']) ? 1 : 0;

    $stmt = $pdo->prepare("INSERT INTO prayer_cards (id, author_id, author_name, country_code, title, content, amen_count, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?, 0, ?, NOW())");
    $stmt->execute([$id, $author_id, $author_name, $country_code, $title, $content, $is_urgent]);

    send_json(['status' => 'success', 'id' => $id, 'message' => 'Prayer card created'], 201);
} elseif ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $_GET['id'] ?? $input['id'] ?? null;

    if (!$id) {
        send_json(['error' => 'Prayer ID required'], 400);
    }

    $stmt = $pdo->prepare("UPDATE prayer_cards SET amen_count = amen_count + 1 WHERE id = ?");
    $stmt->execute([$id]);

    $stmt = $pdo->prepare("SELECT amen_count FROM prayer_cards WHERE id = ?");
    $stmt->execute([$id]);
    $amen_count = (int)$stmt->fetchColumn();

    send_json(['status' => 'success', 'amen_count' => $amen_count]);
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        send_json(['error' => 'Prayer ID required'], 400);
    }
    $stmt = $pdo->prepare("DELETE FROM prayer_cards WHERE id = ?");
    $stmt->execute([$id]);
    send_json(['status' => 'success', 'message' => 'Prayer deleted']);
}
