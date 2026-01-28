<?php

// Habilitar exibição de erros para facilitar o debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Autoloader ajustado para carregar classes da mesma pasta (estrutura plana)
spl_autoload_register(function ($class) {
    // Remove o namespace e pega apenas o nome da classe (ex: User de App\Models\User)
    $parts = explode('\\', $class);
    $className = end($parts);

    // Procura o arquivo na pasta atual
    $file = __DIR__ . '/' . $className . '.php';

    if (file_exists($file)) {
        require_once $file;
    }
});

use App\Controllers\CurriculoController;

try {
    $controller = new CurriculoController();
    $controller->index();
} catch (\Throwable $e) {
    http_response_code(500);
    echo "Erro no servidor: " . $e->getMessage();
}