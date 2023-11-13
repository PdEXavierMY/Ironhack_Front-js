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

const BORDES = 15;

// Función para obtener el ancho de la ventana del navegador
function getWindowWidth() {
    return window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
}

// Función para obtener la escala basada en el ancho de la ventana
function getScale() {
    const windowWidth = getWindowWidth();

    // Define los puntos de quiebre para ajustar la escala
    const breakpoints = {
        small: 500,
        medium: 800,
    };

    // Asigna la escala según el ancho de la ventana
    if (windowWidth < breakpoints.small) {
        return 0.2; // Ejemplo de escala para ventanas pequeñas
    } else if (windowWidth < breakpoints.medium) {
        return 0.1; // Ejemplo de escala para ventanas medianas
    } else {
        return 0.05; // Escala predeterminada para ventanas grandes
    }
}

function adjustCoordinates(x, y, canvas) {
    const minX = 0; // Mínimo valor permitido para X
    const maxX = canvas.width - BORDES; // Máximo valor permitido para X
    const minY = 0; // Mínimo valor permitido para Y
    const maxY = canvas.height - BORDES; // Máximo valor permitido para Y

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

    // Genera velocidades aleatorias (-1 o 1)
    const randomDx = Math.random() < 0.5 ? -1 : 1;
    const randomDy = Math.random() < 0.5 ? -1 : 1;

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
function checkBorderCollision(image, speed) {
    const { x, y, dx, dy } = image;
    const minX = 0;
    const maxX = canvas.width - BORDES;
    const minY = 0;
    const maxY = canvas.height - BORDES;

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

// Función para verificar la colisión entre dos imágenes basada en las coordenadas x e y
function checkImageCollision(image1, image2) {
    const x1 = image1.x;
    const y1 = image1.y;
    const x2 = image2.x;
    const y2 = image2.y;

    // Define el margen de error permitido
    const margin = 15;

    // Comprueba si las coordenadas x e y son iguales con un margen de error
    if (
        Math.abs(x1 - x2) <= margin &&
        Math.abs(y1 - y2) <= margin
    ) {
        return true;
    }

    return false;
}

// Función para ajustar la posición después de una colisión entre imágenes
function adjustCollisionPosition(image, collisionPair, scale) {
    // Calcula la distancia y la superposición entre las imágenes
    const dx = collisionPair[0].x - collisionPair[1].x;
    const dy = collisionPair[0].y - collisionPair[1].y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const overlap = (collisionPair[0].image.width * scale + collisionPair[1].image.width * scale) / 2 - distance;

    // Ajusta las posiciones para separar las imágenes según la superposición
    const adjustX = (dx / distance) * overlap / 2;
    const adjustY = (dy / distance) * overlap / 2;

    collisionPair[0].x += adjustX;
    collisionPair[0].y += adjustY;
    collisionPair[1].x -= adjustX;
    collisionPair[1].y -= adjustY;
}

// Función para verificar y ajustar la colisión entre imágenes
function checkImageCollisionAndAdjust(image, otherImage, scale) {
    // Verifica la colisión
    if (checkImageCollision(image, otherImage)) {
        // Lógica del juego
        space_collision(image, otherImage);

        // Ajusta la posición después de cambiar la dirección
        adjustCollisionPosition(image, [image, otherImage], scale);
    }
}

// Función para la logica del juego
function space_collision(image, otherImage) {
    image.dx = -image.dx;
    image.dy = -image.dy;
    otherImage.dx = -otherImage.dx;
    otherImage.dy = -otherImage.dy;

    // Lógica de colisión
    changeImage(image, otherImage);
}

// En la función changeImage, agrega console.log() para verificar si se está llamando y qué condiciones se cumplen:
function changeImage(image, otherImage) {
    
    // Obtén las rutas de las imágenes
    const imagePath = image.image.src;
    const otherImagePath = otherImage.image.src;

    // Comprueba las reglas y realiza el intercambio
    if (imagePath.includes('asteroide') && otherImagePath.includes('cohete')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('asteroide') && otherImagePath.includes('planeta')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('planeta')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('ovni')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('ovni')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('cometa')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('cometa')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('asteroide')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('asteroide')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('cohete')) {
        otherImage.image = image.image;
    }
}

// Función para mover una imagen con detección de colisiones
function moveImage(image, speed, scale) {
    // Verifica y ajusta la colisión antes de calcular la nueva posición
    checkBorderCollision(image, speed);

    // Calcula la nueva posición de la imagen
    image.x += image.dx * speed;
    image.y += image.dy * speed;

    // Dibuja la imagen en la nueva posición
    drawImage(image, scale);
}

// Función controladora que maneja el movimiento de todas las imágenes
function controlador(images, speed, scale) {
    let collisioned_images = [];

    // Borra el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Bucle externo para recorrer todas las imágenes
    for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const check_collisioned_images = images.slice();
        let minDistance = Number.MAX_VALUE;
        let closestPair = [];

        // Verifica y ajusta la colisión con las paredes
        checkBorderCollision(currentImage, speed);

        // Bucle interno para verificar la colisión con otras imágenes no verificadas
        for (let j = i + 1; j < check_collisioned_images.length; j++) {
            // Verifica y ajusta la colisión entre imágenes
            checkImageCollisionAndAdjust(currentImage, check_collisioned_images[j], scale);

            // Calcula la distancia entre las imágenes
            const distance = Math.sqrt(
                (currentImage.x - check_collisioned_images[j].x) ** 2 +
                (currentImage.y - check_collisioned_images[j].y) ** 2
            );

            // Actualiza la pareja más cercana
            if (distance < minDistance) {
                minDistance = distance;
                closestPair = [currentImage, check_collisioned_images[j]];
            }
        }

        // Añade la pareja más cercana a la lista
        collisioned_images.push(...closestPair);

        // Mueve la imagen actual
        moveImage(currentImage, speed, scale);
    }
}

// Llama a la función moveImages al cargar la página para mostrar las imágenes iniciales
document.addEventListener("DOMContentLoaded", function () {
    // Define las imágenes que mover
    let images = generateRandomImages(60);
    // Define la velocidad de movimiento
    let speed = 2;
    // Define la escala de las imágenes
    let scale = getScale();
    
    setInterval(function () {
        controlador(images, speed, scale);
    }, 30); // Se puede ajustar el tiempo de actualización de las imágenes

    document.getElementById('reset').addEventListener('click', function() {
        images = resetCanvas(images);
    });

    // Añade event listeners para cada botón
    document.getElementById('asteroide').addEventListener('click', function() {
        new_image = generateRandomImage();
        new_image.image = imagenes.asteroide;
        images.push(new_image);
    });

    document.getElementById('cohete').addEventListener('click', function() {
        new_image = generateRandomImage();
        new_image.image = imagenes.cohete;
        images.push(new_image);
    });

    document.getElementById('planeta').addEventListener('click', function() {
        new_image = generateRandomImage();
        new_image.image = imagenes.planeta;
        images.push(new_image);
    });

    document.getElementById('ovni').addEventListener('click', function() {
        new_image = generateRandomImage();
        new_image.image = imagenes.ovni;
        images.push(new_image);
    });

    document.getElementById('cometa').addEventListener('click', function() {
        new_image = generateRandomImage();
        new_image.image = imagenes.cometa;
        images.push(new_image);
    });
});

function resetCanvas(images) {
    // Obtén el canvas y su contexto
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Genera nuevas imágenes aleatorias
    const newImages = [];

    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Devuelve el nuevo array de imágenes generado
    return newImages;
}


// Evento de cambio de tamaño de ventana para redibujar las imágenes cuando cambie el ancho de la ventana
window.addEventListener("resize", function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    generateRandomImages(20);
});