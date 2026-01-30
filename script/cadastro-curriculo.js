document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroCurriculoForm');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = form.querySelector('button[type="submit"]');
    let alertTimeout;

    const showAlert = (message, type) => {
        if (alertContainer) {
            alertContainer.innerHTML = [
                `<div class="alert alert-${type} alert-dismissible" role="alert">`,
                `   <div>${message}</div>`,
                '   <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>',
                '</div>'
            ].join('');

            if (alertTimeout) clearTimeout(alertTimeout);
            alertTimeout = setTimeout(() => {
                alertContainer.innerHTML = '';
            }, 3000);
        } else {
            alert(message); // Fallback
        }
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalBtnText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            const formData = new FormData(form);

            try {
                // Assumindo que o endpoint para criação é api/create_curriculo.php
                const response = await fetch('api/create_curriculo.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showAlert('Currículo cadastrado com sucesso! Redirecionando...', 'success');
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'lista-de-curriculos';
                    }, 2000);
                } else {
                    const result = await response.json();
                    showAlert('Erro ao cadastrar: ' + (result.error || 'Erro desconhecido'), 'danger');
                }
            } catch (error) {
                showAlert('Erro de conexão com o servidor.', 'danger');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});