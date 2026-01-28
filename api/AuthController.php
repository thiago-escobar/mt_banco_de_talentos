<?php

namespace App\Controllers;

use App\Models\User;

class AuthController
{
    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $password = $_POST['password'] ?? '';

            $userModel = new User();
            $user = $userModel->authenticate($email, $password);

            if ($user) {
                // Login bem-sucedido
                if (session_status() === PHP_SESSION_NONE) {
                    session_start();
                }
                $_SESSION['user_id'] = $user['id'];
                $_SESSION['user_name'] = $user['nome'];
                
                header('Location: ../dashboard');
                exit;
            } else {
                // Falha no login
                http_response_code(401);
                echo "E-mail ou senha incorretos.";
                exit;
            }
        }
    }

    public function register(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $name = filter_input(INPUT_POST, 'name', FILTER_SANITIZE_SPECIAL_CHARS);
            $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
            $cargo = filter_input(INPUT_POST, 'cargo', FILTER_VALIDATE_INT);
            $password = $_POST['password'] ?? '';

            if (empty($name) || empty($email) || empty($password) || empty($cargo)) {
                http_response_code(400);
                echo "Todos os campos são obrigatórios.";
                exit;
            }

            try {
                $userModel = new User();
                $userModel->create($name, $email, $password, $cargo);
                http_response_code(201);
                echo "Usuário criado com sucesso.";
            } catch (\Exception $e) {
                http_response_code(400);
                echo $e->getMessage();
            }
        }
    }
}