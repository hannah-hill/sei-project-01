const grid = document.querySelector(".grid")
const startButton = document.querySelector("button")

let lives = 3
let score = 0
let playerIndex

////////// CONSTRUCTING THE GRID

const gridWidth = 12
const gridHeight = 8
const cellCount = gridWidth * gridHeight
console.log(grid)
const cells = []

// const row = Array.from({ length: 12 }).fill("space")
// const playerRow = Array.from({ length: 12 }).fill("player")
const row = Array.from({ length: 12 }).fill("space")
const gridMap = row
  .concat(row)
  .concat(row)
  .concat(row)
  .concat(row)
  .concat(row)
  .concat(row)
  .concat(row)

gridMap.forEach((className, i) => {
  const newCell = document.createElement("div")
  grid.appendChild(newCell)
  newCell.classList.add(className, i)
})
const allGridCells = Array.from(document.querySelectorAll(".grid div"))
console.log(allGridCells)

////////// INITIALISING THE PLAYER //////////////////////////////////////

const playerStart = allGridCells[allGridCells.length - row.length / 2]
playerStart.classList.add("player")
playerIndex = allGridCells.indexOf(playerStart)

////////// PLAYER MOVEMENT //////////////////////////////////////

function handleArrowLeft() {
  console.log("handleArrowLeft")
  const leftBoundaryCheck = (playerIndex) =>
    playerIndex <= allGridCells.length - row.length
  moveCannon(-1, leftBoundaryCheck)
}

function handleArrowRight() {
  console.log("handleArrowRight")
  const rightBoundaryCheck = (playerIndex) =>
    playerIndex >= allGridCells.length - 1
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
  allGridCells[playerIndex].classList.remove("player")
  allGridCells[newIndex].classList.add("player")
  playerIndex = newIndex
}

///// INITIALISING THE ALIENS //////////////////////////////////////

let rightInterval
let leftInterval
let direction = "right"
let intervalTime = 1000

let alienStart = allGridCells[6]
alienStart.classList.add("alien")
let alienIndex = allGridCells.indexOf(alienStart)

function moveAliensRight() {
  const newAlienIndex = alienIndex + 1
  console.log("moveAliensRight triggered " + newAlienIndex)
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
  console.log("moveAliensLeft triggered " + newAlienIndex)
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
  const newAlienIndex = alienIndex + row.length
  console.log("MoveAliensDown triggered " + newAlienIndex)
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
  if (allGridCells.some(aliensRemaining)) {
    allGridCells[alienIndex].classList.remove("alien")
    allGridCells[newAlienIndex].classList.add("alien")
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
  allGridCells[alienStart].classList.add("alien")
  alienIndex = alienStart
  direction = "right"
  switchDirections(direction)
}

///// bullet INVADERS //////////////////////////////////////
let bulletIndex = [playerIndex]
let bulletInterval

function handleBullet() {
  const newbulletIndex = bulletIndex - row.length
  console.log(newbulletIndex)
  moveBullet(newbulletIndex)
}

function moveBullet(newbulletIndex) {
  if (newbulletIndex < 0) {
    clearInterval(bulletInterval)
    console.log("You missed!")
    allGridCells[bulletIndex].classList.remove("bullet")
    bulletIndex = [playerIndex - row.length]
    return
  } else if (allGridCells[newbulletIndex].classList.contains("alien")) {
    console.log("Alien terminated.")
    clearInterval(bulletInterval)
    allGridCells[newbulletIndex].classList.remove("alien")
    allGridCells[bulletIndex].classList.remove("bullet")
    bulletIndex = [playerIndex - row.length]
    return
  } else {
    console.log("Shots fired!")
    allGridCells[bulletIndex].classList.remove("bullet")
    allGridCells[newbulletIndex].classList.add("bullet")
    bulletIndex = newbulletIndex
    return
  }
}

///// GAME TESTING //////////////////////////////////////
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

startButton.addEventListener("click", startGame)

function startGame() {
  direction = "right"
  switchDirections(direction)
}

function takeAShot() {
  bulletInterval = setInterval(handleBullet, 100)
}
