import { Board } from './modules/board.js';

//declare dom element for game

const gameDomElement = document.getElementById("game");

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


