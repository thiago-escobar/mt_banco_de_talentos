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

$ca = $_GET['ca'] ?? '';

if (empty($ca)) {
    echo json_encode(['success' => false, 'error' => 'Código de acesso não fornecido']);
    exit;
}

try {
    $admissao = new Admissao();
    $dados = $admissao->getDocumentacao($ca);

    if ($dados) {
        // Converter BLOBs para Base64 para envio via JSON
        if($dados['doc_identidade_arquivo_frente']){
            $dados['doc_identidade_arquivo_frente'] = base64_encode($dados['doc_identidade_arquivo_frente']);
        }/*else{
            $dados['doc_identidade_arquivo_frente'] = null
        }*/
        if($dados['doc_identidade_arquivo_costas']){
            $dados['doc_identidade_arquivo_costas'] = base64_encode($dados['doc_identidade_arquivo_costas']);
        }/*else{
            $dados['doc_identidade_arquivo_costas'] = null;
        }*/
        echo json_encode(['success' => true, 'data' => $dados]);
    } else {
        echo json_encode(['success' => false, 'error' => 'Documentação não encontrada']);
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}