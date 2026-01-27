<?php

namespace App\Models;

use App\Config\Database;

class User
{
    public function authenticate(string $email, string $password): ?array
    {
        $pdo = Database::getConnection();
        
        $stmt = $pdo->prepare("SELECT Id, name, Email, Senha FROM users WHERE Email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return null;
    }
}