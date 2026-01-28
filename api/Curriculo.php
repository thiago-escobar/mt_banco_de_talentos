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
        $stmt = $pdo->query("SELECT cur.id, cur.nome, car.nome as cargo, cur.anotacao FROM Curriculos AS cur LEFT JOIN Cargos as car ON cur.cargo = car.id ORDER BY nome ASC");
        return $stmt->fetchAll();
    }

    public function getArquivo(int $id): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT arquivo FROM Curriculos WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
    }
}