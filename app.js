const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");
// getContext() method會回傳一個canvas的drawing context
// drawing context可用在canvas內畫圖
const unit = 20; //設定貪食蛇身體的一個單位為20
const row = canvas.height / unit;   // 320 / 20 = 16
const column = canvas.width / unit;

let snake = [];
function createSnake(){
    snake[0] = {
        x:80,
        y:0,
    };
    snake[1] = {
        x:60,
        y:0,
    };
    snake[2] = {
        x:40,
        y:0,
    };
    snake[3] = {
        x:20,
        y:0,
    };
}

//畫出果實
class Fruit {
    //使果實出現在canvas中的隨機一處
    constructor(){
        this.x = Math.floor((Math.random() * column)) * unit;
        this.y = Math.floor((Math.random() * row)) * unit;
    }

    //將計算好的x,y座標交由ctx畫出來
    drawFruit(){
        ctx.fillStyle = "yellow";
        ctx.fillRect(this.x, this.y, unit, unit);
    }

    pickALocation(){
        let overlapping = false;
        let new_x;
        let new_y;

        function checkOverlap(new_x, new_y){
            for(let i = 0 ; i < snake.length ; i++){
                if(snake[i].x == new_x && snake[i].y == new_y){
                    overlapping = true;
                    console.log("OverLapping...")
                    return;
                }
                else overlapping = false;
            }
        }

        do {
            new_x = Math.floor(Math.random() * column) * unit;
            new_y = Math.floor(Math.random() * row) * unit;
            checkOverlap(new_x, new_y);
        }while(overlapping){
            this.x = new_x;
            this.y = new_y;
            console.log("果實可能的新座標為 " + this.x + " " + this.y);
        }

    }
}

//初始設定
createSnake();
let myFruit = new Fruit();
let highestScore;
loadHighestScore();

window.addEventListener("keydown", changeDirection);
let d = "Right";
function changeDirection(e){
    
    if((e.keyCode == 65 || e.keyCode == 37) && d!= "Right"){
        d = "Left";
    }else if((e.keyCode == 87 || e.keyCode == 38) && d!= "Down" ){
        d = "Up";
    }else if((e.keyCode == 68 || e.keyCode == 39) && d!= "Left"){
        d = "Right";
    }else if((e.keyCode == 83 || e.keyCode == 40) && d!= "Up"){
        d = "Down";
    }
    
    //每次按下上下左右鍵之後, 在下一幀被劃出之前
    //不接受任何Keydown事件
    //可以防止連續案件導致蛇在邏輯上自殺
    window.removeEventListener("keydown", changeDirection);
}

let score = 0;
document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
document.getElementById("myScore2").innerHTML = "最高分數 : " + highestScore;

function draw(){
    //每次畫圖之前，確認蛇有無咬到自己
    for(let i = 1 ; i < snake.length ; i++){
        if(snake[0].x == snake[i].x && snake[0].y == snake[i].y){
            clearInterval(myGame);
            alert("Game Over!");
            return;
        }
    }


    //初始化畫布, 全設定為黑色
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    myFruit.drawFruit();

    for (let i = 0 ; i < snake.length ; i++){
        if(i == 0){
            ctx.fillStyle = "lightgreen";
            
        }else{
            ctx.fillStyle = "lightblue";
        }
        //ctx.strokeStyle = "white"; //strokeStyle可設定格子外框顏色

        //設定蛇穿牆後要從另一邊出來
        if(snake[i].x >= canvas.width){
            snake[i].x = 0;
        }
        if(snake[i].x < 0){
            snake[i].x = canvas.width - unit;
        }
        if(snake[i].y >= canvas.height){
            snake[i].y = 0;
        }
        if(snake[i].y < 0){
            snake[i].y = canvas.height - unit;
        }

        


        //x, y, width, heigth (fillRect, strokeRect 參數)
        ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
        ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
    }

    //以目前d變數方向，決定蛇的下一幀要放在哪
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    if(d == "Left"){
        snakeX -= unit;
    } else if(d == "Up"){
        snakeY -= unit;
    } else if(d == "Right"){
        snakeX += unit;
    } else if(d == "Down"){
        snakeY += unit;
    }

    //確定方向後就可設定新的蛇頭
    let newHead = {
        x: snakeX,
        y: snakeY,
    };


    //先pop再增加蛇頭座標
    //確認蛇是否有吃到果實
    if(snake[0].x == myFruit.x && snake[0].y == myFruit.y){
        //重新選定新位置
        myFruit.pickALocation();
        //畫出新果實
        //更新分數
        score++;
        setHighestScore(score);
        document.getElementById("myScore").innerHTML = "遊戲分數 : " + score;
        document.getElementById("myScore2").innerHTML = "最高分數 : " + highestScore;


    }else{
        snake.pop();    
    }
    snake.unshift(newHead);
    //確定蛇移動到正確的位置後
    window.addEventListener("keydown", changeDirection);
}

for (let i = 0 ; i < snake.length ; i++){
    if(i == 0){
        ctx.fillStyle = "lightgreen";
        
    }else{
        ctx.fillStyle = "lightblue";
    }
    //ctx.strokeStyle = "white"; //strokeStyle可設定格子外框顏色
    //x, y, width, heigth (fillRect, strokeRect 參數)
    ctx.fillRect(snake[i].x, snake[i].y, unit, unit);
    ctx.strokeRect(snake[i].x, snake[i].y, unit, unit);
}

let myGame = setInterval(draw, 100);

function loadHighestScore(){
    if (localStorage.getItem("highestScore") == null){
        highestScore = 0;
    }else {
        highestScore = localStorage.getItem("highestScore");
    }
}

function setHighestScore(score){
    if(score > highestScore){
        localStorage.setItem("highestScore", score);
        highestScore = score;
    }
}