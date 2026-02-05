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
                    alert('Bem-vindo! Acesso autorizado com sucesso.');
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
});