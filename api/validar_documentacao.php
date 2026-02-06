<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

spl_autoload_register(function ($class) {
    $parts = explode('\\', $class);
    $className = end($parts);
    $file = __DIR__ . '/' . $className . '.php';
    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Models\Admissao;

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Método não permitido']);
    exit;
}

$ca = $_POST['ca'] ?? '';

if (empty($ca)) {
    echo json_encode(['success' => false, 'error' => 'Código de acesso não fornecido']);
    exit;
}

try {
    $admissao = new Admissao();
    $success = $admissao->validarIdentidade($ca);

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Erro ao atualizar banco de dados']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}