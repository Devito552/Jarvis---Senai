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


// API OpenAI

const ConsultarOpenAI = async(pergunta) => {

var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "Bearer Chave API OpenAI");
myHeaders.append("Cookie", "__cf_bm=kMUEoHjtMzklj3W_GajmYdHLQgI6vkP.gN8RFW0vmRo-1701178894-0-AezxRH5TomZBEiVpbGUik8o9S8Nx0Y9fDS4i5jzNaNHLrTYvvpq5thdeUzys9xdDiZNhW5yPGdRBS5MsmfqLFKg=; _cfuvid=ZvHhSFIW0uRoFz_8gm8f9Ot31a_omOQczXppe7jYemA-1701178894004-0-604800000");

var raw = JSON.stringify({
  "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8PrTlJrT",
  "messages": [
    {
      "role": "system",
      "content": "Jarvis é um chatbot pontual e muito simpático que ajuda as pessoas"
    },
    {
      "role": "user",
      "content": pergunta
    }
  ],
  "temperature": 0.2
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.openai.com/v1/chat/completions", requestOptions)
  .then(response => response.json())
  .then(result => console.log(result.choices[0].message.content))
  .catch(error => console.log('error', error));

}

// Capturar voz do navegador e transcrever

const CapturarVoz = () => {

    var startButton = document.getElementById('capture');
    var resultElement = document.getElementById('prompt');

    var recognition = new webkitSpeechRecognition();

    recognition.lang = window.navigator.language;
    recognition.interimResults = true;

    startButton.addEventListener('click', () => { recognition.start(); });


        recognition.addEventListener('result', (event) => {
            const result = event.results[event.results.length - 1][0].transcript;
            resultElement.value = result;
    });

    recognition.addEventListener('end', () => {
        const textoCapturado = resultElement.value;
        ConsultarOpenAI(textoCapturado);

    });
}

CapturarVoz();
