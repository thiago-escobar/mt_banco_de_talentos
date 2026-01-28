document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

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
                    alert('Usuário cadastrado com sucesso!');
                    window.location.href = 'usuarios';
                } else {
                    const result = await response.json();
                    alert('Erro ao cadastrar: ' + (result.error || 'Erro desconhecido'));
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro de conexão com o servidor.');
            }
        });
    }
});