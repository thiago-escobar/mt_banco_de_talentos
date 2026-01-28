<?php

namespace App\Controllers;

use App\Models\Curriculo;

class CurriculoController
{
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $curriculoModel = new Curriculo();
                $curriculos = $curriculoModel->getAll();
                
                echo json_encode($curriculos);
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
    }

    public function download(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);

            if ($id) {
                $curriculoModel = new Curriculo();
                $arquivo = $curriculoModel->getArquivo($id);

                if ($arquivo && !empty($arquivo['arquivo'])) {
                    header("Content-Type: application/pdf");
                    header("Content-Disposition: attachment; filename=\"curriculo.pdf\"");
                    header("Content-Length: " . strlen($arquivo['arquivo']));
                    echo $arquivo['arquivo'];
                    exit;
                }
            }
            http_response_code(404);
            echo "Arquivo não encontrado.";
        }
    }
}