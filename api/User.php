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
        $stmt = $pdo->query("SELECT u.id, u.nome, u.email, p.nome as perfil FROM Usuarios u LEFT JOIN Perfis p ON u.perfil = p.id WHERE u.habilitado = 1 ORDER BY u.nome ASC");
        return $stmt->fetchAll(\PDO::FETCH_ASSOC);
    }

    public function resetPassword(int $id, string $newPasswordHash): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Usuarios SET senha = ? WHERE id = ?");
        return $stmt->execute([$newPasswordHash, $id]);
    }

    public function toggleProfile(int $id): bool
    {
        $pdo = Database::getConnection();
        // Alterna entre 1 (Admin) e 2 (Recrutador)
        $stmt = $pdo->prepare("UPDATE Usuarios SET perfil = CASE WHEN perfil = 1 THEN 2 ELSE 1 END WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function delete(int $id): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Usuarios SET habilitado = 0 WHERE id = ?");
        return $stmt->execute([$id]);
    }
}