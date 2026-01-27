document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');

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
                    window.location.href = response.url;
                } else {
                    // Caso o PHP não redirecione (ex: erro inesperado)
                    throw new Error('Resposta inválida do servidor');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Ocorreu um erro ao tentar conectar. Por favor, tente novamente.');
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }
});