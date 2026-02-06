<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Content-Type: application/json");

// Autoloader para carregar classes da mesma pasta (estrutura plana)
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

try {
    $ca = $_POST['ca'] ?? '';
    $numero = $_POST['doc_numero'] ?? '';

    if (empty($ca) || empty($numero)) {
        throw new Exception('Dados incompletos.');
    }

    if (!isset($_FILES['doc_frente']) || $_FILES['doc_frente']['error'] !== UPLOAD_ERR_OK ||
        !isset($_FILES['doc_verso']) || $_FILES['doc_verso']['error'] !== UPLOAD_ERR_OK) {
        throw new Exception('Erro no upload dos arquivos. Certifique-se de enviar frente e verso.');
    }

    // Processar Frente
    $frenteTmp = $_FILES['doc_frente']['tmp_name'];
    $frenteExt = strtolower(pathinfo($_FILES['doc_frente']['name'], PATHINFO_EXTENSION));
    $frenteContent = file_get_contents($frenteTmp);

    // Processar Verso
    $versoTmp = $_FILES['doc_verso']['tmp_name'];
    $versoExt = strtolower(pathinfo($_FILES['doc_verso']['name'], PATHINFO_EXTENSION));
    $versoContent = file_get_contents($versoTmp);

    $admissao = new Admissao();
    $success = $admissao->salvarDocumentacao($ca, $numero, $frenteContent, $frenteExt, $versoContent, $versoExt);

    if ($success) {
        echo json_encode(['success' => true]);
    } else {
        throw new Exception('Erro ao salvar no banco de dados. Verifique o código de acesso.');
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}