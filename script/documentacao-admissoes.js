document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const ca = urlParams.get('ca');
    
    const divCadastrada = document.querySelector('.identidade-cadastrada');
    const divNaoCadastrada = document.querySelector('.identidade-nao-cadastrada');
    
    // Ocultar inicialmente
    if (divCadastrada) divCadastrada.style.display = 'none';
    if (divNaoCadastrada) divNaoCadastrada.style.display = 'none';

    if (!ca) {
        alert('Código de acesso não informado.');
        window.location.href = 'acompanhamento-admissoes';
        return;
    }

    fetch(`api/get_documentacao.php?ca=${ca}`)
        .then(response => response.json())
        .then(data => {
            if (data.success && data.data && data.data.doc_identidade_valor) {
                const doc = data.data;
                
                document.getElementById('identidade_valor').textContent = doc.doc_identidade_valor;
                
                if (doc.doc_identidade_arquivo_frente) {
                    document.getElementById('identidade_frente').src = `data:image/${doc.doc_identidade_extensao_frente};base64,${doc.doc_identidade_arquivo_frente}`;
                }
                
                if (doc.doc_identidade_arquivo_costas) {
                    document.getElementById('identidade_costas').src = `data:image/${doc.doc_identidade_extensao_costas};base64,${doc.doc_identidade_arquivo_costas}`;
                }

                const btnValidar = document.getElementById('btn-validar-identidade');
                const msgValidada = document.getElementById('identidade-validada');
                if(doc.doc_identidade_arquivo_frente === null || doc.doc_identidade_arquivo_costas === null || doc.doc_identidade_valor === null){
                    msgValidada.style.display = 'none';
                    btnValidar.style.display = 'none';
                }else{
                    if (doc.doc_identidade_valido == 1) {
                        if (btnValidar) btnValidar.style.display = 'none';
                        if (msgValidada) msgValidada.style.display = 'inline';
                    } else {
                        if (btnValidar) btnValidar.style.display = 'block';
                        if (msgValidada) msgValidada.style.display = 'none';
                    }
                }
                if (divCadastrada) divCadastrada.style.display = 'block';
            } else {
                if (divNaoCadastrada) divNaoCadastrada.style.display = 'block';
                document.getElementById('identidade_frente').style.display = 'none';
                document.getElementById('identidade_costas').style.display = 'none';
                document.getElementById('btn-validar-identidade').style.display = 'none';
                document.getElementById('identidade-validada').style.display = 'none';
            }
        })
        .catch(error => console.error('Erro ao carregar documentação:', error));

    const btnValidar = document.getElementById('btn-validar-identidade');
    if (btnValidar) {
        btnValidar.addEventListener('click', () => {
            const formData = new FormData();
            formData.append('ca', ca);

            fetch('api/validar_documentacao.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert('Erro ao validar documento: ' + (data.error || 'Erro desconhecido'));
                }
            })
            .catch(error => console.error('Erro:', error));
        });
    }
});