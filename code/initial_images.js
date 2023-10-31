// Obtén una referencia al canvas y su contexto
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

// Establece las rutas de las imágenes
imagenes.asteroide.src = "images/asteroide.png";
imagenes.cohete.src = "images/cohete.png";
imagenes.planeta.src = "images/planeta.png";
imagenes.ovni.src = "images/ovni.png";
imagenes.cometa.src = "images/cometa.png";

// Función para dibujar una imagen en una posición aleatoria con tamaño reducido al 5%
function drawRandomImage(image, x, y) {
    // Redefinir el tamaño de la imagen al 5% del tamaño original
    const newWidth = image.width * 0.05;
    const newHeight = image.height * 0.05;

    // Dibujar la imagen en el canvas con el nuevo tamaño
    ctx.drawImage(image, x, y, newWidth, newHeight);
}

// Función para dibujar todas las imágenes de la constante 'imagenes' en posiciones aleatorias
function drawAllImages() {
    for (let i = 0; i < 50; i++) { // Cambia el número de imágenes que deseas mostrar
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;
        const imagesArray = Object.values(imagenes); // Obtén un array de las imágenes de 'imagenes'
        const randomImage = imagesArray[Math.floor(Math.random() * imagesArray.length)];
        drawRandomImage(randomImage, randomX, randomY);
    }
}

// Llama a la función drawAllImages cuando se carga la página
window.onload = function() {
    drawAllImages();
};
