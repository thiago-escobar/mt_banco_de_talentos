document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-logs');
    const filtroInput = document.getElementById('filtro-logs');
    let allLogs = [];
    let filteredLogs = [];
    let currentPage = 1;
    const itemsPerPage = 10;

    function formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR');
    }

    function renderizarTabela(logs) {
        tbody.innerHTML = '';
        if (!Array.isArray(logs) || logs.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3" class="text-center">Nenhum registro encontrado.</td></tr>';
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${formatarData(log.datalog)}</td>
                <td>${log.usuario_nome || 'Sistema/Desconhecido'}</td>
                <td>${log.mensagem}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderizarPaginacao() {
        const container = document.getElementById('paginacao-container');
        if (!container) return;

        container.innerHTML = '';
        const totalPages = Math.ceil(filteredLogs.length / itemsPerPage);

        if (totalPages <= 1) return;

        let html = '<ul class="pagination">';
        
        html += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>`;

        for (let i = 1; i <= totalPages; i++) {
            html += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        html += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Próximo</a>
        </li>`;

        html += '</ul>';
        container.innerHTML = html;

        container.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (page > 0 && page <= totalPages) {
                    currentPage = page;
                    atualizarView();
                }
            });
        });
    }

    function atualizarView() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const logsDaPagina = filteredLogs.slice(start, end);
        
        renderizarTabela(logsDaPagina);
        renderizarPaginacao();
    }

    async function carregarLogs() {
        try {
            const response = await fetch('api/logs.php');
            
            if (response.status === 401) {
                window.location.href = '/';
                return;
            }

            if (!response.ok) throw new Error('Erro ao carregar logs');
            
            allLogs = await response.json();
            filteredLogs = allLogs;
            currentPage = 1;
            atualizarView();
        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Erro ao carregar logs.</td></tr>';
        }
    }

    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termos = e.target.value.toLowerCase().split('+').map(t => t.trim()).filter(t => t);
            filteredLogs = allLogs.filter(log => 
                termos.every(termo => 
                    (log.usuario_nome && log.usuario_nome.toLowerCase().includes(termo)) || 
                    (log.mensagem && log.mensagem.toLowerCase().includes(termo))
                )
            );
            currentPage = 1;
            atualizarView();
        });
    }

    carregarLogs();
});