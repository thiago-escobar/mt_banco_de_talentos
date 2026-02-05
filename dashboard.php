<?php require_once 'api/protect.php'; ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard - Banco de Talentos</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="style/global.css" rel="stylesheet">
    <link href="style/dashboard.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Banco de Talentos</h2>
            <a href="api/logout.php" class="btn btn-secondary btn-breadcrumb">Sair</a>
        </div>
        <div id="alert-container" class="mb-4"></div>
        <div class="row g-3">
            <div class="col-md-4">
                <a href="lista-de-curriculos" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi-search me-2"></i>Pesquisar Currículo</a>
            </div>
            <div class="col-md-4">
                <a href="cadastro-de-curriculos" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi-person-fill-add me-2"></i>Cadastrar Currículo</a>
            </div>
            <div class="col-md-4">
                <a href="cadastro-de-tags" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi bi-tags-fill me-2"></i>Gerenciar Tags</a>
            </div>
            <div class="col-md-4">
                <a href="acompanhamento-admissoes" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi-file-earmark-arrow-up-fill me-2"></i>Gerenciar Admissões</a>
            </div>
            <div class="col-md-4 d-none" id="admin-users">
                <a href="lista-de-usuarios" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi-people-fill me-2"></i>Gerenciar Usuários</a>
            </div>
            <div class="col-md-4 d-none" id="admin-logs">
                <a href="logs" class="btn btn-primary w-100 py-3 text-decoration-none"><i class="bi bi-file-text-fill me-2"></i>Logs do Sistema</a>
            </div>
        </div>
    </div>
    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/dashboard.js"></script>
</body>
</html>