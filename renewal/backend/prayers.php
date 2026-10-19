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

    // POST로 들어온 수정 처리 (게시자 및 관리자)
    if ($action === 'update') {
        if (!$id) {
            send_json(['error' => 'Prayer ID required'], 400);
        }
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        $is_urgent = !empty($input['is_urgent']) ? 1 : 0;
        $extra_json = isset($input['extra_json']) ? (is_string($input['extra_json']) ? $input['extra_json'] : json_encode($input['extra_json'], JSON_UNESCAPED_UNICODE)) : null;

        $stmt = $pdo->prepare("UPDATE prayer_cards SET title = ?, content = ?, is_urgent = ?, extra_json = COALESCE(?, extra_json) WHERE id = ?");
        $stmt->execute([$title, $content, $is_urgent, $extra_json, $id]);
        send_json(['status' => 'success', 'message' => 'Prayer updated']);
    }

    // POST로 들어온 아멘 카운트 증가 처리
    if ($action === 'amen' || ($id && !isset($input['title']))) {
        $stmt = $pdo->prepare("UPDATE prayer_cards SET amen_count = amen_count + 1 WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $pdo->prepare("SELECT author_id, title, amen_count FROM prayer_cards WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch();
        $amen_count = (int)($row['amen_count'] ?? 0);

        // 기도제목 작성자에게 알림 생성
        $user_id = $input['user_id'] ?? null;
        $user_name = $input['user_name'] ?? '아시아 성도';
        if ($row && !empty($row['author_id']) && $row['author_id'] !== $user_id) {
            try {
                $notiId = 'noti_' . time() . '_' . substr(bin2hex(random_bytes(3)), 0, 5);
                $notiTitle = "🙏 {$user_name}님이 기도제목에 '저도 기도할게요'로 연대했습니다.";
                $notiBody = mb_substr($row['title'], 0, 80, 'UTF-8');
                $notiLink = "/community/prayer";
                $pdo->prepare("INSERT INTO notifications (id, user_id, sender_id, sender_name, type, title, body, link_url, is_read, created_at)
                               VALUES (?, ?, ?, ?, 'amen', ?, ?, ?, 0, NOW())")
                    ->execute([$notiId, $row['author_id'], $user_id, $user_name, $notiTitle, $notiBody, $notiLink]);
            } catch (\Exception $e) {}
        }

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
    $extra_json = isset($input['extra_json']) ? (is_string($input['extra_json']) ? $input['extra_json'] : json_encode($input['extra_json'], JSON_UNESCAPED_UNICODE)) : null;

    $stmt = $pdo->prepare("INSERT INTO prayer_cards (id, author_id, author_name, country_code, title, content, extra_json, amen_count, is_urgent, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, NOW())");
    $stmt->execute([$id, $author_id, $author_name, $country_code, $title, $content, $extra_json, $is_urgent]);

    if ($is_urgent) {
        try {
            $admins = $pdo->query("SELECT id FROM members WHERE role IN ('country_admin', 'super_admin') LIMIT 20")->fetchAll();
            foreach ($admins as $adm) {
                if ($adm['id'] !== $author_id) {
                    $nId = 'noti_' . time() . '_' . substr(bin2hex(random_bytes(3)), 0, 5);
                    $pdo->prepare("INSERT INTO notifications (id, user_id, sender_id, sender_name, type, title, body, link_url, is_read, created_at)
                                   VALUES (?, ?, ?, ?, 'urgent_prayer', ?, ?, '/community/prayer', 0, NOW())")
                        ->execute([
                            $nId,
                            $adm['id'],
                            $author_id,
                            $author_name,
                            "🔥 [긴급] {$country_code} 국가의 긴급 중보기도가 등록되었습니다.",
                            $title
                        ]);
                }
            }
        } catch (\Exception $e) {}
    }

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
