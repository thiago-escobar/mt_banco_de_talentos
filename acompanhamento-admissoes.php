<?php require_once 'api/protect.php'; ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Processos de Admissão - Banco de Talentos</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="style/global.css" rel="stylesheet">
    <link href="style/acompanhamento-admissoes.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Processos de Admissão</h2>
            <a href="dashboard" class="btn btn-secondary btn-breadcrumb">Voltar</a>
        </div>
        <div class="mb-3">
            <input type="text" id="filtro-admissao" class="form-control" placeholder="Filtrar por nome, formação, cargo, tags ou anotações. Some filtros usando o +.">
        </div>
        <div id="alert-container" class="mb-4"></div>
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col">Candidato</th>
                                <th scope="col">Início do Processo</th>
                                <th scope="col">Código de Acesso</th>
                                <th scope="col">Senha</th>
                                <th scope="col">Acessado</th>
                                <th scope="col">Finalizado</th>
                                <th scope="col" class="tabela-campo-botoes-acao">Ações</th>
                            </tr>
                        </thead>
                        <tbody id="tabela-admissoes">
                            <tr>
                                <td colspan="7" class="text-center">Carregando dados...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>

    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/acompanhamento-admissoes.js"></script>
</body>
</html>