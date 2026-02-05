<?php

namespace App\Models;

use App\Config\Database;
use App\Models\Logger;
use PDO;

class Curriculo
{
    public function getAll(): array
    {
        $pdo = Database::getConnection();
        
        // Seleciona todos os currículos. 
        // Certifique-se de que a tabela 'Curriculos' existe no seu banco de dados.
        $sql = "SELECT 
                    cur.id, 
                    cur.nome, 
                    cur.email, 
                    cur.telefone,  
                    IF(cur.formacao_descricao IS NOT NULL, CONCAT(form.nome, ' - ', cur.formacao_descricao), form.nome) as formacao, 
                    car.nome as cargo, 
                    cur.anotacao, 
                    GROUP_CONCAT(tag.id SEPARATOR ',') AS tags_ids, 
                    GROUP_CONCAT(tag.nome SEPARATOR ',') AS tags, 
                    GROUP_CONCAT(tag.cor SEPARATOR ',') AS corestag 
                FROM Curriculos AS cur 
                LEFT JOIN Cargos as car ON cur.cargo = car.id 
                LEFT JOIN CurriculosTags AS cut ON cut.curriculo = cur.id 
                LEFT JOIN Tags AS tag ON cut.tag = tag.id 
                LEFT JOIN Formacao AS form ON cur.formacao = form.id 
                WHERE cur.em_admissao = 0
                GROUP BY cur.id, cur.nome, cur.formacao_descricao, form.nome, car.nome, cur.anotacao";
        $stmt = $pdo->query($sql);
        return $stmt->fetchAll();
    }

    public function getArquivo(int $id): ?array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("SELECT nome, arquivo, extensaoarquivo FROM Curriculos WHERE id = ?");
        $stmt->execute([$id]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC) ?: null;
        if ($result) {
            Logger::log("Realizou download do currículo ID: $id ({$result['nome']})");
        }
        return $result;
    }

    public function create(string $nome, string $email, string $telefone, int $cargo, int $formacao, ?string $formacaoDescricao, string $arquivoContent, string $extensao): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Curriculos (nome, email, telefone, cargo, formacao, formacao_descricao, arquivo, extensaoarquivo, dataenvio) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())");
        $success = $stmt->execute([$nome, $email, $telefone, $cargo, $formacao, $formacaoDescricao ?: null, $arquivoContent, $extensao]);
        if ($success) {
            Logger::log("Cadastrou novo currículo: $nome");
        }
        return $success;
    }

    public function updateAnotacao(int $id, string $anotacao): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Curriculos SET anotacao = ? WHERE id = ?");
        $success = $stmt->execute([$anotacao, $id]);
        if ($success) {
            Logger::log("Atualizou a anotação '$anotacao' do currículo ID: $id");
        }
        return $success;
    }

    public function getTodasTags(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT t.*, COUNT(ct.curriculo) as total_curriculos FROM Tags t LEFT JOIN CurriculosTags ct ON t.id = ct.tag GROUP BY t.id ORDER BY t.nome");
        return $stmt->fetchAll();
    }

    public function criarTag(string $nome, string $cor): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT INTO Tags (nome, cor) VALUES (?, ?)");
        $success = $stmt->execute([$nome, $cor]);
        if ($success) {
            Logger::log("Criou nova tag: $nome");
        }
        return $success;
    }

    public function atualizarTag(int $id, string $nome, string $cor): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Tags SET nome = ?, cor = ? WHERE id = ?");
        $success = $stmt->execute([$nome, $cor, $id]);
        if ($success) {
            Logger::log("Atualizou tag ID: $id para $nome");
        }
        return $success;
    }

    public function excluirTag(int $id): bool
    {
        $pdo = Database::getConnection();
        // Remove associações na tabela de relacionamento primeiro
        $stmt = $pdo->prepare("DELETE FROM CurriculosTags WHERE tag = ?");
        $stmt->execute([$id]);
        
        $stmt = $pdo->prepare("DELETE FROM Tags WHERE id = ?");
        $success = $stmt->execute([$id]);
        if ($success) {
            Logger::log("Excluiu tag ID: $id");
        }
        return $success;
    }

    public function adicionarTag(int $curriculoId, int $tagId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("INSERT IGNORE INTO CurriculosTags (curriculo, tag) VALUES (?, ?)");
        $success = $stmt->execute([$curriculoId, $tagId]);
        if ($success) {
            Logger::log("Adicionou tag ID $tagId ao currículo ID $curriculoId");
        }
        return $success;
    }

    public function removerTag(int $curriculoId, int $tagId): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("DELETE FROM CurriculosTags WHERE curriculo = ? AND tag = ?");
        $success = $stmt->execute([$curriculoId, $tagId]);
        if ($success) {
            Logger::log("Removeu tag ID $tagId do currículo ID $curriculoId");
        }
        return $success;
    }

    public function getTodosCargos(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM Cargos ORDER BY nome");
        return $stmt->fetchAll();
    }

    public function getTodasFormacoes(): array
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->query("SELECT * FROM Formacao ORDER BY id");
        return $stmt->fetchAll();
    }

    public function iniciarAdmissao(int $id): bool
    {
        $pdo = Database::getConnection();
        $stmt = $pdo->prepare("UPDATE Curriculos SET em_admissao = 1 WHERE id = ?");

        $success = $stmt->execute([$id]);
        if ($success) {
            $senha = str_pad((string)mt_rand(0, 999999), 6, '0', STR_PAD_LEFT);
            $codigo_acesso = bin2hex(random_bytes(10));

            $stmtAdmissao = $pdo->prepare("INSERT INTO Admissoes (candidato, data_inicio, senha, codigo_acesso) VALUES (?, ?, ?, ?)");
            $stmtAdmissao->execute([$id, date('Y-m-d H:i:s'), $senha, $codigo_acesso]);

            Logger::log("Iniciou processo de admissão para o currículo ID: $id");
        }
        return $success;
    }
}
