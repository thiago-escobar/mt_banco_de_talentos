document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const alertContainer = document.getElementById('alert-container');
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
            // Fallback caso o container não exista
            alert(message);
        }
    };

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerText;

            // Feedback visual de carregamento
            submitBtn.disabled = true;
            submitBtn.innerText = 'Entrando...';

            try {
                const response = await fetch('https://bancodetalentos.matosteixeira.com.br/api/login.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.redirected) {
                    window.location.href = "dashboard";//response.url;
                } else {
                    // Caso o PHP não redirecione (ex: erro inesperado)
                    const errorMessage = await response.text();
                    throw new Error(errorMessage || 'Resposta inválida do servidor');
                }
            } catch (error) {
                console.error('Erro:', error);
                showAlert(error.message, 'danger');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});