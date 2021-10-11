////////// CONSTRUCTING THE GRID
let lives = 3
let score = 0
let intervalRunning = true

const grid = document.querySelector(".grid")

const gridWidth = 12
const gridHeight = 8
const cellCount = gridWidth * gridHeight
console.log(grid)
const cells = []

const spaceRow = Array.from({ length: 12 }).fill("space")
const playerRow = Array.from({ length: 12 }).fill("player")

const gridMap = spaceRow
  .concat(spaceRow)
  .concat(spaceRow)
  .concat(spaceRow)
  .concat(spaceRow)
  .concat(spaceRow)
  .concat(spaceRow)
  .concat(playerRow)

gridMap.forEach((className, i) => {
  const newCell = document.createElement("div")
  grid.appendChild(newCell)
  newCell.classList.add(className)
})
const allGridCells = document.querySelectorAll(".grid div")
console.log(allGridCells)

////////// INITIALISING THE PLAYER

const playerCells = Array.from(allGridCells).filter((cell) =>
  cell.classList.contains("player")
)
const playerStartIndex = playerCells[Math.floor(playerCells.length / 2)]
playerStartIndex.classList.add("active-player")
console.log(playerCells)

let playerIndex = Array.from(playerCells).indexOf(playerStartIndex)

console.log(playerIndex)

////////// PLAYER MOVEMENT

function handleArrowLeft() {
  console.log("handleArrowLeft")
  const leftBoundaryCheck = (playerIndex) => playerIndex === 0
  moveCannon(-1, leftBoundaryCheck)
}

function handleArrowRight() {
  console.log("handleArrowRight")
  const rightBoundaryCheck = (playerIndex) => playerIndex === 11
  moveCannon(1, rightBoundaryCheck)
}

function moveCannon(changeInIndex, boundaryCheck) {
  const newIndex = playerIndex + changeInIndex
  if (boundaryCheck(playerIndex)) {
    console.log("The cannon cannot move any further!")
    return
  }
  move(newIndex)
}

function move(newIndex) {
  playerCells[playerIndex].classList.remove("active-player")
  playerCells[newIndex].classList.add("active-player")
  playerIndex = newIndex
}
document.addEventListener("keydown", function (event) {
  switch (event.key) {
    case "ArrowLeft":
      handleArrowLeft()
      break
    case "ArrowRight":
      handleArrowRight()
      break
    case " ":
      takeAShot()
      break
  }
})

///// INITIALISING THE ALIENS
let rightInterval
let leftInterval
let direction = "right"
let intervalTime = 1000

const spaceCells = Array.from(allGridCells).filter((cell) =>
  cell.classList.contains("space")
)
console.log(spaceCells)

let alienStartIndex = spaceCells[6]
alienStartIndex.classList.add("alien")
let alienIndex = Array.from(spaceCells).indexOf(alienStartIndex)

function moveAliensRight() {
  const newAlienIndex = alienIndex + 1
  console.log(newAlienIndex)
  const rightAlienBoundary = (alienIndex) => (alienIndex + 1) % 12 === 0
  if (rightAlienBoundary(alienIndex)) {
    console.log("aliens hit the right boundary")
    clearInterval(rightInterval)
    setTimeout(moveAliensDown, 100)
    direction = "left"
    switchDirections(direction)
  } else {
    moveAliens(newAlienIndex)
  }
}

function moveAliensLeft() {
  const newAlienIndex = alienIndex - 1
  console.log(newAlienIndex)
  const leftAlienBoundary = (alienIndex) =>
    alienIndex === 0 || alienIndex % 12 === 0
  if (leftAlienBoundary(alienIndex)) {
    console.log("aliens hit the left boundary")
    clearInterval(leftInterval)
    setTimeout(moveAliensDown, 100)
    direction = "right"
    switchDirections(direction)
  } else {
    moveAliens(newAlienIndex)
  }
}
function moveAliensDown() {
  const newAlienIndex = alienIndex + spaceRow.length
  console.log(newAlienIndex)
  if (newAlienIndex >= 72) {
    console.log("Aliens have reached the planet surface! Game Over!")
    direction = "stop"
    switchDirections(direction)
  } else {
    moveAliens(newAlienIndex)
  }
}

function moveAliens(newAlienIndex) {
  const aliensRemaining = (cell) => cell.classList.contains("alien")
  if (spaceCells.some(aliensRemaining)) {
    spaceCells[alienIndex].classList.remove("alien")
    spaceCells[newAlienIndex].classList.add("alien")
    alienIndex = newAlienIndex
  } else {
    resetAliens()
  }
}

function switchDirections(direction) {
  if (direction === "left") {
    leftInterval = setInterval(moveAliensLeft, intervalTime)
  } else if (direction === "right") {
    rightInterval = setInterval(moveAliensRight, intervalTime)
  } else if (direction === "stop") {
    clearInterval(rightInterval)
    clearInterval(leftInterval)
    setTimeout()
  }
}

function resetAliens() {
  spaceCells[alienStartIndex].classList.add("alien")
  alienIndex = alienStartIndex
  direction = "right"
  switchDirections(direction)
}

///// SHOOT INVADERS
let shootIndex = [spaceCells.length - playerIndex]
let shootInterval

function handleShoot() {
  console.log("Shots fired!")
  const newShootIndex = shootIndex - spaceRow.length
  console.log(newShootIndex)
  shooting(newShootIndex)
}
function shooting(newShootIndex) {
  if (newShootIndex < 0) {
    clearInterval(shootInterval)
    console.log("You missed!")
  } else {
    spaceCells[shootIndex].classList.remove("shoot")
    spaceCells[newShootIndex].classList.add("shoot")
    shootIndex = newShootIndex
  }
}

///// GAME TESTING

const startButton = document.querySelector("button")
startButton.addEventListener("click", startGame)

function startGame() {
  direction = "right"
  switchDirections(direction)
}

function takeAShot() {
  shootInterval = setInterval(handleShoot, 100)
}
