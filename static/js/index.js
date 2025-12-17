import init, { Universe, Cell } from "/wasm/wasm_game_of_life.js"

const { memory } = await init("/wasm/wasm_game_of_life_bg.wasm");

const CELL_SIZE = 5; // px
const GRID_COLOR = "#FFA86A";
const DEAD_COLOR = "#222129";
const ALIVE_COLOR = "#FFA86A";

const canvas = document.getElementById("game-of-life-canvas");
const ctx = canvas.getContext('2d');

const actionBar = document.getElementById("action-bar-container")

const getWidth = () => Math.floor(canvas.parentElement.offsetWidth / (CELL_SIZE + 1))

let width = getWidth()
const height = 16;
let universe = Universe.new(width, height);

canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1

const playPauseButton = document.getElementById("play-pause");
const resetButton = document.getElementById("reset");
const nukeButton = document.getElementById("nuke");

const playIcon = `
    <svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
width="14"
height="14"
fill="currentColor"
    >
    <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
    </svg>
`;

const pauseIcon = `
    <svg
xmlns="http://www.w3.org/2000/svg"
viewBox="0 0 24 24"
width="14"
height="14"
fill="currentColor"
    >
    <path fill-rule="evenodd" d="M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z" clip-rule="evenodd" />
    </svg>
`;

let animationId = null

const play = () => {
    playPauseButton.innerHTML = pauseIcon;
    renderLoop();
};

const pause = () => {
    playPauseButton.innerHTML = playIcon;
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

canvas.addEventListener("contextmenu", event => {
    event.preventDefault()
    actionBar.style.visibility =
        actionBar.style.visibility === "hidden" ? "visible" : "hidden";
})

actionBar.addEventListener("contextmenu", event => {
    event.preventDefault()
    actionBar.style.visibility =
        actionBar.style.visibility === "hidden" ? "visible" : "hidden";
})

window.addEventListener("resize", () => {
    const newWidth = getWidth()
    if (width === newWidth) {
        return
    }

    width = newWidth
    canvas.width = (CELL_SIZE + 1) * width + 1;
    universe.set_width(width)
    universe.reset()
    drawBorders()
    drawCells();
    pause()

    animationId = requestAnimationFrame(renderLoop);
})

drawBorders();
drawCells();
play();
