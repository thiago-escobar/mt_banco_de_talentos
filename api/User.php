<?php

namespace App\Models;

use App\Config\Database;

class User
{
    public function authenticate(string $email, string $password): ?array
    {
        $pdo = Database::getConnection();
        
        $stmt = $pdo->prepare("SELECT id, nome, email, senha FROM Usuarios WHERE email = :email LIMIT 1");
        $stmt->execute(['email' => $email]);
        $user = $stmt->fetch();

        if ($user && password_verify($password, $user['senha'])) {
            return $user;
        }
        return null;
    }

    public function create(string $name, string $email, string $password, int $cargo): bool
    {
        $pdo = Database::getConnection();

        // Verifica se o e-mail já existe
        $stmt = $pdo->prepare("SELECT Id FROM Usuarios WHERE email = :email");
        $stmt->execute(['email' => $email]);
        if ($stmt->fetch()) {
            throw new \Exception("Este e-mail já está cadastrado.");
        }

        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        $stmt = $pdo->prepare("INSERT INTO Usuarios (nome, email, senha, perfil, habilitado) VALUES (:nome, :email, :senha, :perfil, '1')");
        return $stmt->execute(['nome' => $name, 'email' => $email, 'senha' => $hashedPassword, 'perfil' => $cargo]);
    }

    public function getAll(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT u.id, u.nome, u.email, c.nome as cargo FROM Usuarios u LEFT JOIN Cargos c ON u.perfil = c.id ORDER BY u.nome ASC");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }
}