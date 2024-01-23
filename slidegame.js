
//GENERATE PLAYER ELEMENT ON BOARD

const player = document.createElement("div");
let playerStyle = player.style;
let gameContainer = document.getElementById("game-container");

player.classList.add('player');
gameContainer.appendChild(player);


//BOARD GENERATION

const BOARD_SIZE = 10;
let countObstacles = 5;
let obstacleCoordinates = [];
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0))

function generateRandomBoard() {
  let currentObstacles = countObstacles;
  while (currentObstacles > 0) {
    let obstaclePosX = Math.ceil(Math.random()*8)+1;
    let obstaclePosY = Math.ceil(Math.random()*8)+1;
    console.log(obstaclePosX);
    if (board[obstaclePosX][obstaclePosY] === 0) {
      board[obstaclePosX][obstaclePosY] = 1;
      currentObstacles -= 1;
      obstacleCoordinates.push([obstaclePosX,obstaclePosY]);
    }
  }
  console.log(board);
  console.log(obstacleCoordinates);
}

function updateBoardDisplay() {
  for (let i=0; i<countObstacles; i++) {
    let obstacle = document.createElement("div");
    obstacle.classList.add("obstacle");
    obstacle.style.left = obstacleCoordinates[i][0]*10+"%";
    obstacle.style.top = obstacleCoordinates[i][1]*10+"%";
    gameContainer.appendChild(obstacle);
  }
}




generateRandomBoard();
updateBoardDisplay();


//HANDLE KEYPRESSES

document.addEventListener('keydown', function(event) {
  handleKeyDownEvent(event.key);
});

function updatePositionByPercentage(positionAttribute, amountPercentage) {
  newPositionAttributeValue = (amountPercentage+Number(positionAttribute.split("%")[0]))+"%";
  return newPositionAttributeValue;
}

function handleKeyDownEvent(key) {
  switch (key) {
    case "ArrowLeft":
        // Left pressed
        playerStyle.left = updatePositionByPercentage(playerStyle.left, -10);
        break;
    case "ArrowRight":
        // Right pressed
        playerStyle.left = updatePositionByPercentage(playerStyle.left, 10);
        break;
    case "ArrowUp":
        // Up pressed
        playerStyle.top = updatePositionByPercentage(playerStyle.top, -10);
        break;
    case "ArrowDown":
        // Down pressed
        playerStyle.top = updatePositionByPercentage(playerStyle.top, 10);
        break;
  }
}