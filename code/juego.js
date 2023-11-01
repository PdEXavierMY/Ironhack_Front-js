const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Crea imágenes para los elementos del juego
const imagenes = {
    asteroide: new Image(),
    cohete: new Image(),
    planeta: new Image(),
    ovni: new Image(),
    cometa: new Image(),
};

const catalizadores = {
    atomo: new Image(),
    plasma: new Image(),
    polvo: new Image(),
};

// Establece las rutas de las imágenes
imagenes.asteroide.src = "images/asteroide.png";
imagenes.cohete.src = "images/cohete.png";
imagenes.planeta.src = "images/planeta.png";
imagenes.ovni.src = "images/ovni.png";
imagenes.cometa.src = "images/cometa.png";
catalizadores.atomo.src = "images/atomo.png";
catalizadores.plasma.src = "images/plasma.png";
catalizadores.polvo.src = "images/polvo.png";

// Función para obtener el ancho de la ventana del navegador
function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

function adjustCoordinates(x, y, canvas) {
    const minX = 30; // Mínimo valor permitido para X
    const maxX = canvas.width - 30; // Máximo valor permitido para X
    const minY = 30; // Mínimo valor permitido para Y
    const maxY = canvas.height - 30; // Máximo valor permitido para Y

    // Ajusta X y Y si están fuera de los límites
    if (x < minX) {
        x = minX;
    } else if (x > maxX) {
        x = maxX;
    }

    if (y < minY) {
        y = minY;
    } else if (y > maxY) {
        y = maxY;
    }

    return { x, y };
}

// Función para dibujar una imagen en una posición aleatoria con un tamaño específico
function drawRandomImage(image, x, y, scale) {
    // Redefinir el tamaño de la imagen según el factor de escala
    const newWidth = image.width * scale;
    const newHeight = image.height * scale;

    // Ajusta las coordenadas dentro de los límites
    const adjustedCoordinates = adjustCoordinates(x, y, canvas);
    x = adjustedCoordinates.x;
    y = adjustedCoordinates.y;

    // Dibujar la imagen en el canvas con el nuevo tamaño
    ctx.drawImage(image, x, y, newWidth, newHeight);
}

// Función para dibujar todas las imágenes de la constante 'imagenes' en posiciones aleatorias
function generateAllImages() {
    const generatedImages = [];

    for (let i = 0; i < 50; i++) {
        let randomX = Math.random() * canvas.width;
        let randomY = Math.random() * canvas.height;
        const imagesArray = Object.values(imagenes);
        const randomImage = imagesArray[Math.floor(Math.random() * imagesArray.length)];

        // Ajusta las coordenadas dentro de los límites
        const adjustedCoordinates = adjustCoordinates(randomX, randomY, canvas);
        randomX = adjustedCoordinates.x;
        randomY = adjustedCoordinates.y;

        generatedImages.push({ x: randomX, y: randomY, image: randomImage });
    }

    return generatedImages;
}

document.addEventListener("DOMContentLoaded", function() {
    // Define las imágenes que deseas mover
    const images = generateAllImages();
    console.log(images);

    // Define la velocidad de movimiento
    const speed =10;

    function moveImages() {
        // Borra el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Mueve las imágenes en direcciones aleatorias
        images.forEach(function(image) {
            // Genera un valor aleatorio entre -1 y 1 para el desplazamiento horizontal y vertical
            const dx = (Math.random() - 0.5) * 2; // -1 a 1
            const dy = (Math.random() - 0.5) * 2; // -1 a 1

            // Calcula la nueva posición de la imagen
            image.x += dx * speed;
            image.y += dy * speed;

            let scale = 0.05; // Factor de escala predeterminado

            if (image.image === imagenes.planeta) {
                // Si el ancho de la ventana es menor a 500px, usa un factor de escala del 15%
                if (getWindowWidth() < 500) {
                    scale = 0.15;
                } else {
                    scale = 0.1;
                }
            }

            drawRandomImage(image.image, image.x, image.y, scale);
        });
    }

    // Establece un intervalo para llamar a la función de movimiento
    setInterval(moveImages, 100); // Puedes ajustar la velocidad de movimiento cambiando el valor de 100 (en milisegundos)

    // Llama a moveImages al cargar la página para mostrar las imágenes iniciales
    moveImages();
});


/*
// Evento de cambio de tamaño de ventana para redibujar las imágenes cuando cambie el ancho de la ventana
window.addEventListener("resize", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllImages();
});*/