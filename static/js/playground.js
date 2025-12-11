import init, { Universe, Cell } from "/wasm/wasm_game_of_life.js"

const { memory } = await init("/wasm/wasm_game_of_life_bg.wasm");

console.log("OK")

const CELL_SIZE = 5; // px
const GRID_COLOR = "#FFA86A";
const DEAD_COLOR = "#222129";
const ALIVE_COLOR = "#FFA86A";

const width = 128;
const height = 128;
const universe = Universe.new(width, height);

const canvas = document.getElementById("game-of-life-canvas");
const ctx = canvas.getContext('2d');

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1

const playPauseButton = document.getElementById("play-pause");
const resetButton = document.getElementById("reset");
const nukeButton = document.getElementById("nuke");

let animationId = null

const play = () => {
    playPauseButton.textContent = "⏸";
    renderLoop();
};

const pause = () => {
    playPauseButton.textContent = "▶";
    cancelAnimationFrame(animationId);
    animationId = null;
};

playPauseButton.addEventListener("click", _ => {
    if (isPaused()) {
        play();
    } else {
        pause();
    }
});

resetButton.addEventListener("click", _ => {
    universe.reset()
    if (isPaused()) {
        drawCells();
    }
})

nukeButton.addEventListener("click", _ => {
    universe.nuke();
    drawCells();
    pause();
})

const isPaused = () => {
    return animationId === null;
};

const renderLoop = () => {
    universe.tick();
    drawCells();

    animationId = requestAnimationFrame(renderLoop);
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    // Alive cells.
    ctx.fillStyle = ALIVE_COLOR;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);
            if (cells[idx] !== Cell.Alive) {
                continue;
            }

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    // Dead cells.
    ctx.fillStyle = DEAD_COLOR;
    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);
            if (cells[idx] !== Cell.Dead) {
                continue;
            }

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

const drawBorders = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;
    ctx.lineWidth = 1;

    ctx.strokeRect(
        0.5,                  // crisp 1-pixel lines
        0.5,
        canvas.width - 1,
        canvas.height - 1
    );
}

canvas.addEventListener("click", event => {
    const boundingRect = canvas.getBoundingClientRect();

    const scaleX = canvas.width / boundingRect.width;
    const scaleY = canvas.height / boundingRect.height;

    const canvasLeft = (event.clientX - boundingRect.left) * scaleX;
    const canvasTop = (event.clientY - boundingRect.top) * scaleY;

    const row = Math.min(Math.floor(canvasTop / (CELL_SIZE + 1)), height - 1);
    const col = Math.min(Math.floor(canvasLeft / (CELL_SIZE + 1)), width - 1);

    if (event.shiftKey) {
        universe.spawn_pulsar(row, col);
    } else if (event.ctrlKey) {
        universe.spawn_glider(row, col);
    } else {
        universe.toggle_cell(row, col);
    }


    drawCells();
});

drawBorders();
drawCells();
play();
