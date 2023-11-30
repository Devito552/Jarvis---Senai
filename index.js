// Chaves de API

const GetKey = (service, callback) => {
  fetch('keys.json')
    .then(response => response.json())
    .then(data => {
      callback(data[service]);
    })
    .catch(error => console.error(error));
};

let APIOpenAI;
let APIAzureTTS;

GetKey('openai', (key) => {
  APIOpenAI = key;
});

GetKey('microsoft', (key) => {
  APIAzureTTS = key;
});

//interacao primeiro click

let h1 = document.querySelector('h1');
h1.click();


// modo escuro e claro
// Defina as funções no escopo global
function enableDarkMode() {

  const body = document.body;
  const toggleButton = document.getElementById('toggle-mode');

  body.classList.add('dark-mode');
  localStorage.setItem('mode', 'dark');
  toggleButton.innerHTML = '<i class="fas fa-sun"></i>';
  
}

function enableLightMode() {
  const body = document.body;
  const toggleButton = document.getElementById('toggle-mode');

  body.classList.remove('dark-mode');
  localStorage.setItem('mode', 'light');
  toggleButton.innerHTML = '<i class="fas fa-moon"></i>';
}

function toggleDarkMode() {
  const currentMode = localStorage.getItem('mode');
  if (currentMode === 'dark') {
    enableLightMode();
  } else {
    enableDarkMode();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const toggleButton = document.getElementById('toggle-mode');

  // Adicionar um ouvinte de evento para alternar entre os modos
  toggleButton.addEventListener('click', toggleDarkMode);

  // Verificar o modo atual e ajustar o texto do botão
  const currentMode = localStorage.getItem('mode');
  if (currentMode === 'dark') {
    enableDarkMode();
  } else {
    enableLightMode();
  }
});


function TrocaIcon() {
  var iconElement = document.getElementById("capture");
  iconElement.innerHTML = '<i class="fas fa-microphone-slash"></i>';
  iconElement.style.backgroundColor = 'green';
}

function VoltarIcon() {
  var iconElement = document.getElementById("capture");
  iconElement.innerHTML = '<i class="fas fa-microphone"></i>';
  iconElement.style.backgroundColor = '#dd203c';
}



// API OpenAI

const ConsultarOpenAI = async (pergunta) => {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("Authorization", "Bearer " + APIOpenAI);
  myHeaders.append("Cookie", "__cf_bm=kMUEoHjtMzklj3W_GajmYdHLQgI6vkP.gN8RFW0vmRo-1701178894-0-AezxRH5TomZBEiVpbGUik8o9S8Nx0Y9fDS4i5jzNaNHLrTYvvpq5thdeUzys9xdDiZNhW5yPGdRBS5MsmfqLFKg=; _cfuvid=ZvHhSFIW0uRoFz_8gm8f9Ot31a_omOQczXppe7jYemA-1701178894004-0-604800000");

  var raw = JSON.stringify({
    "model": "ft:gpt-3.5-turbo-0613:zeros-e-um::8PrTlJrT",
    "messages": [
      {
        "role": "system",
        "content": "Jarvis é um chatbot ignorante"
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
    .then(result => ReproduzirVoz(result.choices[0].message.content))
    .catch(error => console.log('error', error));


}

// Capturar voz do navegador e transcrever

const CapturarVoz = () => {

  var startButton = document.getElementById('capture');
  var resultElement = document.getElementById('prompt');

  var recognition = new webkitSpeechRecognition();

  recognition.lang = window.navigator.language;
  recognition.interimResults = false;
  recognition.continuous = true;

  recognition.start();


  recognition.addEventListener('result', (event) => {

    const result = event.results[event.results.length - 1][0].transcript;

    if (result.toLowerCase().includes('jarvis')) {

      if (result.toLowerCase().includes('trocar tema')) {

        toggleDarkMode();

        ReproduzirVoz('Tema alterado!');

        return;

      }

      TrocaIcon();

      // Comece a salvar a pergunta quando "Jarvis" é detectado
      let array_pergunta = result.toLowerCase().split(/(jarvis)/);

      // Remova o que vem antes de "Jarvis"
      array_pergunta.shift();
      // ["Jarvis", "qual é a previsão", "Jarvis", "do tempo?"]
      //     0             1                 2          3

      // ['jarvis', ' quem é o ', 'jarvis', ' na marvel']
      // Remover o primeiro "Jarvis" do array
      array_pergunta.shift();

      // Unir o restante do array em uma string
      array_pergunta = array_pergunta.join('');

      // Escrevemos no input a pergunta
      resultElement.value = array_pergunta;

      // Pare a captura de voz
      recognition.stop();

      // Consulte a API do OpenAI
      // ConsultarOpenAI(array_pergunta); Desativado por falta de API paga!
      ReproduzirVoz(array_pergunta);  //ativado por testes apernas!


      // Depois de 5 segundos, reinicie a captura de voz
      setTimeout(() => {

        recognition.start();

        VoltarIcon();

      }, 5000);
    }
  });


}

// Reproduz texto pelo azure TTS

const ReproduzirVoz = (resposta) => {

  var myHeaders = new Headers();
  myHeaders.append("Ocp-Apim-Subscription-Key", APIAzureTTS);
  myHeaders.append("Content-Type", "application/ssml+xml");
  myHeaders.append("X-Microsoft-OutputFormat", "audio-16khz-128kbitrate-mono-mp3");
  myHeaders.append("User-Agent", "curl");

  var raw = "<speak version='1.0' xml:lang='pt-BR'>\r\n    <voice xml:lang='pt-BR' xml:gender='Female' name='pt-BR-ElzaNeural'>\r\n  " + resposta + "\r\n    </voice>\r\n</speak>";

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://brazilsouth.tts.speech.microsoft.com/cognitiveservices/v1", requestOptions)
    .then(response => {
      if (response.ok) {
        return response.arrayBuffer();
      } else {
        throw new Error(`Falha na requisição: ${response.status} - ${response.statusText}`);
      }
    })
    .then(data => {
      const blob = new Blob([data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(blob);

      const audioElement = new Audio(audioUrl);
      audioElement.play();
    })
    .catch(error => {
      console.error('Erro:', error);
    });

}



CapturarVoz();
