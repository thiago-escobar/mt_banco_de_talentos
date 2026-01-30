document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('formNovaTag');
    const tbody = document.getElementById('tabela-tags');
    const alertContainer = document.getElementById('alert-container');
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
            alert(message);
        }
    };

    async function carregarTags() {
        try {
            tbody.innerHTML = '<tr><td colspan="4" class="text-center">Carregando tags...</td></tr>';
            
            const response = await fetch('api/tags.php');
            if (!response.ok) throw new Error('Erro ao carregar tags');
            
            const tags = await response.json();
            tbody.innerHTML = '';

            if (tags.length === 0) {
                tbody.innerHTML = '<tr><td colspan="4" class="text-center">Nenhuma tag cadastrada.</td></tr>';
                return;
            }

            tags.forEach(tag => {
                const tr = document.createElement('tr');
                const cor = tag.cor || '#FFCB05';
                
                tr.innerHTML = `
                    <td>${tag.nome}</td>
                    <td>
                        <div class="d-flex align-items-center gap-2">
                            <div style="width: 20px; height: 20px; background-color: ${cor}; border: 1px solid #000; border-radius: 4px;"></div>
                        </div>
                    </td>
                    <td><span class="badge text-dark" style="background-color: ${cor}; color: #FFF !important;">${tag.nome}</span></td>
                    <td class="text-end">
                        <button class="btn btn-sm btn-outline-secondary btn-editar" data-id="${tag.id}" data-nome="${tag.nome}" data-cor="${cor}"><i class="bi bi-pencil"></i></button>
                        <button class="btn btn-sm btn-outline-danger btn-excluir" data-id="${tag.id}"><i class="bi bi-trash"></i></button>
                    </td>
                `;
                tbody.appendChild(tr);
            });

        } catch (error) {
            console.error(error);
            tbody.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Erro ao carregar dados.</td></tr>';
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
                const response = await fetch('api/criar_tag.php', { method: 'POST', body: formData });
                const result = await response.json();

                if (response.ok && result.success) {
                    showAlert('Tag criada com sucesso!', 'success');
                    form.reset();
                    document.getElementById('corTag').value = '#FFCB05'; // Reset cor padrão
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

    carregarTags();
});