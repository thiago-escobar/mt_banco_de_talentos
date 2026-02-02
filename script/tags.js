document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formNovaTag');
    const tbody = document.getElementById('tabela-tags');
    const alertContainer = document.getElementById('alert-container');
    let alertTimeout;
    let tagIdEmEdicao = null;
    let tagIdParaExcluir = null;
    
    const cardTitle = document.querySelector('.card-title');
    const tableCard = tbody ? tbody.closest('.card') : null;

    const resetarEstado = () => {
        tagIdEmEdicao = null;
        form.reset();
        document.getElementById('corTag').value = '#FFCB05';
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.innerText = 'Adicionar';
        
        if (cardTitle) cardTitle.innerText = 'Nova Tag';
        if (tableCard) tableCard.style.display = 'block';
        
        const containerCancel = document.getElementById('containerBtnCancelar');
        if (containerCancel) containerCancel.remove();
    };

    const ativarModoEdicao = () => {
        if (cardTitle) cardTitle.innerText = 'Editando Tag';
        if (tableCard) tableCard.style.display = 'none';

        if (!document.getElementById('containerBtnCancelar')) {
            const div = document.createElement('div');
            div.className = 'col-md-2';
            div.id = 'containerBtnCancelar';
            
            const btnCancel = document.createElement('button');
            btnCancel.type = 'button';
            btnCancel.className = 'btn btn-secondary w-100';
            btnCancel.innerText = 'Cancelar';
            btnCancel.addEventListener('click', resetarEstado);
            
            div.appendChild(btnCancel);
            form.appendChild(div);
        }
    };

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
            alert(message);
        }
    };

    async function carregarTags() {
        try {
            tbody.innerHTML = '<tr><td colspan="5" class="text-center">Carregando tags...</td></tr>';
            
            const response = await fetch('api/tags.php');
            if (!response.ok) throw new Error('Erro ao carregar tags');
            
            const tags = await response.json();
            tbody.innerHTML = '';

            if (tags.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="text-center">Nenhuma tag cadastrada.</td></tr>';
                return;
            }

            tags.forEach(tag => {
                const tr = document.createElement('tr');
                const cor = tag.cor || '#FFCB05';
                const totalCurriculos = tag.total_curriculos || 0;
                
                tr.innerHTML = `
                    <td>${tag.nome}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div style="width: 20px; height: 20px; background-color: ${cor}; border: 1px solid #000; border-radius: 4px;"></div>
                        </div>
                    </td>
                    <td><span class="badge text-dark" style="background-color: ${cor}; color: #FFF !important;">${tag.nome}</span></td>
                    <td>${totalCurriculos}</td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary btn-editar" data-id="${tag.id}" data-nome="${tag.nome}" data-cor="${cor}" title="Editar Tag"><i class="bi bi-pencil"></i></button>
                        <a href="lista-de-curriculos?busca=${encodeURIComponent(tag.nome)}" class="btn btn-sm btn-outline-secondary link-busca-curriculo-tag" title="Ver currículos"><i class="bi bi-file-earmark-person-fill"></i></a>
                        <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${tag.id}" title="Excluir Tag"><i class="bi bi-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Erro ao carregar dados.</td></tr>';
        }
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerText;
            
            btn.disabled = true;
            btn.innerText = 'Salvando...';

            try {
                const formData = new FormData(form);
                let url = 'api/criar_tag.php';
                
                if (tagIdEmEdicao) {
                    url = 'api/atualizar_tag.php';
                    formData.append('id', tagIdEmEdicao);
                }

                const response = await fetch(url, { method: 'POST', body: formData });
                const result = await response.json();

                if (response.ok && result.success) {
                    showAlert(tagIdEmEdicao ? 'Tag atualizada com sucesso!' : 'Tag criada com sucesso!', 'success');
                    resetarEstado();
                    carregarTags();
                } else {
                    showAlert(result.error || 'Erro ao criar tag.', 'danger');
                }
            } catch (error) {
                showAlert('Erro de conexão.', 'danger');
            } finally {
                btn.disabled = false;
                btn.innerText = originalText;
            }
        });
    }

    tbody.addEventListener('click', (e) => {
        const btnEditar = e.target.closest('.btn-editar');
        const btnExcluir = e.target.closest('.btn-excluir');

        if (btnEditar) {
            const { id, nome, cor } = btnEditar.dataset;
            tagIdEmEdicao = id;
            
            const nomeInput = form.querySelector('input[name="nome"]');
            if (nomeInput) nomeInput.value = nome;
            
            const corInput = document.getElementById('corTag');
            if (corInput) corInput.value = cor;
            
            const submitBtn = form.querySelector('button[type="submit"]');
            if (submitBtn) submitBtn.innerText = 'Atualizar';
            ativarModoEdicao();
        }

        if (btnExcluir) {
            tagIdParaExcluir = btnExcluir.dataset.id;
            const modal = new bootstrap.Modal(document.getElementById('confirmDeleteModal'));
            modal.show();
        }
    });

    const btnConfirmarExclusao = document.getElementById('btnConfirmarExclusaoTag');
    if (btnConfirmarExclusao) {
        btnConfirmarExclusao.addEventListener('click', async () => {
            if (!tagIdParaExcluir) return;

            try {
                const formData = new FormData();
                formData.append('id', tagIdParaExcluir);

                const response = await fetch('api/deletar_tag.php', { method: 'POST', body: formData });
                const result = await response.json();

                if (response.ok && result.success) {
                    showAlert('Tag excluída com sucesso!', 'success');
                    carregarTags();
                    const modalElement = document.getElementById('confirmDeleteModal');
                    const modal = bootstrap.Modal.getInstance(modalElement);
                    modal.hide();
                } else {
                    showAlert(result.error || 'Erro ao excluir tag.', 'danger');
                }
            } catch (error) {
                console.error(error);
                showAlert('Erro de conexão.', 'danger');
            }
        });
    }

    carregarTags();
});