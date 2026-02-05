document.addEventListener('DOMContentLoaded', () => {
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

    // Verifica parâmetros na URL para exibir erros vindos do PHP
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('error')) {
        const error = urlParams.get('error');
        if (error === 'login_failed') {
            showAlert('E-mail ou senha incorretos.', 'danger');
        }
    }
});