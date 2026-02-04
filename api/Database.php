<?php

namespace App\Config;

use PDO;
use PDOException;

class Database
{
    private static ?PDO $connection = null;

    public static function getConnection(): PDO
    {
        if (self::$connection === null) {
            // Ajuste as credenciais conforme seu ambiente
            $host = getenv('DB_HOST') ?: 'localhost';
            $db   = getenv('DB_NAME') ?: 'matost34_bnc_tlnt';
            $user = getenv('DB_USER') ?: 'matost34_thiagoescobar';
            $pass = getenv('DB_PASS') ?: 'D3s3nv0lvim3nt0!';
            $charset = 'utf8mb4';

            $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
            $options = [
                PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_EMULATE_PREPARES   => false,
            ];

            try {
                self::$connection = new PDO($dsn, $user, $pass, $options);
            } catch (PDOException $e) {
                throw new \Exception("Não foi possível conectar ao banco de dados. Por favor, tente novamente mais tarde.");
            }
        }
        return self::$connection;
    }
}