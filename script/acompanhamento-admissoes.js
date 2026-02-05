document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-admissoes');
    const filtroInput = document.getElementById('filtro-admissao');
    let todasAdmissoes = [];

    function formatarData(data) {
        if (!data) return '-';
        const [ano, mes, dia] = data.split(' ')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function renderizarTabela(lista) {
        tbody.innerHTML = '';

        if (!Array.isArray(lista) || lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="text-center">Nenhum processo de admissão encontrado.</td></tr>';
            return;
        }

        lista.forEach(item => {
            const tr = document.createElement('tr');
            
            const statusAcessado = item.acessado == 1 
                ? '<span class="badge bg-warning text-dark">Sim</span>'
                : '<span class="badge bg-secondary">Não</span>';
                
            const statusFinalizado = item.finalizado == 1 
                ? '<span class="badge bg-warning text-dark">Sim</span>'
                : '<span class="badge bg-secondary">Não</span>';
            const btnDocumentos = `<button type="button" class="btn btn-sm btn-outline-secondary" data-id="${item.id}" title="Ver Documentacao"><i class="bi bi-file-earmark-check"></i></button>`;
            tr.innerHTML = `
                <td>${item.candidato_nome || 'Candidato não encontrado'}</td>
                <td>${formatarData(item.data_inicio)}</td>
                <td><code>${item.codigo_acesso}</code></td>
                <td>${item.senha}</td>
                <td>${statusAcessado}</td>
                <td>${statusFinalizado}</td>
                <td>${btnDocumentos}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    async function carregarAdmissoes() {
        try {
            const response = await fetch('api/admissoes.php');
            if (!response.ok) throw new Error('Erro ao buscar dados');
            
            todasAdmissoes = await response.json();
            renderizarTabela(todasAdmissoes);
        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="7" class="text-center text-danger">Erro ao carregar dados.</td></tr>';
        }
    }

    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = todasAdmissoes.filter(item => 
                (item.candidato_nome && item.candidato_nome.toLowerCase().includes(termo)) ||
                (item.codigo_acesso && item.codigo_acesso.toLowerCase().includes(termo))
            );
            renderizarTabela(filtrados);
        });
    }

    carregarAdmissoes();
});