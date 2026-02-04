<?php

require_once __DIR__ . '/bootstrap.php';

header('Content-Type: application/json');

if (isset($_SESSION['user_id'])) {
    echo json_encode([
        'authenticated' => true,
        'profile' => $_SESSION['user_profile'] ?? null
    ]);
} else {
    echo json_encode(['authenticated' => false]);
}