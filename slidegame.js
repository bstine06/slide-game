

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


  movePlayerLeft(){
    let newX = (this.getObstacleXYs().filter(xy => xy[1] === this.player.getY() && xy[0] < this.player.getX())
                                                .concat([[-1, this.player.getY()]])
                                                .sort((a,b) => (a[0]<b[0]) ? 1 : -1)
                                                [0][0]+1);
    if (this.finish.getY() === this.player.getY()) {
      if (this.isBetween(this.finish.getX(), newX, this.player.getX())) {
        newX = this.finish.getX();
        this.finishLevel();
      }
    }
    this.player.setX(newX);
  }
  movePlayerRight(){
    let newX = (this.getObstacleXYs().filter(xy => xy[1] === this.player.getY() && xy[0] > this.player.getX())
                                                .concat([[this.size, this.player.getY()]])
                                                .sort((a,b) => (a[0]>b[0]) ? 1 : -1)
                                                [0][0]-1);
    if (this.finish.getY() === this.player.getY()) {
      if (this.isBetween(this.finish.getX(), this.player.getX(), newX)) {
        newX = this.finish.getX();
        this.finishLevel();
      }
    }
    this.player.setX(newX);
  }
  movePlayerUp(){
    let newY = (this.getObstacleXYs().filter(xy => xy[0] === this.player.getX() && xy[1] < this.player.getY())
                                                .concat([[this.player.getX(),-1]])
                                                .sort((a,b) => (a[1]<b[1]) ? 1 : -1)
                                                [0][1]+1);
    if (this.finish.getX() === this.player.getX()) {
      if (this.isBetween(this.finish.getY(), newY, this.player.getY())) {
        newY = this.finish.getY();
        this.finishLevel();
      }
    }
    this.player.setY(newY);
  }
  movePlayerDown(){
    let newY = (this.getObstacleXYs().filter(xy => xy[0] === this.player.getX() && xy[1] > this.player.getY())
                                                .concat([[this.player.getX(),this.size]])
                                                .sort((a,b) => (a[1]>b[1]) ? 1 : -1)
                                                [0][1]-1);
    if (this.finish.getX() === this.player.getX()) {
      if (this.isBetween(this.finish.getY(), this.player.getY(), newY)) {
        newY = this.finish.getY();
        this.finishLevel();
      }
    }
    this.player.setY(newY);
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
    case "b":
        myBoard.triggerExplosion();
        break;
    case "r":
        myBoard.reset();
  }
}


const resetBtn = document.querySelector("#reset-btn");
resetBtn.addEventListener("click", function() {
  myBoard.reset();
});




//Begin game here (generate board and player)

let myBoard = new Board(20, 100);
myBoard.generateRandomBoard();


