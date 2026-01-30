document.addEventListener('DOMContentLoaded', () => {
    const tbody = document.querySelector('table tbody');
    const alertContainer = document.getElementById('alert-container');
    const filtroInput = document.getElementById('filtro-curriculos');
    let todosCurriculos = [];
    let todasTagsSistema = [];
    let tagsEdicao = [];
    let curriculoEmEdicao = null;
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
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhum currículo encontrado.</td></tr>';
            return;
        }

        lista.forEach(curriculo => {
            const tr = document.createElement('tr');
            const linkTags = `<button type="button" class="btn btn-sm btn-outline-secondary ms-1 btn-tags" data-id="${curriculo.id}" title="Gerenciar Tags"><i class="bi bi-tag"></i></button>`;
            const btnAnotacao = `<button type="button" class="btn btn-sm btn-outline-secondary ms-1 btn-anotacao" data-id="${curriculo.id}" title="Abrir Anotação"><i class="bi bi-pencil"></i></button>`;
            const linkArquivo = `<a href="api/download.php?id=${curriculo.id}" target="_blank" class="btn btn-sm btn-outline-primary" title="Baixar Currículo"><i class="bi bi-file-earmark-arrow-down-fill"></i></a>`;
            
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
                    return `<span class="badge text-dark me-1" style="background-color: #${cor} !important; color: #FFF !important;">${tag.trim()}</span>`;
                }).join('');
            }

            tr.innerHTML = `
                <td>${curriculo.nome || '-'}</td>
                <td>${curriculo.cargo || '-'}</td>
                <td>${tagsHtml}</td>
                <td>${anotacao}</td>
                <td>${linkTags} ${btnAnotacao} ${linkArquivo}</td>
            `;
            tbody.appendChild(tr);
        });
    }

    async function carregarCurriculos() {
        try {
            // Feedback visual de carregamento
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando dados...</td></tr>';

            // Chamada para a API (assumindo o endpoint api/curriculos.php)
            const response = await fetch('api/curriculos.php');

            if (!response.ok) {
                throw new Error('Erro ao buscar dados do servidor.');
            }

            todosCurriculos = await response.json();
            renderizarTabela(todosCurriculos);

        } catch (error) {
            console.error('Erro:', error);
            showAlert('Não foi possível carregar os currículos. Verifique sua conexão ou tente novamente mais tarde.', 'danger');
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Falha ao carregar dados.</td></tr>';
        }
    }

    if (filtroInput) {
        filtroInput.addEventListener('input', (e) => {
            const termo = e.target.value.toLowerCase();
            const filtrados = todosCurriculos.filter(c => 
                (c.nome && c.nome.toLowerCase().includes(termo)) || 
                (c.cargo && c.cargo.toLowerCase().includes(termo)) ||
                (c.anotacao && c.anotacao.toLowerCase().includes(termo))
            );
            renderizarTabela(filtrados);
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
                badge.style.color = '#000';
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
                        renderizarTabela(todosCurriculos);
                    }
                    
                    // Fecha o modal
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                    showAlert('Anotação atualizada com sucesso!', 'success');
                } else {
                    alert('Erro ao salvar anotação.');
                }
            } catch (error) {
                console.error('Erro:', error);
                alert('Erro de conexão ao salvar.');
            }
        });
    }

    carregarTagsSistema();
    carregarCurriculos();
});