document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.getElementById('tabela-admissoes');
    const filtroInput = document.getElementById('filtro-admissao');
    const totalDocumentos = 1;
    let todasAdmissoes = [];

    function formatarData(data) {
        if (!data) return '-';
        const [ano, mes, dia] = data.split(' ')[0].split('-');
        return `${dia}/${mes}/${ano}`;
    }

    function renderizarTabela(lista) {
        tbody.innerHTML = '';

        if (!Array.isArray(lista) || lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Nenhum processo de admissão encontrado.</td></tr>';
            return;
        }

        lista.forEach(item => {
            const tr = document.createElement('tr');
            const linkAcesso = `<a href="./admissao?ca=${item.codigo_acesso}" target="_blank" class="btn btn-sm btn-outline-primary" title="Acesso do Candidato"><i class="bi bi-link-45deg"></i></a>`;
            const statusAcessado = item.acessado == 1 
                ? '<span class="badge bg-warning text-dark">Sim</span>'
                : '<span class="badge bg-secondary">Não</span>';
            let numeroDocumentosEnviados = 0;
            let statusDocumentosEnviados = '';
            if(item.doc_identidade_arquivo_frente !== null && item.doc_identidade_arquivo_costas !== null && item.doc_identidade_valor !== null){
                numeroDocumentosEnviados ++;
            }
            if(numeroDocumentosEnviados !== totalDocumentos){
                statusDocumentosEnviados = `<span class="badge bg-secondary">${numeroDocumentosEnviados}/${totalDocumentos}</span>`;
            }else{
                statusDocumentosEnviados = `<span class="badge bg-warning text-dark">${numeroDocumentosEnviados}/${totalDocumentos}</span>`;
            }
            let numeroDocumentosValidados = 0;
            let statusDocumentosValidados = '';
            if(item.doc_identidade_valido === 1){
                numeroDocumentosValidados ++;
            }
            if(numeroDocumentosValidados !== totalDocumentos){
                statusDocumentosValidados = `<span class="badge bg-secondary">${numeroDocumentosValidados}/${totalDocumentos}</span>`;
            }else{
                statusDocumentosValidados = `<span class="badge bg-warning text-dark">${numeroDocumentosValidados}/${totalDocumentos}</span>`;
            }
            let telefoneFormatado = formatarTelefone(item.candidato_telefone);
            const btnDocumentos = `<button type="button" class="btn btn-sm btn-outline-secondary btn-documentos" data-id="${item.codigo_acesso}" title="Ver Documentacao"><i class="bi bi-file-earmark-check"></i></button>`;
            const linkEmail = `<a href="mailto:${item.candidato_email}" target="_blank" class="btn btn-sm btn-outline-primary" title="Contatar por E-mail"><i class="bi bi-envelope"></i></a>`;
            const linkWhatsapp = `<a href="https://wa.me/55${telefoneFormatado}" target="_blank" class="btn btn-sm btn-outline-primary" title="Contatar por Whatsapp"><i class="bi bi-whatsapp"></i></a>`;
            const btnCancelar = `<button type="button" class="btn btn-sm btn-outline-secondary btn-cancelar" data-id="${item.id}" title="Cancelar Processo"><i class="bi bi-person-fill-slash"></i></button>`;
            const btnFinalizar = `<button type="button" class="btn btn-sm btn-outline-secondary btn-finalizar" data-id="${item.id}" title="Finalizar Processo"><i class="bi bi-person-check-fill"></i></button>`;
            tr.innerHTML = `
                <td>${item.candidato_nome || 'Candidato não encontrado'}</td>
                <td>${formatarData(item.data_inicio)}</td>
                <td><code>${item.codigo_acesso}</code> ${linkAcesso}</td>
                <td>${item.senha}</td>
                <td>${statusAcessado}</td>
                <td>${statusDocumentosEnviados}</td>
                <td>${statusDocumentosValidados}</td>
                <td>${btnDocumentos} ${linkEmail} ${linkWhatsapp} ${btnCancelar} ${btnFinalizar}</td>
            `;
            tbody.appendChild(tr);

            tr.querySelector('.btn-documentos').addEventListener('click', function() {
                const ca = this.getAttribute('data-id');
                window.location.href = `documentacao-admissoes?ca=${ca}`;
            });
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
            tbody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">Erro ao carregar dados.</td></tr>';
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
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/\D/g, '');
}