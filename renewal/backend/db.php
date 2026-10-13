<?php
// ============================================================================
// AAMEN (Asian Anabaptist Mennonite Education Network) Database Connection
// Environment: MariaDB 10.X / PHP 8.4
// ============================================================================

$db_host = 'localhost';
$db_charset = 'utf8mb4';

$configs = [
    ['user' => 'aamen2', 'name' => 'aamen2', 'pass' => 'seungho0409#'],
    ['user' => 'aamen2', 'name' => 'aamen2', 'pass' => '#seungho0409'],
    ['user' => 'aamen1', 'name' => 'aamen1', 'pass' => '#seungho0409'],
    ['user' => 'aamen1', 'name' => 'aamen1', 'pass' => 'seungho0409#'],
];

$pdo = null;
$last_error = null;

$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4",
];

foreach ($configs as $cfg) {
    try {
        $dsn = "mysql:host={$db_host};dbname={$cfg['name']};charset={$db_charset}";
        $pdo = new PDO($dsn, $cfg['user'], $cfg['pass'], $options);
        $pdo->exec("SET NAMES utf8mb4");
        break;
    } catch (PDOException $e) {
        $last_error = $e->getMessage();
    }
}

if (!$pdo) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode([
        'error' => 'Database connection failed',
        'message' => $last_error
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

function send_json($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    exit;
}
