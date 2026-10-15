<?php
// ============================================================================
// AAMEN Google Calendar iCal Proxy & Parser API
// Converts Google Calendar .ics feed into clean JSON events for AAMEN Calendar
// ============================================================================

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$calId = trim($_GET['cal_id'] ?? 'asiaaamen2025@gmail.com');
if (empty($calId)) {
    $calId = 'asiaaamen2025@gmail.com';
}

$encodedId = urlencode($calId);
$icalUrl = "https://calendar.google.com/calendar/ical/{$encodedId}/public/basic.ics";

function parseIcalDate($str) {
    if (!$str) return null;
    $str = trim($str);
    if (preg_match('/^(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})/', $str, $m)) {
        return "{$m[1]}-{$m[2]}-{$m[3]}";
    }
    if (preg_match('/^(\d{4})(\d{2})(\d{2})/', $str, $m)) {
        return "{$m[1]}-{$m[2]}-{$m[3]}";
    }
    return $str;
}

function parseIcalTime($str) {
    if (!$str) return '하루 종일';
    if (preg_match('/T(\d{2})(\d{2})(\d{2})/', $str, $m)) {
        return "{$m[1]}:{$m[2]}";
    }
    return '하루 종일';
}

$events = [];

try {
    $ctx = stream_context_create([
        'http' => [
            'timeout' => 8,
            'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AAMEN-Calendar/1.5.0'
        ],
        'ssl' => [
            'verify_peer' => false,
            'verify_peer_name' => false,
        ]
    ]);

    $raw = @file_get_contents($icalUrl, false, $ctx);

    if ($raw && strpos($raw, 'BEGIN:VCALENDAR') !== false) {
        // Unfold wrapped lines
        $raw = preg_replace('/\r\n[ \t]/', '', $raw);
        $raw = preg_replace('/\n[ \t]/', '', $raw);

        $eventBlocks = explode('BEGIN:VEVENT', $raw);
        array_shift($eventBlocks); // remove header before first event

        $idx = 1;
        foreach ($eventBlocks as $block) {
            $endPos = strpos($block, 'END:VEVENT');
            if ($endPos !== false) {
                $block = substr($block, 0, $endPos);
            }

            $summary = '';
            $desc = '';
            $location = '';
            $dtstart = '';
            $dtend = '';
            $uid = '';

            $lines = explode("\n", str_replace("\r", "", $block));
            foreach ($lines as $line) {
                $line = trim($line);
                if (strpos($line, 'SUMMARY:') === 0) {
                    $summary = substr($line, 8);
                } elseif (strpos($line, 'DESCRIPTION:') === 0) {
                    $desc = substr($line, 12);
                } elseif (strpos($line, 'LOCATION:') === 0) {
                    $location = substr($line, 9);
                } elseif (strpos($line, 'DTSTART') === 0) {
                    $parts = explode(':', $line, 2);
                    $dtstart = $parts[1] ?? '';
                } elseif (strpos($line, 'DTEND') === 0) {
                    $parts = explode(':', $line, 2);
                    $dtend = $parts[1] ?? '';
                } elseif (strpos($line, 'UID:') === 0) {
                    $uid = substr($line, 4);
                }
            }

            if ($summary) {
                $startDate = parseIcalDate($dtstart) ?: date('Y-m-d');
                $endDate = parseIcalDate($dtend) ?: $startDate;
                $startTime = parseIcalTime($dtstart);
                $endTime = parseIcalTime($dtend);
                $timeStr = ($startTime === '하루 종일') ? '하루 종일' : "{$startTime} - {$endTime}";
                $monthNum = (int)date('n', strtotime($startDate));

                // Unescape ICS characters
                $summary = str_replace(['\\,', '\\;', '\\n', '\\N'], [',', ';', "\n", "\n"], $summary);
                $desc = str_replace(['\\,', '\\;', '\\n', '\\N'], [',', ';', "\n", "\n"], $desc);
                $location = str_replace(['\\,', '\\;', '\\n', '\\N'], [',', ';', "\n", "\n"], $location);

                $events[] = [
                    'id' => $uid ?: ('g_evt_' . $idx),
                    'month' => $monthNum,
                    'startDate' => $startDate,
                    'endDate' => ($endDate !== $startDate) ? $endDate : null,
                    'timeStr' => $timeStr,
                    'titleKo' => $summary,
                    'titleEn' => $summary,
                    'descKo' => $desc,
                    'descEn' => $desc,
                    'locationKo' => $location ?: '온라인 / 장소 미정',
                    'locationEn' => $location ?: 'Online / TBD',
                    'isOnline' => (stripos($location, 'zoom') !== false || stripos($location, 'online') !== false),
                    'organizer' => 'AAMEN & Google Calendar',
                    'source' => 'google_calendar'
                ];
                $idx++;
            }
        }
    }
} catch (Exception $e) {
    // Graceful error handling
}

echo json_encode([
    'status' => 'success',
    'calendar_id' => $calId,
    'total' => count($events),
    'events' => $events
], JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
