document.addEventListener("DOMContentLoaded", function () {
    const userChoiceImg = document.getElementById("userChoiceImg");
    const computerChoiceImg = document.getElementById("computerChoiceImg");
    const boton_juego = document.getElementById("boton_jugar");
    const user_choice = document.getElementById("userChoice");
    const resultado = document.getElementById("resultado");

    let userScore = 0;
    let computerScore = 0;

    boton_juego.addEventListener("click", function () {
        seleccion = user_choice.value;
        const computerChoice = obtenerElementoAleatorio();

        const ganador = determinarGanador(seleccion, computerChoice);

        if (ganador === "usuario") {
            userScore++;
        } else if (ganador === "computadora") {
            computerScore++;
        }

        resultado.textContent = `${userScore}-${computerScore}`;

        if (userScore === 3 || computerScore === 3) {
            mostrarGanador();
            reiniciarJuego();
        }
    });

    function obtenerElementoAleatorio() {
        const elementos = ["asteroide", "cohete", "planeta", "ovni", "cometa"];
        return elementos[Math.floor(Math.random() * elementos.length)];
    }

    function determinarGanador(user, computer) {
        if (
            (user === "asteroide" && (computer === "planeta" || computer === "cohete")) ||
            (user === "cohete" && (computer === "planeta" || computer === "ovni")) ||
            (user === "planeta" && (computer === "ovni" || computer === "cometa")) ||
            (user === "ovni" && (computer === "cometa" || computer === "asteroide")) ||
            (user === "cometa" && (computer === "asteroide" || computer === "cohete"))
        ) {
            return "usuario";
        } else if (user === computer) {
            return "empate";
        } else {
            return "computadora";
        }
    }

    function mostrarGanador() {
        if (userScore > computerScore) {
            alert("¡Felicidades! ¡Has ganado!");
        } else {
            alert("¡La computadora ha ganado! ¡Inténtalo de nuevo!");
        }
    }

    function reiniciarJuego() {
        userScore = 0;
        computerScore = 0;
        resultado.textContent = "0-0";
    }

});