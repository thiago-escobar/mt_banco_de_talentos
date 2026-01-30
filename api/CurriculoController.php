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

                if ($arquivo && !empty($arquivo['arquivo']) && !empty($arquivo['extensaoarquivo'])) {
                    header("Content-Type: application/".$arquivo['extensaoarquivo']);
                    header("Content-Disposition: attachment; filename=\"curriculo_".$this->nameClear($arquivo['nome']).".".$arquivo['extensaoarquivo']."\"");
                    header("Content-Length: " . strlen($arquivo['arquivo']));
                    echo $arquivo['arquivo'];
                    exit;
                }
            }
            http_response_code(404);
            echo "Arquivo não encontrado.";
        }
    }

    public function updateAnotacao(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $anotacao = $_POST['anotacao'] ?? '';

            if ($id) {
                try {
                    $curriculoModel = new Curriculo();
                    $success = $curriculoModel->updateAnotacao($id, $anotacao);
                    
                    if ($success) {
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Falha ao atualizar anotação']);
                    }
                } catch (\Exception $e) {
                    http_response_code(500);
                    echo json_encode(['error' => $e->getMessage()]);
                }
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'ID inválido']);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
    }

    public function listarTags(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $model = new Curriculo();
                echo json_encode($model->getTodasTags());
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function gerenciarTag(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $curriculoId = filter_input(INPUT_POST, 'curriculo_id', FILTER_VALIDATE_INT);
            $tagId = filter_input(INPUT_POST, 'tag_id', FILTER_VALIDATE_INT);
            $acao = $_POST['acao'] ?? '';

            if ($curriculoId && $tagId && in_array($acao, ['adicionar', 'remover'])) {
                $model = new Curriculo();
                $success = ($acao === 'adicionar') 
                    ? $model->adicionarTag($curriculoId, $tagId) 
                    : $model->removerTag($curriculoId, $tagId);

                echo json_encode(['success' => $success]);
            } else {
                http_response_code(400);
                echo json_encode(['error' => 'Dados inválidos']);
            }
        }
    }

    public function nameClear($nome): string
    {
        $nome = mb_strtolower($nome, 'UTF-8');
        $map = [
            'á' => 'a', 'à' => 'a', 'ã' => 'a', 'â' => 'a', 'ä' => 'a',
            'é' => 'e', 'è' => 'e', 'ê' => 'e', 'ë' => 'e',
            'í' => 'i', 'ì' => 'i', 'î' => 'i', 'ï' => 'i',
            'ó' => 'o', 'ò' => 'o', 'õ' => 'o', 'ô' => 'o', 'ö' => 'o',
            'ú' => 'u', 'ù' => 'u', 'û' => 'u', 'ü' => 'u',
            'ç' => 'c', 'ñ' => 'n'
        ];
        $nome = strtr($nome, $map);
        return str_replace(' ', '_', $nome);
    }
}