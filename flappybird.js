
//board

// set up rectangular game area (like a piece of paper) where everything is drawn. 
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8; //  x position of bird
let birdY = boardHeight/2; // y position of bird
let birdImg;

// bird object
let bird = {
  x:birdX,
  y:birdY,
  width: birdWidth,
  height: birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64; //width/height  ratio = 384 / 3072 = 1/8
let pipeHeight = 512; 
let pipeX = boardWidth;
let pipeY = 0;

let topPipeImg;
let bottomPipeImg;

//physics
let velocityX = -2 // pipes moving left second
let velocityY = 0; //bird jump speed
let gravity = 0.4; // how fast bird is pulling down every time

let gameOver = false;
let score = 0;
let lastSpeedUpdateScore = 0; //it checks score update for every frame. 
//let pipeInterval = 1500;
//let pipeTimer;

let timeSinceLastPipe = 0;
let pipeDistance = 200; // the distance betwen pipes 

window.onload = function (){
  board = document.getElementById("board");
  board.height = boardHeight;
  board.width = boardWidth;
  context = board.getContext("2d"); //used for drawing on board

  //draw flappy bird
  //context.fillStyle = 'green';
  //context.fillRect(bird.x, bird.y, bird.width, bird.height);

  //load images
  birdImg = new Image();
  birdImg.src = "./flappybird.png";
  birdImg.onload = function (){
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
  }

  topPipeImg = new Image();
  topPipeImg.src = "./toppipe.png";

  bottomPipeImg = new Image();
  bottomPipeImg.src = "./bottompipe.png";
  
  requestAnimationFrame(update);
  //pipeTimer = setInterval(placePipes, pipeInterval); //every 1.5 seconds
  document.addEventListener("keydown", moveBird);
}

function update() {
  requestAnimationFrame(update);
  if (gameOver){
    return;
  }

  // Before drawing the next frame, erase everything from previous one.
  // Otherwise, old frames would pile up and make a mess on the canvas.
  context.clearRect(0,0,board.width, board.height);

  //bird
  velocityY += gravity;
  //bird.y += velocityY;
  bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y,  limit the bird.y, limit the bird.y to top of the canvas
  context.drawImage(birdImg, bird.x,bird.y, bird.width, bird.height); // this draws the bird in new position

  if(bird.y > board.height){
    gameOver = true;
  }

  //pipes
  for (let i = 0; i<pipeArray.length ; i++){
    let pipe = pipeArray[i];
    pipe.x += velocityX;
    context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);

    
    
    // scoring logic
    if(!pipe.passed && bird.x > pipe.x + pipe.width){
       score += 0.5; //0.5 because there are 2 pipes! so 0.5 * 2 = 1, 1 for each set of pipes
       pipe.passed = true; 

       if(Math.floor(score) % 10 === 0 && Math.floor(score) !== lastSpeedUpdateScore ){ 
        /*
        Math.floor(score) % 10 cannot cover the all speed up like what if the speed increase like 20.1, 20.2, 20.3, they all satisfies the conditions thus it speed up every deciminal score.
        Math.floor(score) !== lastSpeedUpdateScore can check the every score update if the score is the same as lastscore. 
        */

        velocityX -= 0.5;
        //pipeInterval -=100; // this does not change anything because there is no live connection in this number
        //clearInterval(pipeTimer); // you first need to stop the old timer
        //pipeTimer = setInterval(placePipes, pipeInterval); // you set the new timer 
       
        lastSpeedUpdateScore = Math.floor(score)
       }
       
    }

    if(detectCollision(bird,pipe)){
      gameOver = true;
    }
  }

  timeSinceLastPipe += Math.abs(velocityX); // Math.abs(velocityX) = 2 and increase by 2 

  if (timeSinceLastPipe >= pipeDistance) { // if ((timeSinceLastPipe) >= 200) it makes a new pipe and timeSinceLastPipe turns back to 0. 
    placePipes();
    timeSinceLastPipe = 0;
  }

  //clear pipes
  //remove pipes that have completely gone off the screen
  while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth){ // pipeArray.length > 0 make sure there's at least one pipe in the array
    // pipeArray[0].x is x-position of the pipe if less than -pipewidth, the pipe is no longer visible on the screen.
    pipeArray.shift(); // reomves first element from the array
  }

  //score
  //Draw the score
  context.fillStyle = "white";
  context.font = "45px sans-serif";
  context.fillText(score, 5, 45);

  //Draw game over message
  if(gameOver){
    context.fillText("GAME OVER", 5, 90);
  }

  
}

function placePipes(){

  if (gameOver){
    return;
  }

  //(0-1) * pipeHeight/2.
  // 0 -> -128 (pipeHeight/4)
  // 1 -> -128 -256 (pipeheight/4 -pipeHeight/2) = -3/4 pipeHeight
  let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
  let openingSpace = board.height/4;

  let topPipe ={
    img: topPipeImg,
    x:pipeX,
    y: randomPipeY,
    width: pipeWidth,
    height: pipeHeight,
    passed: false
  }

  pipeArray.push(topPipe);

  let bottomPipe = {
    img: bottomPipeImg,
    x:pipeX,
    y: randomPipeY + pipeHeight + openingSpace,
    width: pipeWidth,
    height: pipeHeight,
    passed: false

  }

  pipeArray.push(bottomPipe);
}

function moveBird(e) {
  if(e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX"){
    velocityY = -6;

    //reset game
    if(gameOver){
      bird.y = birdY;
      pipeArray = [];
      score = 0;
      gameOver = false;
      velocityX = -2;
    }
  }
}

function detectCollision(a,b){
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}