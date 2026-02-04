document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-logs');

    function formatarData(dataString) {
        if (!dataString) return '-';
        const data = new Date(dataString);
        return data.toLocaleString('pt-BR');
    }

    async function carregarLogs() {
        try {
            const response = await fetch('api/logs.php');
            
            if (response.status === 401) {
                window.location.href = 'index.html';
                return;
            }

            if (!response.ok) throw new Error('Erro ao carregar logs');
            
            const logs = await response.json();

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
        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="3" class="text-center text-danger">Erro ao carregar logs.</td></tr>';
        }
    }

    carregarLogs();
});