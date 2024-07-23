const CELL_SIZE = 80;
const CANVAS_WIDTH = innerWidth - 10;
const CANVAS_HEIGTH = innerHeight - 10;
// const CANVAS_WIDTH = 1200;
// const CANVAS_HEIGTH = 800;
const FRAME_RATE = 60;

const ROWS = Math.floor(CANVAS_HEIGTH / CELL_SIZE);
const COLS = Math.floor(CANVAS_WIDTH / CELL_SIZE);

let grid = [];
let currentCell = null;
let previousCell = null;
let endCell = null;

let stack = [];
let maxStackSize = stack.length;

class Cell {
  #corners;

  constructor(i, j) {
    this.i = i;
    this.j = j;
    this.x = i * CELL_SIZE;
    this.y = j * CELL_SIZE;

    this.#corners = [
      [this.x, this.y],
      [this.x + CELL_SIZE, this.y],
      [this.x + CELL_SIZE, this.y + CELL_SIZE],
      [this.x, this.y + CELL_SIZE],
      [this.x, this.y],
    ];
  }

  walls = [true, true, true, true];
  isVisited = false;
  isStartCell = false;
  isEndCell = false;
  isCurrentCell = false;

  drawWalls() {
    stroke(255);

    this.walls.forEach((wall, index) => {
      if (wall) {
        line(...this.#corners[index], ...this.#corners[index + 1]);
      }
    });
  }

  drawRect(color) {
    noStroke();
    fill(color);
    rect(this.x, this.y, CELL_SIZE, CELL_SIZE);
  }

  show() {
    stroke(255);

    this.drawWalls();

    if (this.isVisited && (!this.isStartCell || !this.isEndCell)) {
      this.drawRect('royalblue');
    }

    if (this.isCurrentCell) {
      this.drawRect('white');
    }

    if (this.isStartCell) {
      this.drawWalls();
      this.drawRect('green');
    }

    if (this.isEndCell) {
      this.drawWalls();
      this.drawRect('red');
    }
  }

  #getIndex(i, j) {
    if (i < 0 || j < 0 || i > COLS - 1 || j > ROWS - 1) return -1;

    return i + j * COLS;
  }

  getRandomNeighbor() {
    const neighbors = [];

    const t = grid[this.#getIndex(this.i, this.j - 1)];
    const r = grid[this.#getIndex(this.i + 1, this.j)];
    const b = grid[this.#getIndex(this.i, this.j + 1)];
    const l = grid[this.#getIndex(this.i - 1, this.j)];

    if (t && !t.isVisited) neighbors.push(t);
    if (r && !r.isVisited) neighbors.push(r);
    if (b && !b.isVisited) neighbors.push(b);
    if (l && !l.isVisited) neighbors.push(l);

    if (neighbors.length) {
      const randomNumber = Math.floor(Math.random() * neighbors.length);

      return neighbors[randomNumber];
    }

    return null;
  }

  removeWalls(neighbor) {
    const x = this.i - neighbor.i;
    const y = this.j - neighbor.j;

    if (y === 1) {
      this.walls[0] = neighbor.walls[2] = false;
    } else if (x === -1) {
      this.walls[1] = neighbor.walls[3] = false;
    } else if (y === -1) {
      this.walls[2] = neighbor.walls[0] = false;
    } else if (x === 1) {
      this.walls[3] = neighbor.walls[1] = false;
    }
  }

  setCurrentCellColor() {
    this.drawWalls();
    this.drawRect('yellow');
  }
}

for (let i = 0; i < ROWS; i++) {
  for (let j = 0; j < COLS; j++) {
    const cell = new Cell(j, i);

    grid.push(cell);
  }
}

currentCell = grid[Math.floor(Math.random() * ROWS * COLS)];
currentCell.isVisited = true;
currentCell.isStartCell = true;

function setup() {
  createCanvas(CANVAS_WIDTH, CANVAS_HEIGTH);
  frameRate(FRAME_RATE);
  strokeWeight(1);
  strokeCap(SQUARE);

  background(50);

  // grid.forEach((cell) => {
  //   cell.show();
  // });
}

// let i = 0;

// while (!endCell?.isEndCell) {
//   i++;

//   currentCell.isCurrentCell = true;

//   if (previousCell) {
//     previousCell.isCurrentCell = false;

//     if (maxStackSize < stack.length) {
//       maxStackSize = stack.length;
//       endCell = currentCell;
//     }
//   }

//   previousCell = currentCell;

//   // STEP 1
//   const nextCell = currentCell.getRandomNeighbor();

//   if (nextCell) {
//     currentCell.isCurrentCell = true;

//     // STEP 2
//     stack.push(currentCell);

//     // STEP 3
//     currentCell.removeWalls(nextCell);

//     // STEP 4
//     currentCell = nextCell;

//     currentCell.isVisited = true;
//   } else {
//     const lastCell = stack.pop();

//     if (lastCell) {
//       currentCell = lastCell;
//     } else {
//       endCell.isEndCell = true;
//     }
//   }
// }

// console.log('LOG ::: шагов сделано :', i);

// function draw() {
//   grid.forEach((cell) => {
//     cell.show();
//   });

//   noLoop();
// }

function draw() {
  currentCell.isCurrentCell = true;
  currentCell.show();

  if (previousCell) {
    previousCell.isCurrentCell = false;

    if (maxStackSize < stack.length) {
      maxStackSize = stack.length;
      endCell = currentCell;
    }

    previousCell.show();
  }

  previousCell = currentCell;

  // STEP 1
  const nextCell = currentCell.getRandomNeighbor();

  if (nextCell) {
    currentCell.isCurrentCell = true;

    // STEP 2
    stack.push(currentCell);

    // STEP 3
    currentCell.removeWalls(nextCell);

    // STEP 4
    currentCell = nextCell;
    currentCell.isVisited = true;
  } else {
    const lastCell = stack.pop();

    if (lastCell) {
      currentCell = lastCell;
    } else {
      endCell.isEndCell = true;

      endCell.show();

      noLoop();
    }
  }
}
