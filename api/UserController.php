<?php

namespace App\Controllers;

use App\Models\User;

class UserController
{
    public function index(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            try {
                $userModel = new User();
                $users = $userModel->getAll();
                echo json_encode($users);
            } catch (\Exception $e) {
                http_response_code(500);
                echo json_encode(['error' => $e->getMessage()]);
            }
        } else {
            http_response_code(405);
            echo json_encode(['error' => 'Método não permitido']);
        }
    }

    public function resetSenha(): void
    {
        $this->handleAction(function($id, $model) {
            // Senha padrão: 123456
            $hash = password_hash('123456', PASSWORD_DEFAULT);
            return $model->resetPassword($id, $hash);
        });
    }

    public function mudarPerfil(): void
    {
        $this->handleAction(function($id, $model) {
            return $model->toggleProfile($id);
        });
    }

    public function deletarUsuario(): void
    {
        $this->handleAction(function($id, $model) {
            return $model->delete($id);
        });
    }

    private function handleAction(callable $action): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $id = filter_input(INPUT_POST, 'id', FILTER_VALIDATE_INT);

            if ($id) {
                try {
                    $userModel = new User();
                    $success = $action($id, $userModel);
                    
                    if ($success) {
                        echo json_encode(['success' => true]);
                    } else {
                        http_response_code(500);
                        echo json_encode(['error' => 'Falha ao realizar operação']);
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
}