const canvas = document.getElementById("game-board");
const ctx = canvas.getContext("2d");
const scoreElement = document.getElementById("score");
const highScoreElement = document.getElementById("high-score");
const pauseButton = document.getElementById("pause");

// 游戏设置
const gridSize = 20; // 每个格子的大小
const tileCount = canvas.width / gridSize; // 每行/列的格子数
let snake = [{ x: 10, y: 10 }]; // 蛇的初始位置
let direction = { x: 0, y: 0 }; // 蛇的移动方向
let food = { x: 5, y: 5 }; // 食物的位置
let score = 0;
let highScore = parseInt(localStorage.getItem("highScore")) || 0; // 从localStorage获取最高分
let lastUpdateTime = 0; // 用于控制移动速度
const moveInterval = 200; // 蛇每次移动的时间间隔（单位：毫秒）
let isPaused = false; // 游戏暂停状态

// 初始化最高分
highScoreElement.textContent = `最高分: ${highScore}`;

// 监听键盘事件
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (direction.y === 0) direction = { x: 0, y: -1 };
            break;
        case "ArrowDown":
            if (direction.y === 0) direction = { x: 0, y: 1 };
            break;
        case "ArrowLeft":
            if (direction.x === 0) direction = { x: -1, y: 0 };
            break;
        case "ArrowRight":
            if (direction.x === 0) direction = { x: 1, y: 0 };
            break;
    }
});

// 暂停和开始功能
pauseButton.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseButton.textContent = isPaused ? "开始" : "暂停";
    if (!isPaused) requestAnimationFrame(gameLoop); // 如果重新开始，调用游戏循环
});

// 游戏主循环
function gameLoop(currentTime) {
    if (isPaused) return;

    // 控制移动速度
    if (currentTime - lastUpdateTime < moveInterval) {
        requestAnimationFrame(gameLoop);
        return;
    }
    lastUpdateTime = currentTime;

    // 清空画布
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制蛇
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "green" : "lightgreen"; // 蛇头和身体颜色区分
        ctx.fillRect(
            segment.x * gridSize,
            segment.y * gridSize,
            gridSize - 2,
            gridSize - 2
        );
    });

    // 绘制食物
    ctx.fillStyle = "red";
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // 更新蛇的位置
    const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

    // 边界和自我碰撞检测
    if (
        head.x < 0 ||
        head.x >= tileCount ||
        head.y < 0 ||
        head.y >= tileCount ||
        snake.some((segment) => segment.x === head.x && segment.y === head.y)
    ) {
        alert(`游戏结束！你的得分是: ${score}`);
        resetGame();
        return;
    }

    // 检测是否吃到食物
    if (head.x === food.x && head.y === food.y) {
        food = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount),
        };
        score++;
        scoreElement.textContent = `分数: ${score}`;

        // 更新最高分
        if (score > highScore) {
            highScore = score;
            localStorage.setItem("highScore", highScore); // 保存最高分到localStorage
            highScoreElement.textContent = `最高分: ${highScore}`;
        }
    } else {
        snake.pop(); // 如果没有吃到食物，移除蛇的尾部
    }

    // 将新头部添加到蛇的前面
    snake.unshift(head);

    // 继续游戏循环
    requestAnimationFrame(gameLoop);
}

// 重置游戏
function resetGame() {
    snake = [{ x: 10, y: 10 }];
    direction = { x: 0, y: 0 };
    food = { x: 5, y: 5 };
    score = 0;
    scoreElement.textContent = `分数: ${score}`;
}

// 启动游戏循环
requestAnimationFrame(gameLoop);
