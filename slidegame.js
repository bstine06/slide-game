

//declare dom element for game

const gameDomElement = document.getElementById("game");


//Board Class

class Board {
  constructor(size, countObstacles) {
    this.size = size;
    this.countObstacles = countObstacles;
    this.obstacles = [];
    this.player = new Item(size, "player");
    this.finish = new Item(size, "finish");
    this.resetToThisState;
  }
  generateRandomBoard() {
    for (let i=0; i<this.countObstacles; i++) {
      let newObstacle = new Item(this.size, "obstacle");
      newObstacle.setXY(this.findRandomUnoccupiedCoordinates());
      this.obstacles.push(newObstacle);
    }
    this.player.setXY(this.findRandomUnoccupiedCoordinates());
    this.finish.setXY(this.findRandomUnoccupiedCoordinates());
    this.resetToThisState = [this.obstacles, this.player.getXY(), this.finish.getXY()];
  }
  // updateBoardDisplay() {
  //   for (let i=0; i<this.obstacles.length; i++) {
  //     let obstacle = document.createElement("div");
  //     obstacle.classList.add("obstacle");
  //     obstacle.style.left = this.getObstacleXYs()[i][0]*(100/this.size)+"%";
  //     obstacle.style.top = this.getObstacleXYs()[i][1]*(100/this.size)+"%";
  //     obstacle.style.width = (100/this.size)+"%";
  //     obstacle.style.height = (100/this.size)+"%";
  //     gameDomElement.appendChild(obstacle);
  //   }
  // }
  findRandomUnoccupiedCoordinates() {
    let randomX = 0;
    let randomY = 0;
    do {
      randomX = Math.floor(Math.random()*this.size);
      randomY = Math.floor(Math.random()*this.size);
    } while (this.getObstacleXYs().filter((e)=>(e[0]===randomX && e[1]===randomY)).length!==0);
    return [randomX,randomY];
  }
  getObstacleXYs(){
    return this.obstacles.map(o => o.getXY());
  }

  reset(){
    this.obstacles = this.resetToThisState[0];
    this.player.setXY(this.resetToThisState[1]);
    this.finish.setXY(this.resetToThisState[2]);
  }

  movePlayerLeft(){
    this.player.setX(this.getObstacleXYs().filter(xy => xy[1] === this.player.getY() && xy[0] < this.player.getX())
                                                .concat([[-1, this.player.getY()]])
                                                .sort((a,b) => (a[0]<b[0]) ? 1 : -1)
                                                [0][0]+1);
  }
  movePlayerRight(){
    this.player.setX(this.getObstacleXYs().filter(xy => xy[1] === this.player.getY() && xy[0] > this.player.getX())
                                                .concat([[this.size, this.player.getY()]])
                                                .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                                                [0][0]-1);
  }
  movePlayerUp(){
    this.player.setY(this.getObstacleXYs().filter(xy => xy[0] === this.player.getX() && xy[1] < this.player.getY())
                                                .concat([[this.player.getX(),-1]])
                                                .sort((a,b) => (a[1]<b[1]) ? 1 : -1)
                                                [0][1]+1);
  }
  movePlayerDown(){
    this.player.setY(this.getObstacleXYs().filter(xy => xy[0] === this.player.getX() && xy[1] > this.player.getY())
                                                .concat([[this.player.getX(),this.size]])
                                                .sort((a,b) => (a[1]>b[1]) ? 1 : -1)
                                                [0][1]-1);
  }
  triggerExplosion(){
    let xRange = [this.player.getX()-1, this.player.getX(), this.player.getX()+1];
    let yRange = [this.player.getY()-1, this.player.getY(), this.player.getY()+1];
    let elementsToDelete = (this.obstacles.filter(o => xRange.includes(o.getX()) && yRange.includes(o.getY())));
    console.log(elementsToDelete);
    elementsToDelete.forEach(item => {
      // Remove the DOM element from its parent
      item.node.parentNode.removeChild(item.node);
      // Delete the JavaScript object
    });
    this.obstacles = (this.obstacles.filter(o => !(xRange.includes(o.getX()) && yRange.includes(o.getY()))));
  }
}


class Item {
  constructor(boardSize, itemType) {
    this.x = 5;
    this.y = 5;
    this.boardSize = boardSize;
    this.node = document.createElement("div");
    this.style = this.node.style;
    this.node.classList.add(itemType);
    gameDomElement.appendChild(this.node);
    this.updateDisplay();
    this.style.width = (100/this.boardSize)+"%";
    this.style.height = (100/this.boardSize)+"%";
  }
  updateDisplay() {
    this.style.left= this.x * (100/this.boardSize) + "%";
    this.style.top = this.y * (100/this.boardSize) + "%";
  }
  setX(x){
    this.x=x;
    this.updateDisplay();
  }
  setY(y){
    this.y=y;
    this.updateDisplay();
  }
  setXY(xyPair){
    this.x=xyPair[0];
    this.y=xyPair[1];
    this.updateDisplay();
  }
  getX(){
    return this.x;
  }
  getY(){
    return this.y;
  }
  getXY(){
    return [this.x, this.y];
  }
}

//HANDLE KEYPRESSES

document.addEventListener('keydown', function(event) {
  handleKeyDownEvent(event.key);
});

function handleKeyDownEvent(key) {
  switch (key) {
    case "ArrowLeft":
        myBoard.movePlayerLeft();
        break;
    case "ArrowRight":
        myBoard.movePlayerRight();
        break;
    case "ArrowUp":
        myBoard.movePlayerUp();
        break;
    case "ArrowDown":
        myBoard.movePlayerDown();
        break;
    case " ":
        myBoard.triggerExplosion();
  }
}


const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", function() {
  myBoard.reset();
});




//Begin game here (generate board and player)

let myBoard = new Board(20, 100);
myBoard.generateRandomBoard();


