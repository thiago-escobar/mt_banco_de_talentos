<?php

require_once __DIR__ . '/bootstrap.php';

use App\Controllers\UserController;

// Verificar se o usuário está autenticado
if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(['error' => 'Acesso não autorizado.']);
    exit;
}

try {
    $controller = new UserController();
    $controller->deletarUsuario();
} catch (\Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => "Erro no servidor: " . $e->getMessage()]);
}