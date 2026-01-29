document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const alertContainer = document.getElementById('alert-container');

    const showAlert = (message, type) => {
        if (alertContainer) {
            alertContainer.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');
        } else {
            // Fallback caso o container não exista no HTML
            alert(message);
        }
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            try {
                const response = await fetch('api/register.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showAlert('Usuário cadastrado com sucesso! Redirecionando...', 'success');
                    setTimeout(() => {
                        window.location.href = 'lista-de-usuarios';
                    }, 2000);
                } else {
                    const result = await response.json();
                    showAlert('Erro ao cadastrar: ' + (result.error || 'Erro desconhecido'), 'danger');
                }
            } catch (error) {
                console.error('Erro:', error);
                showAlert('Erro de conexão com o servidor.', 'danger');
            }
        });
    }
});