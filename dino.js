//button 
let resetBtn = document.querySelector('#reset')
resetBtn.addEventListener('click', reset)

//board
let board;
let boardWidth = 750;
let boardHeight = 250;
let context;


//dino
let dinoWidth = 88;
let dinoHeight = 94;
let dinoX = 50;
let dinoY = boardHeight - dinoHeight;
let dinoImg;

let dino = {
  x: dinoX,
  y: dinoY,
  width: dinoWidth,
  height: dinoHeight,
}


//cactus
let cactusArray = []

let cactus1Width = 34;
let cactus2Width = 69;
let cactus3Width = 102;
let cactus4Width = 50;
let cactus5Width = 103;
let cactus6Width = 150;


let cactusHeight = 70;
let cactusX = 700;
let cactusY = boardHeight - cactusHeight

let cactus1Img;
let cactus2Img;
let cactus3Img;
let cactus4Img;
let cactus5Img;
let cactus6Img;

//cloud
let cloudArray = [];

let cloudWidth = 84;
let cloudHeight = 101;
let cloudX = 700;
let cloudY = cloudHeight

//physics
let velocityX = -8; //cactus moving left
let velocityY = 0;
let gravity = .4;

let gameOver = false;
let score = 0;


window.onload = function () {
  board = document.getElementById("board");

  board.width = boardWidth;
  board.height = boardHeight;

  context = board.getContext("2d") //used for drawing on the board

  //draw dino
  dinoImg = new Image()
  dinoImg.src = "./img/dino.png"

  dinoImg.onload = function () {

    context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);
  }

  //draw clouds
  cloudImg = new Image()
  cloudImg.src = "./img/cloud.png"

  //draw cacti
  cactus1Img = new Image()
  cactus1Img.src = "./img/cactus1.png"

  cactus2Img = new Image()
  cactus2Img.src = "./img/cactus2.png"

  cactus3Img = new Image()
  cactus3Img.src = "./img/cactus3.png"

  cactus4Img = new Image()
  cactus4Img.src = "./img/big-cactus1.png"

  cactus5Img = new Image()
  cactus5Img.src = "./img/big-cactus2.png"

  cactus6Img = new Image()
  cactus6Img.src = "./img/big-cactus3.png"

  document.addEventListener('keyup', moveDino)
  requestAnimationFrame(update);
  setInterval(placeCactus, 1000);
  setInterval(placeCloud, 1000);

}

//make Dino move 
let run1 = () => {
  dinoImg.src = "./img/dino-run1.png"
}

let run2 = () => {
  dinoImg.src = "./img/dino-run2.png"
}

let run1Interval = setInterval(run1, 500)
let run2Interval = setInterval(run2, 1000)


//UPDATE
function update() {
  requestAnimationFrame(update);

  if (gameOver) {
    clearInterval(run1Interval)
    clearInterval(run2Interval)
    return;
  }

  context.clearRect(0, 0, boardWidth, boardHeight)

  //cloud
  for (let i = 0; i < cloudArray.length; i++) {
    let cloud = cloudArray[i];
    cloud.x += velocityX;
    context.drawImage(cloud.img, cloud.x, cloud.y, cloud.width, cloud.height)

  }

  //dino
  velocityY += gravity;
  dino.y = Math.min(dino.y + velocityY, dinoY) //apply gravity to current dino.y making sure it doesn't exceed the ground 
  context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height);

  //cactus
  for (let i = 0; i < cactusArray.length; i++) {
    let cactus = cactusArray[i];
    cactus.x += velocityX;
    context.drawImage(cactus.img, cactus.x, cactus.y, cactus.width, cactus.height)

    //collision
    if (detectCollision(dino, cactus)) {
      gameOver = true;
      dinoImg.src = "./img/dino-dead.png"

      gameOverImg = new Image()
      gameOver.src = "./img/game-over.png"

      dinoImg.onload = function () {
        context.drawImage(dinoImg, dino.x, dino.y, dino.width, dino.height)
      }
      // Show the "Game Over" container
      const gameOverContainer = document.getElementById("gameOverContainer");
      gameOverContainer.style.display = "flex";
    }
  }

  context.fillStyle = "black";
  context.font = "20px corier";
  score++
  context.fillText(score, 5, 20)
}

//Move Dino
function moveDino(e) {
  if (gameOver) {
    return;
  }

  if ((e.code == "Space" || e.code == "ArrowUp") && dino.y == dinoY) { //checking if dino Y is on default position on the ground (dinoY)
    //jump
    velocityY = -10 //if we jump we have to subtract from Y axis because its left upper point of start

  }
}

function placeCactus() {
  if (gameOver) {
    return;
  }

  //place cactus
  let cactus = {
    img: null,
    x: cactusX,
    y: cactusY,
    width: null,
    height: cactusHeight
  }

  let placeCactusChance = Math.random(); 

  if (placeCactusChance > .80) {
    cactus.img = cactus6Img;
    cactus.width = cactus6Width;
    cactusArray.push(cactus);
  }
  else if (placeCactusChance > .70) {
    cactus.img = cactus5Img;
    cactus.width = cactus5Width;
    cactusArray.push(cactus);
  }
  else if (placeCactusChance > .60) {
    cactus.img = cactus4Img;
    cactus.width = cactus4Width;
    cactusArray.push(cactus);
  }
  else if (placeCactusChance > .50) { 
    cactus.img = cactus3Img;
    cactus.width = cactus3Width;
    cactusArray.push(cactus);
  }
  else if (placeCactusChance > .30) { 
    cactus.img = cactus2Img;
    cactus.width = cactus2Width;
    cactusArray.push(cactus);
  }
  else if (placeCactusChance > .20) { 
    cactus.img = cactus1Img;
    cactus.width = cactus1Width;
    cactusArray.push(cactus);
  }

  if (cactusArray.length > 4) {
    cactusArray.shift(); 
  }
}

//place cloud
function placeCloud() {
  let cloud = {
    img: cloudImg,
    x: cloudX,
    y: cloudY,
    width: cloudWidth,
    height: cloudHeight
  }

  let placeCloudChance = Math.random();

  if (placeCloudChance > .50) {
    cloudArray.push(cloud);
  }

  if (cloudArray.length > 5) {
    cloudArray.shift();
  }
}

function detectCollision(a, b) {

  return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
    a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
    a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
    a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function reset(e) {
  window.location.reload(true)
}