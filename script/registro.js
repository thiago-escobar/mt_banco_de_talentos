document.addEventListener('DOMContentLoaded', () => {
        const form = document.getElementById('registerForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                const formData = new FormData(form);
                const submitBtn = form.querySelector('button[type="submit"]');
                const originalBtnText = submitBtn.innerText;
                // Feedback visual
                submitBtn.disabled = true;
                submitBtn.innerText = 'Cadastrando...';
                try {
                    const response = await fetch('api/register.php', {
                        method: 'POST',
                        body: formData
                    });
                    if (response.ok) {
                        alert('Usuário criado com sucesso! Você será redirecionado para o login.');
                        window.location.href = 'index.html';
                    } else {
                        const errorMessage = await response.text();
                        throw new Error(errorMessage || 'Erro ao criar usuário');
                   }
                } catch (error) {
                    console.error('Erro:', error);
                    alert(error.message);
                } finally {
                    submitBtn.disabled = false;
                    submitBtn.innerText = originalBtnText;
                }
            });
        }
    }
);