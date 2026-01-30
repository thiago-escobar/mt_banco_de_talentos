<?php

namespace App\Models;

use App\Config\Database;
use PDO;

class Curriculo
{
    public function getAll(): array
    {
        $pdo = Database::getConnection();
        
        // Seleciona todos os currículos. 
        // Certifique-se de que a tabela 'Curriculos' existe no seu banco de dados.
        $stmt = $pdo->query("SELECT cur.id, cur.nome, car.nome as cargo, cur.anotacao, GROUP_CONCAT(tag.id SEPARATOR ',') AS tags_ids, GROUP_CONCAT(tag.nome SEPARATOR ',') AS tags, GROUP_CONCAT(tag.cor SEPARATOR ',') AS corestag FROM Curriculos AS cur LEFT JOIN Cargos as car ON cur.cargo = car.id LEFT JOIN CurriculosTags AS cut ON cut.curriculo = cur.id LEFT JOIN Tags AS tag ON cut.tag = tag.id GROUP BY cur.id, cur.nome;");
        return $stmt->fetchAll();
    }

    public function getArquivo(int $id): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT nome, arquivo, extensaoarquivo FROM Curriculos WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }

    public function updateAnotacao(int $id, string $anotacao): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Curriculos SET anotacao = ? WHERE id = ?");
        return $stmt->execute([$anotacao, $id]);
    }

    public function getTodasTags(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM Tags ORDER BY nome");
        return $stmt->fetchAll();
    }

    public function adicionarTag(int $curriculoId, int $tagId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT IGNORE INTO CurriculosTags (curriculo, tag) VALUES (?, ?)");
        return $stmt->execute([$curriculoId, $tagId]);
    }

    public function removerTag(int $curriculoId, int $tagId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM CurriculosTags WHERE curriculo = ? AND tag = ?");
        return $stmt->execute([$curriculoId, $tagId]);
    }

    public function getTodosCargos(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM Cargos ORDER BY nome");
        return $stmt->fetchAll();
    }
}