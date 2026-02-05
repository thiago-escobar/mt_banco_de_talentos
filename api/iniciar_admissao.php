<?php

require_once __DIR__ . '/bootstrap.php';

use App\Models\Curriculo;

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'ID inválido']);
        exit;
    }

    try {
        $curriculoModel = new Curriculo();
        if ($curriculoModel->iniciarAdmissao($id)) {
            echo json_encode(['success' => true]);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Erro ao atualizar status']);
        }
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
}