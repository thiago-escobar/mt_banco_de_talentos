<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Logger
{
    public static function log(string $mensagem): void
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }

        // Apenas registra se houver um usuário logado
        if (isset($_SESSION['user_id'])) {
            try {
                $pdo = Database::getConnection();
                $stmt = $pdo->prepare("INSERT INTO Logs (usuario, mensagem, datalog) VALUES (?, ?, ?)");
                $stmt->execute([$_SESSION['user_id'], $mensagem, date('Y-m-d H:i:s')]);
            } catch (\Exception $e) {
                // Falha silenciosa no log para não interromper o fluxo principal da aplicação
                error_log("Erro ao salvar log no banco: " . $e->getMessage());
            }
        }
    }

    public static function getAll(): array
    {
        $pdo = Database::getConnection();
        $sql = "SELECT l.id, u.nome as usuario_nome, l.mensagem, l.datalog 
                FROM Logs l 
                LEFT JOIN Usuarios u ON l.usuario = u.id 
                ORDER BY l.datalog DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}