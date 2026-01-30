document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');
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
            alert(message); // Fallback
        }
    };

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Assumindo que um endpoint de logout existe em api/logout.php
                const response = await fetch('api/logout.php', { method: 'POST' });

                if (response.ok) {
                    window.location.href = '/'; // Redireciona para a página de login
                } else {
                    showAlert('Erro ao tentar sair. Por favor, tente novamente.', 'danger');
                }
            } catch (error) {
                showAlert('Não foi possível conectar ao servidor para sair.', 'danger');
            }
        });
    }
});