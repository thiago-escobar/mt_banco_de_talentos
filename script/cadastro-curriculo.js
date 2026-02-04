document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('cadastroCurriculoForm');
    const alertContainer = document.getElementById('alert-container');
    const submitBtn = form.querySelector('button[type="submit"]');
    let alertTimeout;
    const cargoInput = document.getElementById('cargoInput');
    const cargoHidden = document.getElementById('cargoHidden');
    const datalistOptions = document.getElementById('datalistOptions');
    const formacaoSelect = document.getElementById('formacao');
    const telefoneInput = document.getElementById('telefone');
    let cargosList = [];

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
            alert(message); // Fallback
        }
    };

    async function carregarCargos() {
        if (!datalistOptions) return;
        try {
            const response = await fetch('api/cargos.php');
            if (response.ok) {
                cargosList = await response.json();
                datalistOptions.innerHTML = '';
                
                cargosList.forEach(cargo => {
                    const option = document.createElement('option');
                    option.value = cargo.nome;
                    datalistOptions.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar cargos:', error);
        }
    }

    async function carregarFormacoes() {
        if (!formacaoSelect) return;
        try {
            const response = await fetch('api/formacoes.php');
            if (response.ok) {
                const formacoes = await response.json();
                formacaoSelect.innerHTML = '<option value="" selected disabled>Selecione uma opção</option>';
                
                formacoes.forEach(formacao => {
                    const option = document.createElement('option');
                    option.value = formacao.id;
                    option.textContent = formacao.nome;
                    formacaoSelect.appendChild(option);
                });
            }
        } catch (error) {
            console.error('Erro ao carregar formações:', error);
        }
    }

    if (cargoInput) {
        cargoInput.addEventListener('input', function() {
            const val = this.value;
            const found = cargosList.find(c => c.nome === val);
            if (found) {
                if (cargoHidden) cargoHidden.value = found.id;
                this.setCustomValidity('');
            } else {
                if (cargoHidden) cargoHidden.value = '';
                if (val === '') {
                    this.setCustomValidity('');
                } else {
                    this.setCustomValidity('Escolha uma das opções.');
                }
            }
        });
    }

    if (telefoneInput) {
        telefoneInput.addEventListener('input', (e) => {
            let v = e.target.value.replace(/\D/g, "");
            if (v.length > 11) v = v.slice(0, 11);
            v = v.replace(/^(\d{2})(\d)/g, "($1) $2");
            v = v.replace(/(\d)(\d{4})$/, "$1-$2");
            e.target.value = v;
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const originalBtnText = submitBtn.innerText;

            submitBtn.disabled = true;
            submitBtn.innerText = 'Enviando...';

            const formData = new FormData(form);

            try {
                // Assumindo que o endpoint para criação é api/create_curriculo.php
                const response = await fetch('api/create_curriculo.php', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    showAlert('Currículo cadastrado com sucesso! Redirecionando...', 'success');
                    form.reset();
                    setTimeout(() => {
                        window.location.href = 'lista-de-curriculos';
                    }, 2000);
                } else {
                    const result = await response.json();
                    showAlert('Erro ao cadastrar: ' + (result.error || 'Erro desconhecido'), 'danger');
                }
            } catch (error) {
                showAlert('Erro de conexão com o servidor.', 'danger');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerText = originalBtnText;
            }
        });
    }

    carregarCargos();
    carregarFormacoes();
});