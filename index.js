window.onload = function() {
  const canvas = document.createElement("CANVAS");
  const context = canvas.getContext("2d");
  const CELL_SIZE = 25;
  const GRID_WIDTH = 10;
  const GRID_HEIGHT = 25;
  const FONT_FAMILY = "Courier";
  const STROKE_COLOR = "#222222";
  const SCENE_COLOR = "#111111";
  const MAX_JUMP_OFFSET = 4;
  const canvasStyles = {
    color: "#111111",
    border: { width: 10, color: "#222222", radius: 20 }
  };
  const player = { x: 5, y: 18, color: "orange" };
  const countMaxMap = {
    move: { count: 0, max: 8, },
    jump: { count: 0, max: 3  }
  };
  const colorMap = {
    0: "#111111",
    1: "orange",
    2: "blue",
    3: "#4488FF",
    4: "#FF4488",
    5: "#4FCC28"
  };
  let jumpOffset = 0;
  let isJump = false;

  const setupScene = function() {
    document.body.style.background = SCENE_COLOR;
    canvas.style.background = canvasStyles.color;
    canvas.style.border = `solid ${canvasStyles.border.width}px
      ${canvasStyles.border.color}`;
    canvas.style.borderRadius = `${canvasStyles.border.radius}px`;
    canvas.style.display = "block";
    canvas.style.margin = "0 auto";
    canvas.width = CELL_SIZE * grid[0].length;
    canvas.height = grid.length * CELL_SIZE;
    canvas.style.marginTop = `${((window.innerHeight / 2) - (canvas.height / 2))}px`;
  };

  const buildGrid = function(rows, cols) {
    const matrix = [];

    for (let i = 0; i < rows; i ++) {
        matrix[i] = [];
        for (let j = 0; j < cols; j ++)
            matrix[i][j] = 0;
    }
    return matrix;
  };

  const addMatrixToGrid = function(matrix, row, col) {
    let y = 0;
    let x = 0;

    for (let i = row; i < row + matrix.length; i ++) {
      for (let j = col; j < col + matrix[y].length; j ++) {
        if (matrix[y][x] !== 0)
          grid[i][j] = matrix[y][x];
        x ++;
        if (x >= matrix[y].length) {
          if (y < matrix.length - 1) {
            x = 0;
            y ++;
          }
        }
      }
    }
  };

  const applyCountMaxProcess = function(key) {
    if (!countMaxMap[key]) 
      throw new Error(`Key: "${key}" doesn't exist on countMaxMap object`);

    countMaxMap[key].count ++;
    if (countMaxMap[key].count >= countMaxMap[key].max) {
      countMaxMap[key].count = 0;
      return true;
    }
    return false;
  };

  const renderGrid = function(matrix) {
    for (let i = 0; i < matrix.length; i ++) {
      for (let j = 0; j < matrix[i].length; j ++) {
        context.lineWidth = 4;
        context.strokeStyle = STROKE_COLOR;
        context.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        if (matrix[i][j] > 0) {
          context.fillStyle = colorMap[matrix[i][j]];
          context.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        }
      }
    }
  };

  const renderTitle = function(title) {
    context.fillStyle = '#DDDDDD'; context.fillText(title, 5, CELL_SIZE * 2);
  };

  const renderPlayer = function() {
    context.lineWidth = 4;
    context.strokeStyle = STROKE_COLOR;
    context.fillStyle = player.color;
    context.fillRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
    context.strokeRect(player.x * CELL_SIZE, player.y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
  };

  const enableJump = function() {
    jumpOffset = player.y - MAX_JUMP_OFFSET;
    isJump = true;
  };

  const jump = function() {
    if (player.y > jumpOffset) {
      if (player.y >= 1) {
        if (grid[player.y - 1][player.x] === 0 && player.y >= 1) {
          player.y -= 1;
        } else {
          isJump = false;
        }
      } else {
        isJump = false;
      }
      
    }
  };

  const updatePlayer = function() {
    const moveCountMaxProcess = applyCountMaxProcess("move");

    if (moveCountMaxProcess) {
      if (player.y === jumpOffset && isJump) {
        isJump = false;
      } else 
      if (player.y < grid.length - 1 && !isJump) {
        if (grid[player.y + 1][player.x] === 0 && !isJump) {
          player.y += 1;
        }
      }
    }
    if (isJump) {
      const jumpCountMaxProcess = applyCountMaxProcess("jump");
      if (jumpCountMaxProcess) jump();
    }
  };

  const update = function() { updatePlayer(); };

  const draw = function() {
    context.clearRect(0, 0, canvas.width, canvas.height);

    renderGrid(grid);
    renderTitle("BLOCKY");
    renderPlayer();
  };

  const tick = function() {
    update(); draw(); requestAnimationFrame(tick);
  };

  document.onkeydown = function({ keyCode }) {
    switch(keyCode) {
      case 32:
        if (player.y === grid.length - 1) {
          enableJump();
        } else if (grid[player.y + 1][player.x] !== 0) {
          enableJump();
        }
        break;
      case 37: 
        if (grid[player.y][player.x - 1] === 0)
          player.x -= 1;
        break;
      case 39:
        if (grid[player.y][player.x + 1] === 0)
          player.x += 1;
        break;
    }
  };

  const grid = buildGrid(GRID_HEIGHT, GRID_WIDTH);

  addMatrixToGrid(ceilingShape, 0, 0);
  addMatrixToGrid(groundShape, grid.length - 1, 0);
  addMatrixToGrid(lShapeLeft, grid.length - lShapeLeft.length - 1, 0);
  addMatrixToGrid(lShapeRight, grid.length - lShapeRight.length - 1, grid[0].length - lShapeRight[0].length);
  addMatrixToGrid(tShape, parseInt(grid.length / 2), parseInt(grid[0].length / 2) - parseInt(tShape[0].length / 2));
  addMatrixToGrid(squareShape, 9, 0);
  addMatrixToGrid(squareShape2, 9, grid[0].length - squareShape2[0].length);
  addMatrixToGrid(rectShape, 4, 3);
  addMatrixToGrid(wallShape, 3, 0);
  addMatrixToGrid(brickShape, 5, grid[0].length - brickShape[0].length);
  addMatrixToGrid(tFlipShape, 16, 2);

  document.body.appendChild(canvas);

  setupScene();

  context.font = `${CELL_SIZE * 0.8}px ${FONT_FAMILY}`;

  tick();
}