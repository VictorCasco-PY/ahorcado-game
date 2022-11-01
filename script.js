const wordContainer = document.getElementById('wordContainer');
const startButton = document.getElementById('startButton');
const usedLettersElement = document.getElementById('usedLetters');
const endGame = document.getElementById('endGame');
const words = ['programacion', 'variable', 'persona', 'alumno', 'comida', 'teclado', 'mouse', 'monitor', 'javascript', 'html', 'oso', 'universidad', 'elefante', 'auto'];

//Crea un canvas en 2 dimensiones con dimensiones 0 0
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0;
ctx.canvas.height = 0;

//Partes del cuerpo del ahorcado
const bodyParts = [
    //x  y  xl  ya
    [4, 2, 1, 1], //cabeza
    [4, 3, 1, 2], //torso
    [3, 3, 1, 1], //brazo izq
    [5, 3, 1, 1], //brazo der
    [3, 5, 1, 1], //pierna izq
    [5, 5, 1, 1]  //pierna der
];

let selectedWord;
let usedLetters;
let mistakes;
let hits;

//Muestra las letras ya utilizadas
const addLetter = letter => {
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement);
}

//Agrega las partes del cuerpo
const addBodyPart = bodyPart => {
    ctx.fillStyle = '#FDF0D5';
    ctx.fillRect(...bodyPart);
};

//Si la letra es incorrecta agrega una parte del cuerpo, si se agregan todas las partes, se acaba el juego
const wrongLetter = () => {
    addBodyPart(bodyParts[mistakes]);
    mistakes++;
    if (mistakes === bodyParts.length) lostGame();
}

//Si se gana, evita que el usuario pueda escribir, reaparece el boton y muestra un mensaje de victorio
const winGame = () => {
    document.removeEventListener('keydown', letterEvent);
    startButton.style.display = 'block';
    endGame.innerHTML = 'GANASTE!';
};

//Si se pierde, evita que el usuario pueda escribirm reaparece el boton, muestra la palabra no adivinada y un mensaje de perdida
const lostGame = () => {
    document.removeEventListener('keydown', letterEvent);
    startButton.style.display = 'block';
    showLetters();
    endGame.innerHTML = "PERDISTE...";
};

//Si la letra ingresada es correcta muestra la letra en pantalla y suma puntos para ganar
const correctLetter = letter => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === letter) {
            children[i].classList.toggle('hidden');
            hits++;
        }
    }
    if (hits === selectedWord.length) winGame();
};

//Muestra todas las letras de la palabra a ser adivinada
const showLetters = () => {
    const { children } = wordContainer;
    for (let i = 0; i < children.length; i++) {
        if (children[i].innerHTML === selectedWord[i] && !(usedLetters.includes(selectedWord[i]))) {
            children[i].classList.toggle('hidden');
        }
    };
};

//Compara si la letra ingresada es correcta o incorrecta, ademas agrega la letra a una variable que almacena las letras ya usadas
const letterInput = letter => {
    if (selectedWord.includes(letter)) {
        correctLetter(letter);
    } else {
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter);
};

//Verifica si la letra tipeada pertenece al abecedario y si ya no fue ingresada
const letterEvent = event => {
    let newLetter = event.key.toUpperCase();
    if (newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)) {
        letterInput(newLetter);
    };
};

//agrega al HTML los span que contendran las letras
const drawWord = () => {
    selectedWord.forEach(letter => {
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
    console.log(selectedWord);
};

//Selecciona una palabra aleatoria de una lista y las separa letra por letra
const selectRandomWord = () => {
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase();
    selectedWord = word.split('');
};

//Dibuja en el canvas la horca 
const drawHangMan = () => {
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#3A3335';
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);
};

//Setea todo a 0 para iniciar el juego
const startGame = () => {
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML = '';
    endGame.innerHTML = '';
    startButton.style.display = 'none';
    drawHangMan();
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent);
};

//Evento de tipo click que empieza el juego
startButton.addEventListener('click', startGame);