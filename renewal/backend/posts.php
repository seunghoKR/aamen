<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

// 마스킹 헬퍼
function mask_author_name($name, $role) {
    if (in_array($role, ['super_admin', 'country_admin'])) {
        return $name;
    }
    $len = mb_strlen($name, 'UTF-8');
    if ($len <= 2) {
        return mb_substr($name, 0, 1, 'UTF-8') . '* (성도)';
    }
    return mb_substr($name, 0, 1, 'UTF-8') . '** (성도)';
}

// LONGTEXT 컬럼 및 category, image_url, extra_json 컬럼 지원
try {
    $pdo->exec("ALTER TABLE posts MODIFY content LONGTEXT NOT NULL");
} catch (\Exception $e) {}
try {
    $pdo->exec("ALTER TABLE posts ADD COLUMN category VARCHAR(50) DEFAULT NULL");
} catch (\Exception $e) {}
try {
    $pdo->exec("ALTER TABLE posts ADD COLUMN image_url VARCHAR(500) DEFAULT NULL");
} catch (\Exception $e) {}
try {
    $pdo->exec("ALTER TABLE posts ADD COLUMN extra_json LONGTEXT DEFAULT NULL");
} catch (\Exception $e) {}
try {
    $pdo->exec("CREATE INDEX idx_posts_category ON posts (category)");
} catch (\Exception $e) {}

