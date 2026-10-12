<?php
// ============================================================================
// AAMEN Telegram Notification Service
// Bot: @aamen13_bot (AAMEN)
// ============================================================================

define('TELEGRAM_BOT_TOKEN', '8748536633:AAHZLX0sd-05jtTezYsIYFpY-hTYnPRS1qQ');
define('TELEGRAM_BOT_USERNAME', 'aamen13_bot');

/**
 * 텔레그램 메시지 발송 함수
 * @param string|int $chat_id
 * @param string $text
 * @param string $parse_mode
 * @return array
 */
function send_telegram_message($chat_id, $text, $parse_mode = 'Markdown') {
    if (empty($chat_id) || empty($text)) {
        return ['ok' => false, 'error' => 'Missing chat_id or text'];
    }

    $url = "https://api.telegram.org/bot" . TELEGRAM_BOT_TOKEN . "/sendMessage";
    $payload = [
        'chat_id' => $chat_id,
        'text' => $text,
        'parse_mode' => $parse_mode,
        'disable_web_page_preview' => false
    ];

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($payload));
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

    $response = curl_exec($ch);
    $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $curl_error = curl_error($ch);
    curl_close($ch);

    if ($curl_error) {
        return ['ok' => false, 'error' => $curl_error];
    }

    $result = json_decode($response, true);
    return $result ?: ['ok' => false, 'http_code' => $http_code, 'raw' => $response];
}
