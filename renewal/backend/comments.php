<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    $post_id = $_GET['post_id'] ?? null;
    if (!$post_id) {
        send_json(['success' => false, 'error' => 'post_id required'], 400);
    }

    $stmt = $pdo->prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC");
    $stmt->execute([$post_id]);
    send_json(['success' => true, 'data' => $stmt->fetchAll()]);
} elseif ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $post_id = $_GET['post_id'] ?? $input['post_id'] ?? null;
    $content = trim($input['content'] ?? '');

    if (!$post_id || empty($content)) {
        send_json(['success' => false, 'error' => 'post_id and content are required'], 400);
    }

    $id = 'c_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6);
    $author_id = $input['author_id'] ?? null;
    $author_name = $input['author_name'] ?? '성도';
    $author_country = $input['author_country'] ?? 'KR';
    $author_role = $input['author_role'] ?? 'regular';

    $stmt = $pdo->prepare("INSERT INTO comments (id, post_id, author_id, author_name, author_country, author_role, content, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())");
    $stmt->execute([$id, $post_id, $author_id, $author_name, $author_country, $author_role, $content]);

    send_json([
        'success' => true,
        'data' => [
            'id' => $id,
            'post_id' => $post_id,
            'author_name' => $author_name,
            'author_country' => $author_country,
            'author_role' => $author_role,
            'content' => $content,
            'created_at' => date('Y-m-d H:i:s')
        ]
    ], 201);
}
