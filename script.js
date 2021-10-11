////////// CONSTRUCTING THE GRID

const grid = document.querySelector(".grid")

const gridWidth = 12
const gridHeight = 8
const cellCount = gridWidth * gridHeight
console.log(grid)
const cells = []

const spaceRow = Array.from({ length: 12 }).fill("space")
const playerRow = Array.from({ length: 12 }).fill("player")
const alienRow = [
  "space",
  "space",
  "space",
  "space",
  "space",
  "space",
  "alien",
  "space",
  "space",
  "space",
  "space",
  "space",
]

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
  }
})

///// INITIALISING THE ALIENS
let rightInterval
let leftInterval
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
  const rightAlienBoundary = (alienIndex) => alienIndex % 11 === 0
  if (rightAlienBoundary(alienIndex)) {
    console.log("aliens hit the right grid boundary")
    clearInterval(rightInterval)
    return
  }
  moveAliens(newAlienIndex)
}

function moveAliensLeft() {
  const newAlienIndex = alienIndex - 1
  console.log(newAlienIndex)
  const leftAlienBoundary = (alienIndex) =>
    alienIndex === 0 || alienIndex % 12 === 0
  if (leftAlienBoundary(alienIndex)) {
    console.log("aliens hit the left boundary")
    clearInterval(leftInterval)
    return
  }
  moveAliens(newAlienIndex)
}
function moveAliensDown() {
  const newAlienIndex = alienIndex + spaceRow.length
  console.log(newAlienIndex)

  moveAliens(newAlienIndex)
}

function moveAliens(newAlienIndex) {
  spaceCells[alienIndex].classList.remove("alien")
  spaceCells[newAlienIndex].classList.add("alien")
  alienIndex = newAlienIndex
}

///// GAME TESTING
const startButton = document.querySelector("button")
startButton.addEventListener("click", startGame)

function startGame() {
  rightInterval = setInterval(moveAliensRight, 2000)
}

const leftButton = document.querySelector(".left-button")
leftButton.addEventListener("click", testLeft)

function testLeft() {
  leftInterval = setInterval(moveAliensLeft, 2000)
}

const downButton = document.querySelector(".down-button")
downButton.addEventListener("click", moveAliensDown)
