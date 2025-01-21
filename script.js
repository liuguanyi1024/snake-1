document.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("game-board");
    const ctx = canvas.getContext("2d");

    // 音效
    const eatSound = document.getElementById("eatSound");
    const gameOverSound = document.getElementById("gameOverSound");

    // 游戏参数
    const gridSize = 20; // 网格大小
    const rows = canvas.height / gridSize;
    const cols = canvas.width / gridSize;

    let snake = [{ x: 10, y: 10 }]; // 初始蛇的位置
    let food = { x: 15, y: 15 }; // 食物的初始位置
    let direction = { x: 0, y: 0 }; // 蛇的移动方向
    let score = 0; // 当前分数
    let highScore = localStorage.getItem("highScore") || 0; // 最高分
    let gameInterval = null; // 游戏循环

    // 显示分数
    const scoreDisplay = document.getElementById("score");
    const highScoreDisplay = document.getElementById("high-score");
    scoreDisplay.textContent = `分数: ${score}`;
    highScoreDisplay.textContent = `最高分: ${highScore}`;

    // 更新游戏
    function updateGame() {
        // 更新蛇的位置
        const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

        // 撞墙或撞自己结束游戏
        if (
            head.x < 0 ||
            head.y < 0 ||
            head.x >= cols ||
            head.y >= rows ||
            snake.some(segment => segment.x === head.x && segment.y === head.y)
        ) {
            clearInterval(gameInterval);
            gameOverSound.play(); // 播放游戏结束音效
            alert(`游戏结束！你的分数是：${score}`);
            resetGame();
            return;
        }

        snake.unshift(head);

        // 吃到食物
        if (head.x === food.x && head.y === food.y) {
            score++;
            eatSound.play(); // 播放吃食物音效
            scoreDisplay.textContent = `分数: ${score}`;
            if (score > highScore) {
                highScore = score;
                localStorage.setItem("highScore", highScore);
                highScoreDisplay.textContent = `最高分: ${highScore}`;
            }
            placeFood();
        } else {
            snake.pop(); // 移除尾部
        }

        renderGame();
    }

    // 绘制游戏
    function renderGame() {
        // 清空画布
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 绘制蛇
        ctx.fillStyle = "green";
        snake.forEach(segment => {
            ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
        });

        // 绘制食物
        ctx.fillStyle = "red";
        ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
    }

    // 随机放置食物
    function placeFood() {
        food = {
            x: Math.floor(Math.random() * cols),
            y: Math.floor(Math.random() * rows),
        };

        // 确保食物不会出现在蛇身上
        if (snake.some(segment => segment.x === food.x && segment.y === food.y)) {
            placeFood();
        }
    }

    // 处理键盘输入
    document.addEventListener("keydown", event => {
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

    // 启动游戏
    function startGame() {
        if (gameInterval) clearInterval(gameInterval); // 清除之前的游戏循环
        gameInterval = setInterval(updateGame, 150);
    }

    // 暂停游戏
    function pauseGame() {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    // 重置游戏
    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        direction = { x: 0, y: 0 };
        score = 0;
        scoreDisplay.textContent = `分数: ${score}`;
        placeFood();
        renderGame();
    }

    // 按钮事件
    document.getElementById("startButton").addEventListener("click", startGame);
    document.getElementById("pause").addEventListener("click", pauseGame);

    // 控制按钮事件
    document.getElementById("up").addEventListener("click", () => {
        if (direction.y === 0) direction = { x: 0, y: -1 };
    });
    document.getElementById("down").addEventListener("click", () => {
        if (direction.y === 0) direction = { x: 0, y: 1 };
    });
    document.getElementById("left").addEventListener("click", () => {
        if (direction.x === 0) direction = { x: -1, y: 0 };
    });
    document.getElementById("right").addEventListener("click", () => {
        if (direction.x === 0) direction = { x: 1, y: 0 };
    });

    // 初始化
    resetGame();
});