if ($method === 'GET') {
    $id = $_GET['id'] ?? null;
    $role = $_GET['role'] ?? 'regular';

    if ($id) {
        // 단일 조회 (조회수 +1)
        $pdo->prepare("UPDATE posts SET views = views + 1 WHERE id = ?")->execute([$id]);

        $stmt = $pdo->prepare("SELECT * FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        $post = $stmt->fetch();

        if (!$post) {
            send_json(['success' => false, 'error' => 'Post not found'], 404);
        }

        // 댓글 가져오기
        $cStmt = $pdo->prepare("SELECT * FROM comments WHERE post_id = ? ORDER BY created_at ASC");
        $cStmt->execute([$id]);
        $comments = $cStmt->fetchAll();

        // 준회원 마스킹 적용
        if ($role === 'associate') {
            $post['author_name'] = mask_author_name($post['author_name'], $post['author_role']);
            $first_line = explode("\n", trim($post['content']))[0] ?? '';
            $post['content'] = $first_line . "\n\n🔒 [준회원 안내] 본문 전체와 댓글은 정회원 이상 로그인 시 열람하실 수 있습니다.";
            $comments = [];
        }

        $post['is_pinned'] = (bool)$post['is_pinned'];
        $post['comments'] = $comments;
        send_json(['success' => true, 'data' => $post]);
    } else {
        // 목록 조회
        $type = $_GET['type'] ?? $_GET['board_type'] ?? null;
        $search = $_GET['search'] ?? null;
        $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;

        $sql = "SELECT * FROM posts WHERE 1=1";
        $params = [];

        if ($type && $type !== 'all') {
            $sql .= " AND board_type = ?";
            $params[] = $type;
        }

        $country = $_GET['country'] ?? null;
        if ($country && $country !== 'all' && $country !== 'ALL') {
            $sql .= " AND author_country = ?";
            $params[] = $country;
        }

        $category = $_GET['category'] ?? null;
        if ($category && $category !== 'all') {
            $sql .= " AND (category = ? OR content LIKE ?)";
            $params[] = $category;
            $params[] = "%[{$category}]%";
        }

        if ($search) {
            $sql .= " AND (title LIKE ? OR content LIKE ? OR author_name LIKE ?)";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
            $params[] = "%{$search}%";
        }

        $sql .= " ORDER BY is_pinned DESC, created_at DESC LIMIT " . $limit;

        $stmt = $pdo->prepare($sql);
        $stmt->execute($params);
        $posts = $stmt->fetchAll();

        $result = [];
        foreach ($posts as $p) {
            $cCountStmt = $pdo->prepare("SELECT COUNT(*) FROM comments WHERE post_id = ?");
            $cCountStmt->execute([$p['id']]);
            $cCount = (int)$cCountStmt->fetchColumn();

            if ($role === 'associate') {
                $p['author_name'] = mask_author_name($p['author_name'], $p['author_role']);
                $first_line = explode("\n", trim($p['content']))[0] ?? '';
                $p['content'] = $first_line;
            }

            $p['is_pinned'] = (bool)$p['is_pinned'];
            $p['comments'] = array_fill(0, $cCount, ['id' => 'dummy']);
            $result[] = $p;
        }

        send_json(['success' => true, 'data' => $result]);
    }
} elseif ($method === 'POST') {
    // 이미지 및 파일 업로드 요청 처리 (단일/다중)
    if (isset($_FILES['image']) || isset($_FILES['images']) || isset($_FILES['file'])) {
        $rootDir = dirname(__DIR__);
        $uploadDir = $rootDir . '/uploads/posts';
        if (!is_dir($uploadDir)) {
            @mkdir($uploadDir, 0777, true);
        }

        $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'zip'];

        // 1) 다중 파일 업로드 처리 (최우선)
        if (isset($_FILES['images']) && is_array($_FILES['images']['name']) && count($_FILES['images']['name']) > 0) {
            $urls = [];
            $count = count($_FILES['images']['name']);
            for ($i = 0; $i < $count; $i++) {
                $tmp = $_FILES['images']['tmp_name'][$i];
                if (!is_uploaded_file($tmp)) continue;
                $ext = strtolower(pathinfo($_FILES['images']['name'][$i], PATHINFO_EXTENSION));
                if (!in_array($ext, $allowed)) continue;

                $fn = 'post_' . date('Ymd_His') . '_' . $i . '_' . bin2hex(random_bytes(2)) . '.' . $ext;
                if (move_uploaded_file($tmp, $uploadDir . '/' . $fn)) {
                    @chmod($uploadDir . '/' . $fn, 0644);
                    $urls[] = '/uploads/posts/' . $fn;
                }
            }
            if (!empty($urls)) {
                send_json([
                    'success' => true,
                    'image_url' => $urls[0],
                    'image_urls' => $urls,
                    'count' => count($urls),
                    'message' => count($urls) . '개 사진 업로드 완료'
                ]);
            } else {
                send_json(['success' => false, 'error' => '사진 저장에 실패했습니다.'], 400);
            }
        } else {
            // 2) 단일 파일 업로드 처리
            $file = $_FILES['image'] ?? $_FILES['file'] ?? null;
            if ($file && is_uploaded_file($file['tmp_name'])) {
                $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
                if (!in_array($ext, $allowed)) {
                    send_json(['success' => false, 'error' => '지원하지 않는 파일 형식입니다.'], 400);
                }

                $fileName = 'post_' . date('Ymd_His') . '_' . bin2hex(random_bytes(3)) . '.' . $ext;
                $destPath = $uploadDir . '/' . $fileName;

                if (move_uploaded_file($file['tmp_name'], $destPath)) {
                    @chmod($destPath, 0644);
                    $imageUrl = '/uploads/posts/' . $fileName;
                    send_json([
                        'success' => true,
                        'image_url' => $imageUrl,
                        'image_urls' => [$imageUrl],
                        'count' => 1,
                        'message' => '이미지 업로드 성공'
                    ]);
                } else {
                    send_json(['success' => false, 'error' => '파일 저장에 실패했습니다.'], 500);
                }
            }
        }
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $action = $input['action'] ?? $_POST['action'] ?? $_GET['action'] ?? null;
    $id = $_GET['id'] ?? $input['id'] ?? $_POST['id'] ?? null;

    // POST로 들어온 좋아요 액션 처리
    if ($action === 'like' && $id) {
        $stmt = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $pdo->prepare("SELECT likes FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        $likes = (int)$stmt->fetchColumn();

        send_json(['success' => true, 'data' => ['likes' => $likes]]);
    }

    // POST/GET으로 들어온 삭제 액션 처리
    if (($action === 'delete' || isset($_POST['delete'])) && $id) {
        $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        // 관련 댓글도 함께 삭제
        $stmt2 = $pdo->prepare("DELETE FROM comments WHERE post_id = ?");
        $stmt2->execute([$id]);
        send_json(['success' => true, 'message' => 'Post deleted successfully']);
    }

    // POST로 들어온 수정 액션 처리 (update)
    if (($action === 'update' || $action === 'edit') && $id) {
        $title = trim($input['title'] ?? '');
        $content = trim($input['content'] ?? '');
        if (empty($title) || empty($content)) {
            send_json(['success' => false, 'error' => 'Title and content are required'], 400);
        }

        $category = $input['category'] ?? null;
        $image_url = $input['image_url'] ?? $input['imageUrl'] ?? null;
        $extra_json = isset($input['extra_json']) ? (is_array($input['extra_json']) ? json_encode($input['extra_json'], JSON_UNESCAPED_UNICODE) : $input['extra_json']) : (isset($input['extra']) ? json_encode($input['extra'], JSON_UNESCAPED_UNICODE) : null);

        $stmt = $pdo->prepare("UPDATE posts SET title = ?, content = ?, category = ?, image_url = ?, extra_json = ?, updated_at = NOW() WHERE id = ?");
        $stmt->execute([$title, $content, $category, $image_url, $extra_json, $id]);

        send_json(['success' => true, 'data' => ['id' => $id], 'message' => 'Post updated successfully']);
    }

    // 신규 글 등록
    if (empty($input['title']) || empty($input['content'])) {
        send_json(['success' => false, 'error' => 'Title and content are required'], 400);
    }

    $id = $input['id'] ?? ('p_' . time() . '_' . substr(bin2hex(random_bytes(4)), 0, 6));
    $board_type = $input['board_type'] ?? 'board';
    $title = trim($input['title']);
    $content = trim($input['content']);
    $author_id = $input['author_id'] ?? null;
    $author_name = $input['author_name'] ?? '성도';
    $author_country = $input['author_country'] ?? 'KR';
    $author_role = $input['author_role'] ?? 'regular';
    $category = $input['category'] ?? null;
    $image_url = $input['image_url'] ?? $input['imageUrl'] ?? null;
    $extra_json = isset($input['extra_json']) ? (is_array($input['extra_json']) ? json_encode($input['extra_json'], JSON_UNESCAPED_UNICODE) : $input['extra_json']) : (isset($input['extra']) ? json_encode($input['extra'], JSON_UNESCAPED_UNICODE) : null);

    $stmt = $pdo->prepare("INSERT INTO posts (id, board_type, category, title, content, author_id, author_name, author_country, author_role, views, likes, is_pinned, amen_count, image_url, extra_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 0, ?, 0, ?, ?, NOW())");
    $stmt->execute([$id, $board_type, $category, $title, $content, $author_id, $author_name, $author_country, $author_role, $is_pinned, $image_url, $extra_json]);

    send_json(['success' => true, 'data' => ['id' => $id], 'message' => 'Post created successfully'], 201);
} elseif ($method === 'PATCH') {
    $input = json_decode(file_get_contents('php://input'), true) ?? [];
    $id = $_GET['id'] ?? $input['id'] ?? null;

    if (!$id) {
        send_json(['success' => false, 'error' => 'Post ID required'], 400);
    }

    $action = $input['action'] ?? 'like';
    if ($action === 'like') {
        $stmt = $pdo->prepare("UPDATE posts SET likes = likes + 1 WHERE id = ?");
        $stmt->execute([$id]);

        $stmt = $pdo->prepare("SELECT likes FROM posts WHERE id = ?");
        $stmt->execute([$id]);
        $likes = (int)$stmt->fetchColumn();

        send_json(['success' => true, 'data' => ['likes' => $likes]]);
    } else {
        send_json(['success' => false, 'error' => 'Invalid action'], 400);
    }
} elseif ($method === 'DELETE') {
    $id = $_GET['id'] ?? null;
    if (!$id) {
        send_json(['success' => false, 'error' => 'Post ID required'], 400);
    }

    $stmt = $pdo->prepare("DELETE FROM posts WHERE id = ?");
    $stmt->execute([$id]);
    send_json(['success' => true, 'message' => 'Post deleted']);
}
