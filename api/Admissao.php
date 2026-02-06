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
                    a.data_inicio,
                    a.senha,
                    a.codigo_acesso,
                    a.acessado,
                    a.doc_identidade_valor,
                    a.doc_identidade_valido,
                    (CASE WHEN a.doc_identidade_arquivo_frente IS NOT NULL THEN 1 ELSE NULL END) as doc_identidade_arquivo_frente,
                    (CASE WHEN a.doc_identidade_arquivo_costas IS NOT NULL THEN 1 ELSE NULL END) as doc_identidade_arquivo_costas,
                    c.nome as candidato_nome,
                    c.email as candidato_email,
                    c.telefone as candidato_telefone
                FROM Admissoes AS a
                LEFT JOIN Curriculos AS c ON a.candidato = c.id
                ORDER BY a.id DESC";
        $stmt = $pdo->prepare($sql);
        $stmt->execute();
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
        $result = $stmt->fetch();

        if ($result) {
            $pdo->prepare("UPDATE Admissoes SET acessado = 1 WHERE id = ?")->execute([$result['id']]);
            return true;
        }
        return false;
    }

    public function salvarDocumentacao(string $codigo, string $numero, string $frenteContent, string $frenteExt, string $versoContent, string $versoExt): bool
    {
        $pdo = Database::getConnection();
        $sql = "UPDATE Admissoes SET 
                    doc_identidade_valor = ?, 
                    doc_identidade_arquivo_frente = ?, 
                    doc_identidade_extensao_frente = ?, 
                    doc_identidade_arquivo_costas = ?, 
                    doc_identidade_extensao_costas = ?, 
                    doc_identidade_valido = 0 
                WHERE codigo_acesso = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$numero, $frenteContent, $frenteExt, $versoContent, $versoExt, $codigo]);
    }

    public function getDocumentacao(string $codigo): ?array
    {
        $pdo = Database::getConnection();
        $sql = "SELECT 
                    doc_identidade_valor, 
                    doc_identidade_arquivo_frente, 
                    doc_identidade_extensao_frente, 
                    doc_identidade_arquivo_costas, 
                    doc_identidade_extensao_costas, 
                    doc_identidade_valido 
                FROM Admissoes 
                WHERE codigo_acesso = ?";
        $stmt = $pdo->prepare($sql);
        $stmt->execute([$codigo]);
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        return $result ?: null;
    }

    public function validarIdentidade(string $codigo): bool
    {
        $pdo = Database::getConnection();
        $sql = "UPDATE Admissoes SET doc_identidade_valido = 1 WHERE codigo_acesso = ?";
        $stmt = $pdo->prepare($sql);
        return $stmt->execute([$codigo]);
    }
}