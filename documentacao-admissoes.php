<?php require_once 'api/protect.php'; ?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentação de Admissão - Banco de Talentos</title>
    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
    <link href="style/global.css" rel="stylesheet">
    <link href="style/documentacao-admissoes.css" rel="stylesheet">
</head>
<body>
    <div class="container mt-5">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Documentação de Admissão</h2>
            <a href="./acompanhamento-admissoes" class="btn btn-secondary btn-breadcrumb">Voltar</a>
        </div>
    </div>
    <div class="container mt-5 moldura-documento">
        <div class="row">
            <div class="col-12 mb-3">
                <h3>Identidade <i class="bi bi-check-circle-fill" id="identidade-validada"></i></h3>
            </div>
        </div>
        <div class="row identidade-cadastrada">
            <div class="col-12 mb-3">
                <p><b>Número do documento:</b> <span id="identidade_valor"></span></p>
            </div>
        </div>
        <div class="identidade-nao-cadastrada">
            <p><b>Ainda não cadastrado pelo candidato.</b></p>
        </div>
        <div class="row identidade-cadastrada">
            <div class="col-6 mb-3">
                <img src="" alt="Identidade Frente" class="img-identidade-frente" id="identidade_frente" />
            </div>
            <div class="col-6 mb-3">
                <img src="" alt="Identidade Costas" class="img-identidade-costas" id="identidade_costas" />
            </div>
        </div>
        <div class="row identidade-cadastrada">
            <div class="col-12 mb-3">
                <button id="btn-validar-identidade" class="btn btn-primary">Validar Identidade</button>
            </div>
        </div>
    </div>
    <!-- Bootstrap Bundle JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="script/documentacao-admissoes.js"></script>
</body>
</html>