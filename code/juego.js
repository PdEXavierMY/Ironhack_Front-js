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
    const minX = 15; // Mínimo valor permitido para X
    const maxX = canvas.width - 15; // Máximo valor permitido para X
    const minY = 15; // Mínimo valor permitido para Y
    const maxY = canvas.height - 15; // Máximo valor permitido para Y

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

class CustomImage {
    constructor(x, y, dx, dy, image) {
        this.x = x;
        this.y = y;
        this.dx = dx;
        this.dy = dy;
        this.image = image;
        this.collision = false;
    }
}

// Función para dibujar una imagen en una posición específica con escala
function drawImage(customImage, scale) {
    const newWidth = customImage.image.width * scale;
    const newHeight = customImage.image.height * scale;
    ctx.drawImage(customImage.image, customImage.x, customImage.y, newWidth, newHeight);
}

// Función para generar una imagen aleatoria
function generateRandomImage() {
    // Genera coordenadas iniciales aleatorias
    let randomX = Math.random() * canvas.width;
    let randomY = Math.random() * canvas.height;

    // Ajusta las coordenadas dentro de los límites del canvas
    const adjustedCoordinates = adjustCoordinates(randomX, randomY, canvas);
    randomX = adjustedCoordinates.x;
    randomY = adjustedCoordinates.y;

    const imagesArray = Object.values(imagenes);
    const randomImage = imagesArray[Math.floor(Math.random() * imagesArray.length)];

    // Genera velocidades aleatorias
    const randomDx = (Math.random() - 0.5) * 2; // -1 a 1
    const randomDy = (Math.random() - 0.5) * 2; // -1 a 1

    return new CustomImage(randomX, randomY, randomDx, randomDy, randomImage);
}


// Función para generar un conjunto de imágenes aleatorias
function generateRandomImages(count) {
    const images = [];
    for (let i = 0; i < count; i++) {
        images.push(generateRandomImage());
    }
    return images;
}

// Función para verificar y ajustar la colisión
function checkCollision(image, speed) {
    const { x, y, dx, dy } = image;
    const minX = 15;
    const maxX = canvas.width - 15;
    const minY = 15;
    const maxY = canvas.height - 15;

    // Verifica colisión con los bordes izquierdo y derecho
    if (x + dx * speed < minX || x + dx * speed > maxX) {
        image.dx = -dx;
    }

    // Verifica colisión con los bordes superior e inferior
    if (y + dy * speed < minY || y + dy * speed > maxY) {
        image.dy = -dy;
    }

    // Verifica colisión en las esquinas (cambio en ambos dx y dy)
    if ((x + dx * speed < minX && y + dy * speed < minY) || (x + dx * speed > maxX && y + dy * speed > maxY)) {
        image.dx = -dx;
        image.dy = -dy;
    }

    if ((x + dx * speed > maxX && y + dy * speed < minY) || (x + dx * speed < minX && y + dy * speed > maxY)) {
        image.dx = -dx;
        image.dy = -dy;
    }
}


// Función para mover las imágenes con detección de colisiones
function moveImages(images, speed, scale) {
    // Borra el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Mueve las imágenes en direcciones aleatorias
    images.forEach(function (image) {
        // Verifica y ajusta la colisión antes de calcular la nueva posición
        checkCollision(image, speed);

        // Calcula la nueva posición de la imagen
        image.x += image.dx * speed;
        image.y += image.dy * speed;

        drawImage(image, scale);
    });
}



// Llama a la función moveImages al cargar la página para mostrar las imágenes iniciales
document.addEventListener("DOMContentLoaded", function() {
    // Define las imágenes que deseas mover
    let images = generateRandomImages(50);
    // Define la velocidad de movimiento
    let speed = 10;
    // Define la escala de las imágenes
    let scale = 0.05;

    // Establece un intervalo para llamar a la función de movimiento
    setInterval(function () {
        moveImages(images, speed, scale);
    }, 100); // Puedes ajustar la velocidad de movimiento cambiando el valor de 100 (en milisegundos)
});


/*
// Evento de cambio de tamaño de ventana para redibujar las imágenes cuando cambie el ancho de la ventana
window.addEventListener("resize", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateRandomImages(50);
});*/