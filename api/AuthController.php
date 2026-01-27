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
                $_SESSION['user_name'] = $user['name'];
                
                header('Location: dashboard.php');
                exit;
            } else {
                // Falha no login
                header('Location: index.html?error=invalid_credentials');
                exit;
            }
        }
    }
}