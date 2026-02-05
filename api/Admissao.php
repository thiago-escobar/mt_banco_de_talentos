<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Admissao
{
    public function getAll(): array
    {
        $pdo = Database::getConnection();
        // Busca os dados da admissão e junta com a tabela de currículos para pegar o nome do candidato
        $sql = "SELECT 
                    a.id, 
                    a.codigo_acesso, 
                    a.acessado, 
                    a.finalizado,
                    a.senha,
                    a.data_inicio,
                    c.nome as candidato_nome,
                    c.email as candidato_email,
                    c.telefone as candidato_telefone
                FROM Admissoes a
                LEFT JOIN Curriculos c ON a.candidato = c.id
                ORDER BY a.id DESC";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getByCodigoAcesso(string $codigo): ?array
    {
        $pdo = Database::getConnection();
        $sql = "SELECT 
                    a.id, 
                    c.nome as candidato_nome
                FROM Admissoes a
                JOIN Curriculos c ON a.candidato = c.id
                WHERE a.codigo_acesso = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$codigo]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function validarSenha(string $codigo, string $senha): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT id FROM Admissoes WHERE codigo_acesso = ? AND senha = ?");
        $stmt->execute([$codigo, $senha]);
        return (bool)$stmt->fetch();
    }
}