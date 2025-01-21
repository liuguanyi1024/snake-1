// 游戏初始化和渲染设置
const canvas = document.getElementById('game-board');
const ctx = canvas.getContext('2d');

const gridSize = 20; // 每个格子的大小
const canvasSize = 360; // 画布的大小
canvas.width = canvasSize; 
canvas.height = canvasSize;

// 蛇的初始化
let snake = [
  { x: 160, y: 160 }, // 蛇的初始位置
  { x: 140, y: 160 },
  { x: 120, y: 160 }
];

let food = { x: 200, y: 200 }; // 食物的初始位置

let dx = gridSize; // 蛇的移动方向
let dy = 0;

let isPaused = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

function gameLoop() {
  if (isPaused) return;

  setTimeout(function() {
    clearCanvas();
    moveSnake();
    checkCollisions();
    render();
    gameLoop();
  }, 100);
}

// 清除画布
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// 渲染蛇和食物
function render() {
  // 绘制食物
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, gridSize, gridSize);

  // 绘制蛇
  ctx.fillStyle = 'green';
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, gridSize, gridSize);
  }

  // 绘制分数
  document.getElementById('score').innerText = `Score: ${score}`;
  document.getElementById('high-score').innerText = `High Score: ${highScore}`;
}

// 移动蛇
function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);
  if (head.x === food.x && head.y === food.y) {
    score++;
    food = randomFoodPosition();
    if (score > highScore) {
      highScore = score;
      localStorage.setItem('highScore', highScore);
    }
  } else {
    snake.pop();
  }
}

// 随机生成食物的位置
function randomFoodPosition() {
  const x = Math.floor(Math.random() * (canvas.width / gridSize)) * gridSize;
  const y = Math.floor(Math.random() * (canvas.height / gridSize)) * gridSize;
  return { x, y };
}

// 检查碰撞
function checkCollisions() {
  const head = snake[0];
  
  // 与墙壁碰撞
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    resetGame();
  }
  
  // 与自己碰撞
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      resetGame();
    }
  }
}

// 重置游戏
function resetGame() {
  snake = [
    { x: 160, y: 160 },
    { x: 140, y: 160 },
    { x: 120, y: 160 }
  ];
  food = randomFoodPosition();
  score = 0;
  dx = gridSize;
  dy = 0;
}

// 监听键盘事件
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowUp' && dy === 0) {
    dx = 0;
    dy = -gridSize;
  }
  if (e.key === 'ArrowDown' && dy === 0) {
    dx = 0;
    dy = gridSize;
  }
  if (e.key === 'ArrowLeft' && dx === 0) {
    dx = -gridSize;
    dy = 0;
  }
  if (e.key === 'ArrowRight' && dx === 0) {
    dx = gridSize;
    dy = 0;
  }
});

// 按钮控制
document.getElementById('startButton').addEventListener('click', function() {
  if (isPaused) {
    isPaused = false;
    gameLoop();
    this.innerText = 'Pause';
  } else {
    isPaused = true;
    this.innerText = 'Resume';
  }
});

document.getElementById('pause').addEventListener('click', function() {
  isPaused = true;
  document.getElementById('startButton').innerText = 'Start';
});

gameLoop(); // 启动游戏循环
