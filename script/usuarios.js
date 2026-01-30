document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-usuarios');
    const alertContainer = document.getElementById('alert-container');
    let alertTimeout;
    let userIdToAction = null;
    let actionType = null;

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
            }, 2000);
        }
    };

    async function carregarUsuarios() {
        try {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando dados...</td></tr>';

            const response = await fetch('api/usuarios.php');
            
            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            const usuarios = await response.json();
            tbody.innerHTML = '';

            if (!Array.isArray(usuarios) || usuarios.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum usuário encontrado.</td></tr>';
                return;
            }

            usuarios.forEach(user => {
                const tr = document.createElement('tr');
                
                const btnReset = `<button type="button" class="btn btn-sm btn-outline-secondary ms-1 btn-reset" data-id="${user.id}" title="Resetar Senha"><i class="bi bi-key"></i></button>`;
                const btnPerfil = `<button type="button" class="btn btn-sm btn-outline-secondary ms-1 btn-perfil" data-id="${user.id}" title="Alterar Perfil"><i class="bi bi-person-gear"></i></button>`;
                const btnDelete = `<button type="button" class="btn btn-sm btn-outline-danger ms-1 btn-delete" data-id="${user.id}" title="Excluir Usuário"><i class="bi bi-trash"></i></button>`;

                tr.innerHTML = `
                    <td>${user.nome}</td>
                    <td>${user.email}</td>
                    <td>${user.perfil || 'Sem Perfil'}</td>
                    <td>${btnReset} ${btnPerfil} ${btnDelete}</td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Erro:', error);
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Não foi possível carregar os usuários.</td></tr>';
        }
    }

    // Lógica para os botões de ação
    tbody.addEventListener('click', (e) => {
        const btnReset = e.target.closest('.btn-reset');
        const btnPerfil = e.target.closest('.btn-perfil');
        const btnDelete = e.target.closest('.btn-delete');
        const modalBody = document.getElementById('confirmModalBody');
        const modal = new bootstrap.Modal(document.getElementById('confirmModal'));

        if (btnReset) {
            userIdToAction = btnReset.dataset.id;
            actionType = 'reset';
            modalBody.textContent = 'Tem certeza que deseja resetar a senha deste usuário para "123456"?';
            modal.show();
        } else if (btnPerfil) {
            userIdToAction = btnPerfil.dataset.id;
            actionType = 'perfil';
            modalBody.textContent = 'Tem certeza que deseja alternar o perfil deste usuário?';
            modal.show();
        } else if (btnDelete) {
            userIdToAction = btnDelete.dataset.id;
            actionType = 'delete';
            modalBody.textContent = 'Tem certeza que deseja excluir este usuário?';
            modal.show();
        }
    });

    document.getElementById('btnConfirmarAcao').addEventListener('click', async () => {
        if (!userIdToAction || !actionType) return;

        let endpoint = '';
        if (actionType === 'reset') endpoint = 'api/reset_senha.php';
        if (actionType === 'perfil') endpoint = 'api/mudar_perfil.php';
        if (actionType === 'delete') endpoint = 'api/deletar_usuario.php';

        try {
            const formData = new FormData();
            formData.append('id', userIdToAction);

            const response = await fetch(endpoint, {
                method: 'POST',
                body: formData
            });

            const result = await response.json();

            if (response.ok && result.success) {
                showAlert('Ação realizada com sucesso!', 'success');
                carregarUsuarios(); // Recarrega a lista
            } else {
                showAlert('Erro: ' + (result.error || 'Falha na operação'), 'danger');
            }
        } catch (error) {
            console.error('Erro:', error);
            showAlert('Erro de conexão com o servidor.', 'danger');
        }
        
        const modalEl = document.getElementById('confirmModal');
        const modal = bootstrap.Modal.getInstance(modalEl);
        modal.hide();
    });

    carregarUsuarios();
});