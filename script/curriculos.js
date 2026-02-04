document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('table tbody');
    const alertContainer = document.getElementById('alert-container');
    const filtroInput = document.getElementById('filtro-curriculos');
    let todosCurriculos = [];
    let todasTagsSistema = [];
    let tagsEdicao = [];
    let curriculoEmEdicao = null;
    let filteredCurriculos = [];
    let currentPage = 1;
    const itemsPerPage = 10;
    let alertTimeout;

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
            }, 3000);
        } else {
            // Fallback in case the container is missing
            console.error(message);
        }
    };

    async function carregarTagsSistema() {
        try {
            const response = await fetch('api/tags.php');
            if (response.ok) {
                todasTagsSistema = await response.json();
            }
        } catch (error) { console.error('Erro ao carregar tags do sistema', error); }
    }

    function renderizarTabela(lista) {
        tbody.innerHTML = '';

        if (!Array.isArray(lista) || lista.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum currículo encontrado.</td></tr>';
            return;
        }
        lista.forEach(curriculo => {
            const tr = document.createElement('tr');
            let telefoneFormatado = formatarTelefone(curriculo.telefone);
            const linkTags = `<button type="button" class="btn btn-sm btn-outline-secondary btn-tags" data-id="${curriculo.id}" title="Gerenciar Tags"><i class="bi bi-tag"></i></button>`;
            const btnAnotacao = `<button type="button" class="btn btn-sm btn-outline-secondary btn-anotacao" data-id="${curriculo.id}" title="Abrir Anotação"><i class="bi bi-pencil"></i></button>`;
            const linkArquivo = `<a href="api/download.php?id=${curriculo.id}" target="_blank" class="btn btn-sm btn-outline-primary" title="Baixar Currículo"><i class="bi bi-file-text"></i></a>`;
            const linkEmail = `<a href="mailto:${curriculo.email}" target="_blank" class="btn btn-sm btn-outline-primary" title="Contactar por E-mail"><i class="bi bi-envelope"></i></a>`;
            const linkWhatsapp = `<a href="https://wa.me/55${telefoneFormatado}" target="_blank" class="btn btn-sm btn-outline-primary" title="Contactar por Whatsapp"><i class="bi bi-whatsapp"></i></a>`;
            let anotacao = curriculo.anotacao || '';
            if (anotacao.length > 100) {
                anotacao = anotacao.substring(0, 99) + '...';
            }

            let tagsHtml = '';
            if (curriculo.tags) {
                const tags = curriculo.tags.split(',');
                const cores = curriculo.corestag ? curriculo.corestag.split(',') : [];
                tagsHtml = tags.map((tag, index) => {
                    const cor = cores[index] ? cores[index].trim() : '#ffc107';
                    return `<span class="badge text-dark me-1" style="background-color: ${cor} !important; color: #FFF !important;">${tag.trim()}</span>`;
                }).join('');
            }

            tr.innerHTML = `
                <td>${curriculo.nome || '-'}</td>
                <td>${curriculo.formacao || '-'}</td>
                <td>${curriculo.cargo || '-'}</td>
                <td>${tagsHtml}</td>
                <td>${anotacao}</td>
                <td>${linkTags} ${btnAnotacao} ${linkArquivo} ${linkEmail} ${linkWhatsapp}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    function renderizarControlesPaginacao() {
        const paginationContainer = document.getElementById('paginacao-container');
        if (!paginationContainer) return;

        paginationContainer.innerHTML = '';
        const totalPages = Math.ceil(filteredCurriculos.length / itemsPerPage);

        if (totalPages <= 1) return;

        let paginationHTML = '<ul class="pagination">';
        
        // Botão Anterior
        paginationHTML += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">Anterior</a>
        </li>`;

        // Números das páginas
        for (let i = 1; i <= totalPages; i++) {
            paginationHTML += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        // Botão Próximo
        paginationHTML += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">Próximo</a>
        </li>`;

        paginationHTML += '</ul>';
        paginationContainer.innerHTML = paginationHTML;

        paginationContainer.querySelectorAll('.page-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.getAttribute('data-page'));
                if (page > 0 && page <= totalPages) {
                    currentPage = page;
                    atualizarTabelaComPaginacao();
                }
            });
        });
    }

    function atualizarTabelaComPaginacao() {
        const start = (currentPage - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const paginatedItems = filteredCurriculos.slice(start, end);
        
        renderizarTabela(paginatedItems);
        renderizarControlesPaginacao();
    }

    async function carregarCurriculos() {
        try {
            // Feedback visual de carregamento
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Carregando dados...</td></tr>';

            // Chamada para a API (assumindo o endpoint api/curriculos.php)
            const response = await fetch('api/curriculos.php');

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            todosCurriculos = await response.json();
            
            const urlParams = new URLSearchParams(window.location.search);
            const busca = urlParams.get('busca');
            if (busca && filtroInput) {
                filtroInput.value = busca;
                filtroInput.dispatchEvent(new Event('input'));
            } else {
                filteredCurriculos = todosCurriculos;
                atualizarTabelaComPaginacao();
            }

        } catch (error) {
            console.error('Erro:', error);
            showAlert('Não foi possível carregar os currículos. Verifique sua conexão ou tente novamente mais tarde.', 'danger');
            tbody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Falha ao carregar dados.</td></tr>';
        }
    }

    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termos = e.target.value.toLowerCase().split('+').map(t => t.trim()).filter(t => t);
            filteredCurriculos = todosCurriculos.filter(c => 
                termos.every(termo => 
                    (c.nome && c.nome.toLowerCase().includes(termo)) || 
                    (c.formacao && c.formacao.toLowerCase().includes(termo)) ||
                    (c.cargo && c.cargo.toLowerCase().includes(termo)) ||
                    (c.anotacao && c.anotacao.toLowerCase().includes(termo)) ||
                    (c.tags && c.tags.toLowerCase().includes(termo))
                )
            );
            currentPage = 1;
            atualizarTabelaComPaginacao();
        });
    }

    // Evento para abrir o modal de anotação
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-anotacao');
        if (btn) {
            const id = btn.getAttribute('data-id');
            const curriculo = todosCurriculos.find(c => c.id == id);
            
            if (curriculo) {
                document.getElementById('idCurriculoAnotacao').value = curriculo.id;
                document.getElementById('textoAnotacao').value = curriculo.anotacao || '';
                
                const modalElement = document.getElementById('anotacaoModal');
                const modal = new bootstrap.Modal(modalElement);
                modal.show();
            }
        }
    });

    // Evento para abrir o modal de tags
    tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-tags');
        if (btn) {
            const id = btn.getAttribute('data-id');
            const curriculo = todosCurriculos.find(c => c.id == id);
            
            if (curriculo) {
                abrirModalTags(curriculo);
            }
        }
    });

    function abrirModalTags(curriculo) {
        curriculoEmEdicao = curriculo;
        tagsEdicao = curriculo.tags_ids ? curriculo.tags_ids.split(',').map(id => parseInt(id)) : [];
        atualizarModalTagsView();

        const modal = new bootstrap.Modal(document.getElementById('tagsModal'));
        modal.show();
    }

    function atualizarModalTagsView() {
        const containerTags = document.getElementById('listaTagsAtuais');
        const selectNovaTag = document.getElementById('selectNovaTag');
        
        containerTags.innerHTML = '';
        selectNovaTag.innerHTML = '<option value="" selected disabled>Selecione uma tag...</option>';

        tagsEdicao.forEach(tagId => {
            const tag = todasTagsSistema.find(t => t.id == tagId);
            if (tag) {
                const badge = document.createElement('div');
                badge.className = 'badge d-flex align-items-center gap-2 p-2';
                badge.style.backgroundColor = tag.cor || '#ffc107';
                badge.style.color = '#FFF';
                badge.innerHTML = `
                    ${tag.nome}
                    <i class="bi bi-x-circle-fill text-danger btn-remover-tag" style="cursor: pointer;" data-id="${tag.id}"></i>
                `;
                containerTags.appendChild(badge);
            }
        });

        todasTagsSistema.forEach(tag => {
            if (!tagsEdicao.includes(parseInt(tag.id))) {
                const option = document.createElement('option');
                option.value = tag.id;
                option.textContent = tag.nome;
                selectNovaTag.appendChild(option);
            }
        });
    }

    document.getElementById('listaTagsAtuais').addEventListener('click', (e) => {
        if (e.target.classList.contains('btn-remover-tag')) {
            const id = parseInt(e.target.getAttribute('data-id'));
            tagsEdicao = tagsEdicao.filter(tagId => tagId !== id);
            atualizarModalTagsView();
        }
    });

    document.getElementById('btnAdicionarTag').addEventListener('click', () => {
        const select = document.getElementById('selectNovaTag');
        const id = parseInt(select.value);
        if (id && !tagsEdicao.includes(id)) {
            tagsEdicao.push(id);
            atualizarModalTagsView();
        }
    });

    const btnSalvarTags = document.getElementById('btnSalvarTags');
    if (btnSalvarTags) {
        btnSalvarTags.addEventListener('click', async () => {
            if (!curriculoEmEdicao) return;
            
            const btn = btnSalvarTags;
            const originalText = btn.innerText;
            btn.disabled = true;
            btn.innerText = 'Salvando...';

            const originalTags = curriculoEmEdicao.tags_ids ? curriculoEmEdicao.tags_ids.split(',').map(id => parseInt(id)) : [];
            
            const toAdd = tagsEdicao.filter(id => !originalTags.includes(id));
            const toRemove = originalTags.filter(id => !tagsEdicao.includes(id));

            try {
                const promises = [];
                
                toAdd.forEach(tagId => {
                    const formData = new FormData();
                    formData.append('curriculo_id', curriculoEmEdicao.id);
                    formData.append('tag_id', tagId);
                    formData.append('acao', 'adicionar');
                    promises.push(fetch('api/gerenciar_tag.php', { method: 'POST', body: formData }));
                });

                toRemove.forEach(tagId => {
                    const formData = new FormData();
                    formData.append('curriculo_id', curriculoEmEdicao.id);
                    formData.append('tag_id', tagId);
                    formData.append('acao', 'remover');
                    promises.push(fetch('api/gerenciar_tag.php', { method: 'POST', body: formData }));
                });

                await Promise.all(promises);
                
                const modalElement = document.getElementById('tagsModal');
                const modal = bootstrap.Modal.getInstance(modalElement);
                modal.hide();
                
                showAlert('Tags atualizadas com sucesso!', 'success');
                carregarCurriculos();
            } catch (error) {
                console.error('Erro ao salvar tags:', error);
                showAlert('Erro ao salvar tags.', 'danger');
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    }

    // Evento para salvar a anotação
    const btnSalvarAnotacao = document.getElementById('btnSalvarAnotacao');
    if (btnSalvarAnotacao) {
        btnSalvarAnotacao.addEventListener('click', async () => {
            const id = document.getElementById('idCurriculoAnotacao').value;
            const novaAnotacao = document.getElementById('textoAnotacao').value;
            const modalElement = document.getElementById('anotacaoModal');

            try {
                const formData = new FormData();
                formData.append('id', id);
                formData.append('anotacao', novaAnotacao);

                const response = await fetch('api/atualizar_anotacao.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    // Atualiza o array local e re-renderiza a tabela
                    const index = todosCurriculos.findIndex(c => c.id == id);
                    if (index !== -1) {
                        todosCurriculos[index].anotacao = novaAnotacao;
                        atualizarTabelaComPaginacao();
                    }
                    
                    // Fecha o modal
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                    showAlert('Anotação atualizada com sucesso!', 'success');
                } else {
                    showAlert('Erro ao salvar anotação.', 'danger');
                }
            } catch (error) {
                console.error('Erro:', error);
                showAlert('Erro de conexão ao salvar.', 'danger');
            }
        });
    }
    carregarTagsSistema();
    carregarCurriculos();
});
function formatarTelefone(telefone) {
    if (!telefone) return '';
    return telefone.replace(/\D/g, '');
}