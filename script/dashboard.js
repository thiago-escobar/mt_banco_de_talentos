document.addEventListener('DOMContentLoaded', () => {
    const logoutBtn = document.getElementById('logout-btn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                await fetch('api/logout.php');
            } catch (error) {
                console.error('Erro na requisição de logout', error);
            } finally {
                window.location.href = '/';
            }
        });
    }
});