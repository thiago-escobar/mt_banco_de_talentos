<?php

require_once __DIR__ . '/bootstrap.php';

use App\Models\Admissao;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $ca = filter_input(INPUT_POST, 'ca', FILTER_SANITIZE_SPECIAL_CHARS);
    $senha = filter_input(INPUT_POST, 'senha', FILTER_SANITIZE_SPECIAL_CHARS);

    if (!$ca || !$senha) {
        echo json_encode(['success' => false, 'error' => 'Dados incompletos']);
        exit;
    }

    try {
        $admissaoModel = new Admissao();
        if ($admissaoModel->validarSenha($ca, $senha)) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}