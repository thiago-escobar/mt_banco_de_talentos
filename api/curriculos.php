<?php

require_once __DIR__ . '/bootstrap.php';

use App\Controllers\CurriculoController;

try {
    $controller = new CurriculoController();
    $controller->index();
} catch (\Throwable $e) {
    http_response_code(500);
    echo "Erro no servidor: " . $e->getMessage();
}