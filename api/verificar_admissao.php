<?php

require_once __DIR__ . '/bootstrap.php';

use App\Models\Admissao;

header('Content-Type: application/json');

$ca = filter_input(INPUT_GET, 'ca', FILTER_SANITIZE_SPECIAL_CHARS);

if (!$ca) {
    echo json_encode(['success' => false, 'error' => 'Código não fornecido']);
    exit;
}

try {
    $admissaoModel = new Admissao();
    $dados = $admissaoModel->getByCodigoAcesso($ca);

    if ($dados) {
        echo json_encode(['success' => true, 'nome' => $dados['candidato_nome']]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Código inválido']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}