(async function() {
    try {
        const response = await fetch('api/check_auth.php');
        if (!response.ok) {
            throw new Error('Não autenticado');
        }
        const data = await response.json();
        if (!data.authenticated) {
            throw new Error('Não autenticado');
        }
    } catch (error) {
        window.location.href = '/';
    }
})();