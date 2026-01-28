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
}