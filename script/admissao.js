document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ca = urlParams.get('ca');

    if (!ca) {
        // Se não houver o parâmetro 'ca', redireciona para acesso restrito
        window.location.href = 'acesso-restrito';
    } else {
        fetch(`api/verificar_admissao.php?ca=${encodeURIComponent(ca)}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    const passwordContainer = document.getElementById('password-container');
                    if (passwordContainer) passwordContainer.classList.remove('d-none');
                } else {
                    window.location.href = 'acesso-restrito';
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                window.location.href = 'acesso-restrito';
            });
    }

    const formSenha = document.getElementById('form-senha');
    if (formSenha) {
        formSenha.addEventListener('submit', (e) => {
            e.preventDefault();
            const senha = document.getElementById('senha').value;
            
            const formData = new FormData();
            formData.append('ca', ca);
            formData.append('senha', senha);

            fetch('api/validar_senha_admissao.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById('password-container').classList.add('d-none');
                    document.getElementById('form-docs-container').classList.remove('d-none');
                } else {
                    window.location.href = 'acesso-restrito';
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                window.location.href = 'acesso-restrito';
            });
        });
    }

    const formDocs = document.getElementById('form-docs');
    if (formDocs) {
        formDocs.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(formDocs);
            formData.append('ca', ca);

            fetch('api/enviar_documentacao.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Documentação enviada com sucesso!');
                    document.getElementById('form-docs-container').classList.add('d-none');
                } else {
                    alert('Erro: ' + (data.error || 'Falha ao enviar documentação.'));
                }
            })
            .catch(error => {
                console.error('Erro:', error);
                alert('Erro ao comunicar com o servidor.');
            });
        });
    }
});