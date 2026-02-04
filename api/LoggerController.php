<?php

namespace App\Controllers;

use App\Models\Logger;

class LoggerController
{
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                // Verifica autenticação (opcional, mas recomendado)
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                
                $logs = Logger::getAll();
                echo json_encode($logs);
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => 'Erro ao buscar logs: ' . $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
    }
}