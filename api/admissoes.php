<?php

require_once __DIR__ . '/bootstrap.php';

use App\Models\Admissao;

header('Content-Type: application/json');

try {
    $admissaoModel = new Admissao();
    $admissoes = $admissaoModel->getAll();
    echo json_encode($admissoes);
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Erro ao carregar admissões: ' . $e->getMessage()]);
}