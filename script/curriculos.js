document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('table tbody');
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
            // Fallback in case the container is missing
            console.error(message);
        }
    };

    async function carregarCurriculos() {
        try {
            // Feedback visual de carregamento
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando dados...</td></tr>';

            // Chamada para a API (assumindo o endpoint api/curriculos.php)
            const response = await fetch('api/curriculos.php');

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            const listaCurriculos = await response.json();

            // Limpa o conteúdo atual (loading ou exemplo estático)
            tbody.innerHTML = '';

            if (!Array.isArray(listaCurriculos) || listaCurriculos.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum currículo encontrado.</td></tr>';
                return;
            }

            // Itera sobre os dados e cria as linhas da tabela
            listaCurriculos.forEach(curriculo => {
                const tr = document.createElement('tr');

                // Verifica se existe link de arquivo
                const linkArquivo = `<a href="api/download.php?id=${curriculo.id}" target="_blank" class="btn btn-sm btn-outline-primary">Baixar Arquivo</a>`;
                tr.innerHTML = `
                    <td>${curriculo.nome || '-'}</td>
                    <td>${curriculo.cargo || '-'}</td>
                    <td>${linkArquivo}</td>
                    <td>${curriculo.anotacao || ''}</td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error('Erro:', error);
            showAlert('Não foi possível carregar os currículos. Verifique sua conexão ou tente novamente mais tarde.', 'danger');
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Falha ao carregar dados.</td></tr>';
        }
    }

    carregarCurriculos();
});