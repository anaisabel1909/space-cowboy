// board 
let board
let boardWidth = 800
let boardHeight = boardWidth * (1536 / 2752)
let context 

// cowgirl 
let cowgirlWidth = 48
let cowgirlHeight = 68
let cowgirlX = boardHeight/8
let cowgirlY = boardHeight/4 * 2.5
let cowgirlImg

let cowgirl = {
    x: cowgirlX,
    y: cowgirlY,
    width: cowgirlWidth,
    height: cowgirlHeight,
    img: cowgirlImg
}

let frames = [
    './assets/img/cowgirl0.png',
    './assets/img/cowgirl1.png',
    './assets/img/cowgirl2.png',
    './assets/img/cowgirl3.png'
]

let currentFrame = 0


let obstacleArray = []

let obstacle1Width = 24
let obstacle1Height = 34
let obstacle1X = boardWidth
let obstacle1Y = cowgirlY + cowgirlHeight - obstacle1Height
let obstacle1Img = ''
let obstacle1Color = 'red'

let obstacle2Width = 34
let obstacle2Height = 24
let obstacle2X = boardWidth
let obstacle2Y = cowgirlY + cowgirlHeight - obstacle2Height
let obstacle2Img = ''
let obstacle2Color = 'blue'

let obstacles = {
    1: {
        x: obstacle1X,
        y: obstacle1Y,
        width: obstacle1Width,
        height: obstacle1Height,
        img: obstacle1Img,
        color: obstacle1Color
    },
    2: {
        x: obstacle2X,
        y: obstacle2Y,
        width: obstacle2Width,
        height: obstacle2Height,
        img: obstacle2Img,
        color: obstacle2Color
    }
}

// physics
let velocityX = -2 // velocidade que os obstaculos se movem em direção à cowgirl 
let velocityY = 0 // velocidade que a cowgirl vai pular
let gravity = 0.25

let gameOver = false
let score = 0
let highestScore = 0

window.onload = function() {
    board = document.getElementById("board")
    board.width = boardWidth
    board.height = boardHeight
    context = board.getContext("2d")

    context.fillStyle = 'green'
    context.fillRect(cowgirl.x, cowgirl.y, cowgirl.width, cowgirl.height)

    context.fillStyle = 'red'
    context.fillRect(obstacle1X, obstacle1Y, obstacle1Width, obstacle1Height)

    context.fillStyle = 'blue'
    context.fillRect(obstacle2X, obstacle2Y, obstacle2Width, obstacle2Height)

    context.fillStyle = 'yellow'
    context.fillRect(0, cowgirlY + cowgirlHeight, boardWidth, 2)

    context.fillStyle = 'white'
    context.font = "20px sans-serif"
    context.fillText(score, 5, 45)


    requestAnimationFrame(update)
    setInterval(placeObstacle, 1000)
    document.addEventListener("keydown", moveCowgirl)

    // cowgirlImg = new Image()
    // setInterval(() => {
    //     cowgirlImg.src = frames[currentFrame]
    //     currentFrame = (currentFrame + 1) % frames.length
    // }, 100)
    // cowgirlImg.onload = function() {
    //     draw(cowgirl.img, cowgirl)
    // }

}

function update() {
    requestAnimationFrame(update)

    if (gameOver) return

    context.clearRect(0, 0, boardWidth, boardHeight)

    velocityY += gravity 
    cowgirl.y += velocityY
    cowgirl.y = Math.max(boardHeight/4, Math.min(cowgirl.y, cowgirlY))

    context.fillStyle = 'green'
    context.fillRect(cowgirl.x, cowgirl.y, cowgirl.width, cowgirl.height)

    // context.fillStyle = 'red'
    // context.fillRect(obstacle1X, obstacle1Y, obstacle1Width, obstacle1Height)

    // context.fillStyle = 'blue'
    // context.fillRect(obstacle2X, obstacle2Y, obstacle2Width, obstacle2Height)

    let currentObstacle = obstacleArray[0] 

    for (let i = 0; i < obstacleArray.length; i++) {
        let obstacle = obstacleArray[i]
        obstacle.x += velocityX
        context.fillStyle = obstacle.color
        context.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height)
    }

    if (obstacleArray.length > 0 && currentObstacle.x < -currentObstacle.width) {
        obstacleArray.shift()
    }

    if (detectCollision(cowgirl, currentObstacle)) {
        gameOver = true
    }

    if (!currentObstacle.passed && currentObstacle.x + currentObstacle.width < cowgirl.x) {
        score += 1
        currentObstacle.passed = true 
    }

    if (score > highestScore) {
        highestScore = score
    }

    context.fillStyle = 'yellow'
    context.fillRect(0, cowgirlY + cowgirlHeight, boardWidth, 2)

    // score
    context.fillStyle = 'white'
    context.font = "20px sans-serif"
    context.fillText(score, 5, 45)

    if (gameOver) {
        context.fillText("GAME OVER", 5, 90)
        context.fillText(`HIGHEST SCORE: ${highestScore}`, 5, 150)
    }
}

function draw(img, element) {
    context.drawImage(img, element.x, element.y, element.width, element.height)
}


function placeObstacle() {
    // escolher aleatoriamente qual obstaculo vai ser (1 ou 2)
    // adicionar ao array
    if (gameOver) return 

    randomObstacle = Math.floor(Math.random()*2) + 1

    let base = obstacles[randomObstacle]

    let obstacle = {
        x: base.x,
        y: base.y,
        width: base.width,
        height: base.height,
        img: base.img,
        color: base.color,
        passed: false 
    }

    obstacleArray.push(obstacle)
}

function moveCowgirl(e) {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        velocityY = -8   
    }

    if (e.code === 'ArrowDown') {
        velocityY += 8
    }

    if (e.code === 'KeyX') {
        gameOver = !gameOver
    }

    if (gameOver) {
        cowgirl.y = cowgirlY
        obstacleArray = []
        score = 0
        gameOver = false
    }
}

function detectCollision(a, b) {
    let collision = a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y +a.height > b.y

    return collision
}
