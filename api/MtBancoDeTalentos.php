<?php

declare(strict_types=1);

namespace App\Models;

/**
 * Class MtBancoDeTalentos
 * 
 * Represents a candidate entity in the Talent Bank (Banco de Talentos).
 */
class MtBancoDeTalentos
{
    private ?int $Id;
    private string $Nome;
    private string $Email;

    /**
     * @param string $Nome
     * @param string $Email
     * @param int|null $Id
     */
    public function __construct(
        string $Nome,
        string $Email,
        ?int $Id = null
    ) {
        $this->Nome = $Nome;
        $this->Email = $Email;
        $this->Id = $Id;
    }

    public function getId(): ?int
    {
        return $this->Id;
    }

    public function getNome(): string
    {
        return $this->Nome;
    }

    public function getEmail(): string
    {
        return $this->Email;
    }

    /**
     * Validates the basic integrity of the model.
     *
     * @return bool
     */
    public function isValid(): bool
    {
        return !empty($this->Nome) && filter_var($this->Email, FILTER_VALIDATE_EMAIL) !== false;
    }

    public function toArray(): array
    {
        return [
            'Id' => $this->Id, 
            'Nome' => $this->Nome, 
            'Email' => $this->Email,
        ];
    }
}
