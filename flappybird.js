
//board
let board;
let boardWidth = 360;
let boardHeight = 640;
let context;


//bird
let birdWidth = 34; //width/height ratio = 408/228 = 17/12
let birdHeight = 24;
let birdX = boardWidth/8;
let birdY = boardHeight/2;
let birdImg;

let bird = {
  x:birdX,
  y:birdY,
  width: birdWidth,
  height: birdHeight
}

// pipes
let pipeArray = [];
let pipeWidth = 64;
let pipeHeight = 512; 



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
  
  requestAnimationFrame(update)
}

function update() {
  requestAnimationFrame(update);
  context.clearRect(0,0,board.width, board.height);

  //bird
  context.drawImage(birdImg, bird.x,bird.y, bird.width, bird.height);


}