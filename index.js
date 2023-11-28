document.addEventListener('DOMContentLoaded', function () {
    const toggleButton = document.getElementById('toggle-mode');
    const body = document.body;

    // Verificar o modo atual e ajustar o texto do botão
    const currentMode = localStorage.getItem('mode');
    if (currentMode === 'dark') {
        enableDarkMode();
    }

    // Adicionar um ouvinte de evento para alternar entre os modos
    toggleButton.addEventListener('click', function () {
        if (body.classList.contains('dark-mode')) {
            enableLightMode();
        } else {
            enableDarkMode();
        }
    });

    // Função para ativar o modo escuro
    function enableDarkMode() {
        body.classList.add('dark-mode');
        localStorage.setItem('mode', 'dark');
        toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Função para ativar o modo claro
    function enableLightMode() {
        body.classList.remove('dark-mode');
        localStorage.setItem('mode', 'light');
        toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
    }
});
