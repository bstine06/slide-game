
const player = document.createElement("div");
let playerStyle = player.style;
let gameContainer = document.getElementById("game-container");

player.classList.add('player');
gameContainer.appendChild(player);

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