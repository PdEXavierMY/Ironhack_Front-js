// Crea imágenes para los elementos del juego
const imagenes = {
    asteroide: new Image(),
    cohete: new Image(),
    planeta: new Image(),
    ovni: new Image(),
    cometa: new Image(),
};

// Establece las rutas de las imágenes
imagenes.asteroide.src = "images/asteroide.png";
imagenes.cohete.src = "images/cohete.png";
imagenes.planeta.src = "images/planeta.png";
imagenes.ovni.src = "images/ovni.png";
imagenes.cometa.src = "images/cometa.png";

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

    // Define la escala predeterminada
    let scale = 0.05;

    // Ajusta la escala según el ancho de la ventana
    if (windowWidth < breakpoints.small) {
        scale = 0.09; // Ejemplo de escala para ventanas pequeñas
    } else if (windowWidth < breakpoints.medium) {
        scale = 0.075; // Ejemplo de escala para ventanas medianas
    }

    return scale;
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
function drawImage(customImage, scale, ctx) {
    const newWidth = customImage.image.width * scale;
    const newHeight = customImage.image.height * scale;
    ctx.drawImage(customImage.image, customImage.x, customImage.y, newWidth, newHeight);
}

// Función para generar una imagen aleatoria
function generateRandomImage(canvas) {
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
function generateRandomImages(count, canvas) {
    const images = [];
    for (let i = 0; i < count; i++) {
        images.push(generateRandomImage(canvas));
    }
    return images;
}

// Función para verificar y ajustar la colisión
function checkBorderCollision(image, speed, canvas) {
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
function adjustCollisionPosition(collisionPair, scale) {
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
        adjustCollisionPosition([image, otherImage], scale);
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

/*
function changeImage(image, otherImage) {
    
    // Obtén las rutas de las imágenes
    const imagePath = image.image.src;
    const otherImagePath = otherImage.image.src;

    // Comprueba las reglas y realiza el intercambio
    if (imagePath.includes('asteroide') && otherImagePath.includes('cohete')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('asteroide')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('asteroide') && otherImagePath.includes('planeta')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('asteroide')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('planeta')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('cohete')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('ovni')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('cohete')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('ovni')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('planeta')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('planeta') && otherImagePath.includes('cometa')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('planeta')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('cometa')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('ovni')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('ovni') && otherImagePath.includes('asteroide')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('asteroide') && otherImagePath.includes('ovni')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('asteroide')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('asteroide') && otherImagePath.includes('cometa')) {
        image.image = otherImage.image;
    } else if (imagePath.includes('cometa') && otherImagePath.includes('cohete')) {
        otherImage.image = image.image;
    } else if (imagePath.includes('cohete') && otherImagePath.includes('cometa')) {
        image.image = otherImage.image;
    }
}*/

function changeImage(image, otherImage) {
    // Obtén las rutas de las imágenes
    const imagePath = image.image.src;
    const otherImagePath = otherImage.image.src;

    const imagePath_nombre = imagePath.split("/")[imagePath.split("/").length - 1].split(".")[0];
    const otherImagePath_nombre = otherImagePath.split("/")[otherImagePath.split("/").length - 1].split(".")[0];

    // Define las reglas de intercambio
    const exchangeRules = {
        'asteroide-cohete': () => otherImage.image = image.image,
        'cohete-asteroide': () => image.image = otherImage.image,
        'asteroide-planeta': () => otherImage.image = image.image,
        'planeta-asteroide': () => image.image = otherImage.image,
        'cohete-planeta': () => otherImage.image = image.image,
        'planeta-cohete': () => image.image = otherImage.image,
        'cohete-ovni': () => otherImage.image = image.image,
        'ovni-cohete': () => image.image = otherImage.image,
        'planeta-ovni': () => otherImage.image = image.image,
        'ovni-planeta': () => image.image = otherImage.image,
        'planeta-cometa': () => otherImage.image = image.image,
        'cometa-planeta': () => image.image = otherImage.image,
        'ovni-cometa': () => otherImage.image = image.image,
        'cometa-ovni': () => image.image = otherImage.image,
        'ovni-asteroide': () => otherImage.image = image.image,
        'asteroide-ovni': () => image.image = otherImage.image,
        'cometa-asteroide': () => otherImage.image = image.image,
        'asteroide-cometa': () => image.image = otherImage.image,
        'cometa-cohete': () => otherImage.image = image.image,
        'cohete-cometa': () => image.image = otherImage.image,
        // ... Agrega más reglas según sea necesario
    };

    // Genera una clave única para la regla
    const ruleKey = `${imagePath_nombre}-${otherImagePath_nombre}`;

    // Verifica si existe una regla para la combinación de imágenes y ejecútala si es así
    if (exchangeRules.hasOwnProperty(ruleKey)) {
        exchangeRules[ruleKey]();
    }
}

// Función para mover una imagen con detección de colisiones
function moveImage(image, speed, scale, ctx, canvas) {
    // Verifica y ajusta la colisión antes de calcular la nueva posición
    checkBorderCollision(image, speed, canvas);

    // Calcula la nueva posición de la imagen
    image.x += image.dx * speed;
    image.y += image.dy * speed;

    // Dibuja la imagen en la nueva posición
    drawImage(image, scale, ctx);
}

// Función controladora que maneja el movimiento de todas las imágenes
function controlador(images, speed, scale, ctx, canvas, imgFondo) {
    let collisioned_images = [];

    // Borra el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja el fondo
    drawBackground(canvas, ctx, imgFondo);

    // Bucle externo para recorrer todas las imágenes
    for (let i = 0; i < images.length; i++) {
        const currentImage = images[i];
        const check_collisioned_images = images.slice();
        let minDistance = Number.MAX_VALUE;
        let closestPair = [];

        // Verifica y ajusta la colisión con las paredes
        checkBorderCollision(currentImage, speed, canvas);

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
        moveImage(currentImage, speed, scale, ctx, canvas);
    }
}

function resetCanvas(canvas, ctx, imgFondo) {
    // Genera nuevas imágenes aleatorias
    const newImages = [];

    // Limpia el canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibuja el fondo
    drawBackground(canvas, ctx, imgFondo);

    // Devuelve el nuevo array de imágenes generado
    return newImages;
}

// Función para ajustar la velocidad según el valor del slider
function Speed() {
    const sliderValue = document.getElementById('slider').value;
    let newSpeed;
    let text;

    switch (parseInt(sliderValue)) {
        case 0:
            newSpeed = 1;
            text = "x0.5";
            break;
        case 1:
            newSpeed = 2;
            text = "x1";
            break;
        case 2:
            newSpeed = 4;
            text = "x2";
            break;
        case 3:
            newSpeed = 8;
            text = "x4";
            break;
        case 4:
            newSpeed = 16;
            text = "x8";
            break;
        default:
            newSpeed = 2; // Valor predeterminado
            break;
    }
    document.getElementById('numero_velocidad').innerText = text;
    return newSpeed;
}

function drawBackground(canvas, ctx, imgFondo) {
    ctx.drawImage(imgFondo, 0, 0, canvas.width, canvas.height);
}

// Función para verificar si todas las imágenes son iguales
function areAllImagesEqual(images) {
    // Obtiene la ruta de la primera imagen
    const firstImagePath = images[0].image.src;

    // Compara con las rutas de las demás imágenes
    for (let i = 1; i < images.length; i++) {
        const currentImagePath = images[i].image.src;
        if (firstImagePath !== currentImagePath) {
            return false; // Si encuentra una imagen diferente, retorna falso
        }
    }

    return true; // Si no encuentra ninguna imagen diferente, retorna verdadero
}

// Función para obtener el nombre del ganador basado en la ruta de la imagen
function getWinnerName(imagePath) {
    if (imagePath.includes('asteroide')) {
        return 'Asteroide';
    } else if (imagePath.includes('cohete')) {
        return 'Cohete';
    } else if (imagePath.includes('planeta')) {
        return 'Planeta';
    } else if (imagePath.includes('ovni')) {
        return 'Ovni';
    } else if (imagePath.includes('cometa')) {
        return 'Cometa';
    }

    return 'Desconocido'; // Si no coincide con ninguna imagen conocida
}

// Llama a la función moveImages al cargar la página para mostrar las imágenes iniciales
document.addEventListener("DOMContentLoaded", function () {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    imgFondo = new Image();
    imgFondo.src = "images/universo.jpg";

    // Define las imágenes que mover
    let images = generateRandomImages(60, canvas);
    // Define la escala de las imágenes
    let scale = getScale();
    let speed = Speed() // Velocidad de movimiento de las imágenes

    // Añade un event listener al slider para ajustar la velocidad dinámicamente
    document.getElementById('slider').addEventListener('input', function () {
        speed = Speed();
    });

    let intervalId; // Variable para almacenar el ID del intervalo

    // Función para iniciar el intervalo y habilitar/deshabilitar botones
    function startGame() {
        document.getElementById('start').disabled = true;
        document.getElementById('stop').disabled = false;
        intervalId = setInterval(function () {
            controlador(images, speed, scale, ctx, canvas, imgFondo);
            // Verifica si todas las imágenes son iguales
            if (areAllImagesEqual(images)) {
                //si hay mas de 1 imagen
                if (images.length > 1) {
                    // Obtiene la imagen ganadora
                    const winner = images[0].image.src;
                    alert("¡El ganador es: " + getWinnerName(winner)+"!");
                    // Detiene el intervalo
                    clearInterval(intervalId);
                }
            }
        }, 30);
    }

    startGame()

    // Función para detener el intervalo y habilitar/deshabilitar botones
    function stopGame() {
        document.getElementById('start').disabled = false;
        document.getElementById('stop').disabled = true;
        clearInterval(intervalId);
    }

    // Añade event listeners para cada botón
    document.getElementById('start').addEventListener('click', startGame);

    document.getElementById('stop').addEventListener('click', stopGame);

    document.getElementById('reset').addEventListener('click', function() {
        images = resetCanvas(canvas, ctx, imgFondo);
    });

    // Añade event listeners para cada botón
    document.getElementById('asteroide').addEventListener('click', function() {
        new_image = generateRandomImage(canvas);
        new_image.image = imagenes.asteroide;
        images.push(new_image);
        drawImage(new_image, scale, ctx);
    });

    document.getElementById('cohete').addEventListener('click', function() {
        new_image = generateRandomImage(canvas);
        new_image.image = imagenes.cohete;
        images.push(new_image);
        drawImage(new_image, scale, ctx);
    });

    document.getElementById('planeta').addEventListener('click', function() {
        new_image = generateRandomImage(canvas);
        new_image.image = imagenes.planeta;
        images.push(new_image);
        drawImage(new_image, scale, ctx);
    });

    document.getElementById('ovni').addEventListener('click', function() {
        new_image = generateRandomImage(canvas);
        new_image.image = imagenes.ovni;
        images.push(new_image);
        drawImage(new_image, scale, ctx);
    });

    document.getElementById('cometa').addEventListener('click', function() {
        new_image = generateRandomImage(canvas);
        new_image.image = imagenes.cometa;
        images.push(new_image);
        drawImage(new_image, scale, ctx);
    });

    // Añade un event listener para el botón "Generar"
    document.getElementById('generar').addEventListener('click', function() {
        // Obtiene el número de imágenes del input
        const cantidadImagenes = parseInt(document.getElementById('cantidadImagenes').value);

        // Verifica si la cantidad está dentro del rango permitido
        if (cantidadImagenes >= 1 && cantidadImagenes <= 50) {
            if (images.length === 0) {
                images = generateRandomImages(cantidadImagenes, canvas);
                // Dibuja las imagenes en el canvas
                for (let i = 0; i < images.length; i++) {
                    drawImage(images[i], scale, ctx);
                }
            }
            else {
                alert("Para generar nuevas imágenes, primero debe reiniciar el simulador.");
            }
        } else {
            // Muestra un mensaje de error si la cantidad está fuera del rango permitido
            alert("La cantidad de imágenes no puede superar las 50.");
        }
    });
});