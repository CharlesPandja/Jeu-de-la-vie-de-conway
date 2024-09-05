const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const width = canvas.width;
const height = canvas.height;
const resolution = 10;
const cols = width / resolution;
const rows = height / resolution;

let grid = createGrid();
let running = false;
let interval;
const worker = new Worker('worker.js');

// Initialiser une grille vide
function createGrid() {
    return new Array(cols).fill(null)
        .map(() => new Array(rows).fill(0));
}

// Dessiner la grille sur le canvas
function drawGrid(grid) {
    ctx.clearRect(0, 0, width, height);
    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cell = grid[i][j];
            ctx.beginPath();
            ctx.rect(i * resolution, j * resolution, resolution, resolution);
            ctx.fillStyle = cell ? '#000' : '#fff';
            ctx.fill();
            ctx.stroke();
        }
    }
}

// Envoyer la grille au Web Worker pour calculer la prochaine génération
function nextGeneration() {
    worker.postMessage(grid);
}

// Mettre à jour la grille avec la génération suivante renvoyée par le Web Worker
worker.onmessage = function(event) {
    grid = event.data;
    drawGrid(grid);
};

document.getElementById('start').addEventListener('click', () => {
    if (!running) {
        running = true;
        const speed = document.getElementById('speed').value;
        interval = setInterval(nextGeneration, speed);
    }
});

document.getElementById('pause').addEventListener('click', () => {
    running = false;
    clearInterval(interval);
});

document.getElementById('clear').addEventListener('click', () => {
    grid = createGrid();
    drawGrid(grid);
});

canvas.addEventListener('click', (event) => {
    const x = Math.floor(event.offsetX / resolution);
    const y = Math.floor(event.offsetY / resolution);
    grid[x][y] = grid[x][y] ? 0 : 1;
    drawGrid(grid);
});

drawGrid(grid);