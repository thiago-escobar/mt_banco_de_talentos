<?php

require_once __DIR__ . '/bootstrap.php';

use App\Controllers\LoggerController;

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Acesso não autorizado.']);
    exit;
}

$controller = new LoggerController();
$controller->index();