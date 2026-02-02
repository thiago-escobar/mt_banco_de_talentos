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

    public function create(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $telefone = filter_input(INPUT_POST, 'telefone', FILTER_SANITIZE_SPECIAL_CHARS);
            $cargo = filter_input(INPUT_POST, 'cargo', FILTER_VALIDATE_INT);
            
            if (empty($nome) || empty($email) || empty($telefone) || empty($cargo)) {
                http_response_code(400);
                echo json_encode(['error' => 'Todos os campos são obrigatórios.']);
                return;
            }

            if (!isset($_FILES['arquivo']) || $_FILES['arquivo']['error'] !== UPLOAD_ERR_OK) {
                http_response_code(400);
                echo json_encode(['error' => 'Erro no upload do arquivo.']);
                return;
            }

            $fileTmpPath = $_FILES['arquivo']['tmp_name'];
            $fileName = $_FILES['arquivo']['name'];
            $fileSize = $_FILES['arquivo']['size'];
            
            $extensao = strtolower(pathinfo($fileName, PATHINFO_EXTENSION));
            $allowedExtensions = ['pdf', 'doc', 'docx'];

            if (!in_array($extensao, $allowedExtensions)) {
                http_response_code(400);
                echo json_encode(['error' => 'Apenas arquivos PDF, DOC e DOCX são permitidos.']);
                return;
            }

            // Limite de tamanho (10MB)
            if ($fileSize > 10 * 1024 * 1024) {
                http_response_code(400);
                echo json_encode(['error' => 'O arquivo excede o tamanho máximo permitido (10MB).']);
                return;
            }

            $arquivoContent = file_get_contents($fileTmpPath);

            try {
                $curriculoModel = new Curriculo();
                $success = $curriculoModel->create($nome, $email, $telefone, $cargo, $arquivoContent, $extensao);

                if ($success) {
                    http_response_code(201);
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erro ao salvar no banco de dados.']);
                }
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

    public function criarTag(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
            $cor = filter_input(INPUT_POST, 'cor', FILTER_SANITIZE_SPECIAL_CHARS);

            if (empty($nome) || empty($cor)) {
                http_response_code(400);
                echo json_encode(['error' => 'Nome e cor são obrigatórios.']);
                return;
            }

            try {
                $model = new Curriculo();
                $success = $model->criarTag($nome, $cor);

                if ($success) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erro ao criar tag.']);
                }
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function atualizarTag(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);
            $nome = filter_input(INPUT_POST, 'nome', FILTER_SANITIZE_SPECIAL_CHARS);
            $cor = filter_input(INPUT_POST, 'cor', FILTER_SANITIZE_SPECIAL_CHARS);

            if (empty($id) || empty($nome) || empty($cor)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID, nome e cor são obrigatórios.']);
                return;
            }

            try {
                $model = new Curriculo();
                $success = $model->atualizarTag($id, $nome, $cor);

                if ($success) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erro ao atualizar tag.']);
                }
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        }
    }

    public function excluirTag(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

            if (empty($id)) {
                http_response_code(400);
                echo json_encode(['error' => 'ID é obrigatório.']);
                return;
            }

            try {
                $model = new Curriculo();
                $success = $model->excluirTag($id);

                if ($success) {
                    echo json_encode(['success' => true]);
                } else {
                    http_response_code(500);
                    echo json_encode(['error' => 'Erro ao excluir tag.']);
                }
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

    public function listarCargos(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $model = new Curriculo();
                echo json_encode($model->getTodosCargos());
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
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