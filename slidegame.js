

//declare dom element for game

const gameDomElement = document.getElementById("game");


//Board Class

class Board {
  constructor(size, countObstacles) {
    this.size = size;
    this.countObstacles = countObstacles;
    this.boardArr = Array(this.size).fill().map(() => Array(this.size).fill(0))
    this.obstacleCoordinates = [];
  }
  generateRandomBoard() {
    for (let i=0; i<this.countObstacles; i++) {
      let obstaclePosX = Math.floor(Math.random()*this.size);
      let obstaclePosY = Math.floor(Math.random()*this.size);
      if (this.boardArr[obstaclePosX][obstaclePosY] === 0) {
        this.boardArr[obstaclePosX][obstaclePosY] = 1;
        this.obstacleCoordinates.push([obstaclePosY,obstaclePosX]);
      } else {
        i--;
      }
    }
    gameDomElement.style.height = "100%";
  }
  updateBoardDisplay() {
    for (let i=0; i<this.countObstacles; i++) {
      let obstacle = document.createElement("div");
      obstacle.classList.add("obstacle");
      obstacle.style.left = this.obstacleCoordinates[i][0]*(100/this.size)+"%";
      obstacle.style.top = this.obstacleCoordinates[i][1]*(100/this.size)+"%";
      obstacle.style.width = (100/this.size)+"%";
      obstacle.style.height = (100/this.size)+"%";
      gameDomElement.appendChild(obstacle);
    }
  }
}


//Player class

class Player {
  constructor(x, y, boardSize) {
    this.x = x;
    this.y = y;
    this.boardSize = boardSize;
    this.node = document.createElement("div");
    this.style = this.node.style;
    this.node.classList.add('player');
    gameDomElement.appendChild(this.node);
    this.updateDisplay();
    this.style.width = (100/this.boardSize)+"%";
    this.style.height = (100/this.boardSize)+"%";
  }
  updateDisplay() {
    this.style.top = this.y * (100/this.boardSize) + "%";
    this.style.left= this.x * (100/this.boardSize) + "%";
  }
}


//Item class

class Item {
  constructor(board) {
    this.x=0;
    this.y=0;
    this.boardSize = board.size;
    this.node = document.createElement("div");
    this.style = this.node.style;
    this.node.classList.add('item');
    gameDomElement.appendChild(this.node);
    this.style.width = (100/this.boardSize)+"%";
    this.style.height= (100/this.boardSize)+"%";
    this.findRandomPlacement(board.obstacleCoordinates);
  }
  findRandomPlacement(obstacleCoordinates) {
    do {
      this.x = Math.floor(Math.random()*this.boardSize);
      this.y = Math.floor(Math.random()*this.boardSize);
    } while (obstacleCoordinates.includes([this.x,this.y]));
    this.style.top = this.y * (100/this.boardSize) + "%";
    this.style.left = this.x * (100/this.boardSize) + "%";
  }
}


//HANDLE KEYPRESSES

document.addEventListener('keydown', function(event) {
  handleKeyDownEvent(event.key);
});

function handleKeyDownEvent(key) {
  switch (key) {
    case "ArrowLeft":
        // Left pressed
        try {
          player.x = (myBoard.obstacleCoordinates.filter((xyPair)=>(xyPair[1]===player.y)&&(xyPair[0]<player.x))
                                       .sort((a,b) => (a[0]<b[0]) ? 1 : -1)
                                       [0])[0]+1;
        } catch (e) {
          if (e instanceof TypeError) player.x = 0;
        }
        break;
    case "ArrowRight":
        // Right pressed
        try {
          player.x = (myBoard.obstacleCoordinates.filter((xyPair)=>(xyPair[1]===player.y)&&(xyPair[0]>player.x))
                                       .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                                       [0])[0]-1;
        } catch (e) {
          if (e instanceof TypeError) player.x = myBoard.size-1;
        }
        break;
    case "ArrowUp":
        // Up pressed
        try {
          player.y = (myBoard.obstacleCoordinates.filter((xyPair)=>(xyPair[0]===player.x)&&(xyPair[1]<player.y))
                                       .sort((a,b) => (a[1]<b[1]) ? 1 : -1)
                                       [0])[1]+1;
        } catch (e) {
          if (e instanceof TypeError) player.y = 0;
        }
        break;
    case "ArrowDown":
        // Down pressed
        try {
          player.y = (myBoard.obstacleCoordinates.filter((xyPair)=>(xyPair[0]===player.x)&&(xyPair[1]>player.y))
                                       .sort((a,b) => (a[1]>b[1]) ? 1 : -1)
                                       [0])[1]-1;
        } catch (e) {
          if (e instanceof TypeError) player.y = myBoard.size-1;
        }
        
        break;
  }
  player.updateDisplay();
}




//Begin game here (generate board and player)

let myBoard = new Board(40, 500);
myBoard.generateRandomBoard();
myBoard.updateBoardDisplay();

let player = new Player(5,5, myBoard.size, myBoard.size);
const item1 = new Item(myBoard);

const resetBtn = document.querySelector("#reset-btn");

resetBtn.addEventListener("click", function() {
  player.x = 5;
  player.y = 5;
  player.updateDisplay();
});