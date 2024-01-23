
//GENERATE PLAYER ELEMENT AND NODE ON BOARD

const playerNode = document.createElement("div");
let playerNodeStyle = playerNode.style;
let gameContainer = document.getElementById("game-container");

playerNode.classList.add('player');
gameContainer.appendChild(playerNode);

//create player object for backend logic that changes based on keypress.
//playerNode (visual representation) will update based on changes to backend object!
class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
const player = new Player(0,0);

//BOARD GENERATION

const BOARD_SIZE = 10;
let countObstacles = 10;
let obstacleCoordinates = [];
let board = Array(BOARD_SIZE).fill().map(() => Array(BOARD_SIZE).fill(0))

function generateRandomBoard() {
  let currentObstacles = countObstacles;
  while (currentObstacles > 0) {
    let obstaclePosX = Math.floor(Math.random()*10);
    let obstaclePosY = Math.floor(Math.random()*10);
    if (board[obstaclePosX][obstaclePosY] === 0) {
      board[obstaclePosX][obstaclePosY] = 1;
      currentObstacles -= 1;
      obstacleCoordinates.push([obstaclePosY,obstaclePosX]);
    }
  }
  obstacleCoordinates.sort(sortFunction);
}

function sortFunction(a, b) {
    if (a[0] === b[0]) {
        return 0;
    }
    else {
        return (a[0] < b[0]) ? -1 : 1;
    }
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

function updatePositionToCoordinates(positionAttribute, coordinate) {
  return positionAttribute = coordinate*10 + "%";
}

function handleKeyDownEvent(key) {
  switch (key) {
    case "ArrowLeft":
        // Left pressed
        playerNodeStyle.left = updatePositionByPercentage(playerNodeStyle.left, -10);
        break;
    case "ArrowRight":
        // Right pressed
        let targetCoordinates = 
                      (obstacleCoordinates.filter((xyPair)=>(xyPair[1]===player.y)&&(xyPair[0]>player.x))
                                          .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                                          [0]);
        let destinationX = targetCoordinates[0]-1;
        player.x = destinationX;
        playerNodeStyle.left = updatePositionToCoordinates(playerNodeStyle.left, destinationX);
        break;
    case "ArrowUp":
        // Up pressed
        playerNodeStyle.top = updatePositionByPercentage(playerNodeStyle.top, -10);
        break;
    case "ArrowDown":
        // Down pressed
        player.y += 1;
        playerNodeStyle.top = updatePositionByPercentage(playerNodeStyle.top, 10);
        break;
  }
}