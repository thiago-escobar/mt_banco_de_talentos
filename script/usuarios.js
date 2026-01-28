document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-usuarios');

    async function carregarUsuarios() {
        try {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">Carregando dados...</td></tr>';

            const response = await fetch('api/usuarios.php');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            const usuarios = await response.json();
            tbody.innerHTML = '';

            if (!Array.isArray(usuarios) || usuarios.length === 0) {
                tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum usuário encontrado.</td></tr>';
                return;
            }

            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.cargo || 'Sem cargo'}</td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Erro:', error);
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Não foi possível carregar os usuários.</td></tr>';
        }
    }

    carregarUsuarios();
});