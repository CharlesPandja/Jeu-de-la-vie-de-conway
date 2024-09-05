// Calculer la prochaine génération selon les règles du Jeu de la Vie
onmessage = function(event) {
    const grid = event.data;
    const cols = grid.length;
    const rows = grid[0].length;

    const nextGen = grid.map(arr => [...arr]);

    for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
            const cell = grid[i][j];
            let numNeighbors = 0;

            // Compter les voisins vivants
            for (let xOff = -1; xOff <= 1; xOff++) {
                for (let yOff = -1; yOff <= 1; yOff++) {
                    if (xOff === 0 && yOff === 0) continue;
                    const x = i + xOff;
                    const y = j + yOff;

                    if (x >= 0 && x < cols && y >= 0 && y < rows) {
                        numNeighbors += grid[x][y];
                    }
                }
            }

            // Appliquer les règles du jeu
            if (cell === 1 && (numNeighbors < 2 || numNeighbors > 3)) {
                nextGen[i][j] = 0;
            } else if (cell === 0 && numNeighbors === 3) {
                nextGen[i][j] = 1;
            }
        }
    }

    postMessage(nextGen);
};