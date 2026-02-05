<?php 
require_once 'api/protect.php'; 

if ($_SESSION['user_profile'] != 1) {
    header('Location: acesso-restrito');
    exit;
}
?>
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
    <link href="style/logs.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Logs do Sistema</h2>
            <a href="dashboard" class="btn btn-secondary btn-breadcrumb">Voltar</a>
        </div>
        <div class="mb-3">
            <input type="text" id="filtro-logs" class="form-control" placeholder="Filtrar por usuário ou mensagem. Some filtros usando o +.">
        </div>
        <div id="alert-container" class="mb-4"></div>
        
        <div class="card shadow-sm">
            <div class="card-body">
                <div class="table-responsive">
                    <table class="table table-striped table-hover align-middle">
                        <thead class="table-dark">
                            <tr>
                                <th scope="col" style="width: 20%;">Data/Hora</th>
                                <th scope="col" style="width: 20%;">Usuário</th>
                                <th scope="col">Ação/Mensagem</th>
                            </tr>
                        </thead>
                        <tbody id="tabela-logs">
                            <tr>
                                <td colspan="3" class="text-center">Carregando logs...</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <nav id="paginacao-container" class="d-flex justify-content-center mt-3"></nav>
    </div>
    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/logs.js"></script>
</body>
</html>