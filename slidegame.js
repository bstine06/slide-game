

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
      let lightness = Math.floor(Math.random() * 20 + 40);
      newObstacle.style.backgroundColor = `hsl(0,0%,${lightness}%)`;
      newObstacle.style.zIndex = i+3;
      newObstacle.setXY(this.findRandomUnoccupiedCoordinates());
      this.obstacles.push(newObstacle);
    }
    this.player.setXY(this.findRandomUnoccupiedCoordinates());
    this.player.style.zIndex = 2;
    this.finish.setXY(this.findRandomUnoccupiedCoordinates());
    this.finish.style.zIndex = 1;
    this.resetToThisState = [this.obstacles, this.player.getXY(), this.finish.getXY()];
  }




  findAvailableMoves(currentXY, board) {
    let availableMoves = [];
    availableMoves.push(this.findLeftMoveDestination(currentXY));
    availableMoves.push(this.findRightMoveDestination(currentXY));
    availableMoves.push(this.findUpMoveDestination(currentXY));
    availableMoves.push(this.findDownMoveDestination(currentXY));
    availableMoves = availableMoves.filter(xy => !xy.every((value, index) => value === currentXY[index]));
    console.table(availableMoves);
  }


  findLeftMoveDestination(currentXY) {
    return [this.getObstacleXYs().concat([[this.finish.getX()-1, this.finish.getY()]])
                          .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] < currentXY[0])
                          .concat([[-1, currentXY[1]]])
                          .sort((a,b) => (a[0]<b[0]) ? 1 : -1)
                          [0][0]+1,currentXY[1]];
  }
  findRightMoveDestination(currentXY) {
    return [this.getObstacleXYs().concat([[this.finish.getX()+1, this.finish.getY()]])
                          .filter(obstacleXY => obstacleXY[1] === currentXY[1] && obstacleXY[0] > currentXY[0])
                          .concat([[this.size, currentXY[1]]])
                          .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                          [0][0]-1,currentXY[1]];
  }
  findUpMoveDestination(currentXY) {
    return [currentXY[0], this.getObstacleXYs().concat([[this.finish.getX(), this.finish.getY()-1]])
                          .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] < currentXY[1])
                          .concat([[currentXY[0], -1]])
                          .sort((a,b) => (a[1]<b[1]) ? 1 : -1)
                          [0][1]+1];
  }
  findDownMoveDestination(currentXY) {
    return [currentXY[0], this.getObstacleXYs().concat([[this.finish.getX(), this.finish.getY()+1]])
                          .filter(obstacleXY => obstacleXY[0] === currentXY[0] && obstacleXY[1] > currentXY[1])
                          .concat([[currentXY[0], this.size]])
                          .sort((a,b) => (a[1]>b[1]) ? 1 : -1)
                          [0][1]-1];
  }




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
    this.obstacles.filter(o => o.node.parentNode===null).forEach(o => {
      o.displayWithAnimation();
    });
    this.player.setXY(this.resetToThisState[1]);
    this.player.node.classList.remove("player-wins");
    this.player.node.style.backgroundColor = "red";
    this.finish.setXY(this.resetToThisState[2]);
  }
  finishLevel(){
    if (this.player.getX() !== this.finish.getX() || this.player.getY() !== this.finish.getY()) return;
    setTimeout(()=>{
      this.animateFinish();
      //this.clearBoard();
      this.displayPostGame();
    }, "280");
  }
  clearBoard(){
    this.obstacles.forEach(o => o.eraseWithAnimation());
    this.player.eraseWithAnimation();
    this.finish.eraseWithAnimation();
    this.obstacles = [];
  }
  displayPostGame(){
    console.log("POSTGAME");
  }
  animateFinish(){
    this.player.style.backgroundColor = "rgb(26, 175, 26)";
    this.player.node.classList.add('player-wins');
    
    // setTimeout(()=>{
    //   this.player.node.classList.remove("player-wins");
    // }, "4000");
  }

  isBetween(number, lowerBound, upperBound) {
    return (number >= lowerBound && number <= upperBound);
  }
  triggerExplosion(){
    let xRange = [this.player.getX()-1, this.player.getX(), this.player.getX()+1];
    let yRange = [this.player.getY()-1, this.player.getY(), this.player.getY()+1];
    this.obstacles.filter(o => xRange.includes(o.getX()) && yRange.includes(o.getY())).forEach(o => o.eraseWithAnimation());
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
    this.displayWithAnimation();
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
  eraseWithAnimation(){
    this.node.classList.add("outgoing-animation");
    setTimeout(() => {
      this.node.parentNode.removeChild(this.node);
      this.node.classList.remove("outgoing-animation");
    }, "280");
  }
  displayWithAnimation(){
    this.node.classList.add("incoming-animation");
    gameDomElement.appendChild(this.node);
    setTimeout(() => {
      this.node.classList.remove("incoming-animation");
    }, "280");
  }
}

//HANDLE KEYPRESSES

document.addEventListener('keydown', function(event) {
  handleKeyDownEvent(event.key);
});

function handleKeyDownEvent(key) {
  switch (key) {
    case "ArrowLeft":
    case "a":
      myBoard.player.setXY(myBoard.findLeftMoveDestination(myBoard.player.getXY()));
      myBoard.finishLevel();
      break;
    case "ArrowRight":
    case "d":
      myBoard.player.setXY(myBoard.findRightMoveDestination(myBoard.player.getXY()));
      myBoard.finishLevel();
      break;
    case "ArrowUp":
    case "w":
      myBoard.player.setXY(myBoard.findUpMoveDestination(myBoard.player.getXY()));
      myBoard.finishLevel();
      break;
    case "ArrowDown":
    case "s":
      myBoard.player.setXY(myBoard.findDownMoveDestination(myBoard.player.getXY()));
      myBoard.finishLevel();
      break;
    case "b":
      myBoard.triggerExplosion();
      break;
    case "r":
      myBoard.reset();
    case "i":
      console.log("INFO:");
      console.log("AVAILABLE MOVES:");
      myBoard.findAvailableMoves(myBoard.player.getXY(),myBoard);
  }
}


const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", function() {
  myBoard.reset();
});




//Begin game here (generate board and player)

let myBoard = new Board(20, 100);
myBoard.generateRandomBoard();


