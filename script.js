const grid = document.querySelector(".grid")
const startButton = document.querySelector("button")

let lives = 3
let score = 0
let playerIndex

////////// CONSTRUCTING THE GRID

const gridWidth = 12
const gridHeight = 8
const cellCount = gridWidth * gridHeight

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

const allCells = Array.from(document.querySelectorAll(".grid div"))
console.log(allCells)

////////// INITIALISING THE PLAYER //////////////////////////////////////

const playerStart = allCells[allCells.length - row.length / 2]
playerStart.classList.add("player")
playerIndex = allCells.indexOf(playerStart)

function handleArrowLeft() {
  console.log("handleArrowLeft")
  const leftBoundaryCheck = (playerIndex) =>
    playerIndex <= allCells.length - row.length
  moveCannon(-1, leftBoundaryCheck)
}

function handleArrowRight() {
  console.log("handleArrowRight")
  const rightBoundaryCheck = (playerIndex) => playerIndex >= allCells.length - 1
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
  allCells[playerIndex].classList.remove("player")
  allCells[newIndex].classList.add("player")
  playerIndex = newIndex
}

///// INITIALISING THE ALIENS //////////////////////////////////////

let interval
let alienIndex = 6
allCells[alienIndex].classList.add("alien")

function moveAliens(indexChange) {
  const newAlienIndex = alienIndex + indexChange
  const boundaries = (alienIndex) =>
    (alienIndex + 1) % 12 === 0 || alienIndex === 0 || alienIndex % 12 === 0

  if (boundaries(alienIndex)) {
    console.log("Aliens hit the boundary.")
    stopAliens(alienIndex)
    return
  }
  allCells[alienIndex].classList.remove("alien")
  allCells[newAlienIndex].classList.add("alien")
  alienIndex = newAlienIndex
  console.log(alienIndex)
}

function startAliensRight() {
  interval = setInterval(function () {
    moveAliens(1)
  }, 1000)
}

function startAliensLeft() {
  interval = setInterval(function () {
    moveAliens(-1)
  }, 1000)
}

function stopAliens(alienIndex) {
  console.log("Stopping aliens")
  clearInterval(interval)
  if ((alienIndex + 1) % 12 === 0) {
    startAliensLeft()
  } else {
    startAliensRight()
  }
}

///// BULLET FUNCTIONS //////////////////////////////////////

let bulletIndex
let bulletInterval

function startBullet() {
  bulletIndex = playerIndex
  bulletInterval = setInterval(function () {
    moveBullet(bulletIndex)
  }, 100)
}

function moveBullet(bulletIndex) {
  let newBullet = bulletIndex - row.length
  console.log(newBullet)
  if (newBullet <= 0) {
    stopBullet()
    return
  } else if (allCells[bulletIndex].classList.contains("alien")) {
    killAlien(bulletIndex)
    return
  } else {
    moveBulletUp(newBullet)
  }
}

function moveBulletUp(newBullet) {
  allCells[bulletIndex].classList.remove("bullet")
  allCells[newBullet].classList.add("bullet")
  bulletIndex = newBullet
}

function killAlien(bulletIndex) {
  allCells[bulletIndex].classList.remove("alien")
  allCells[bulletIndex].classList.remove("bullet")
}

function stopBullet() {
  clearInterval(bulletInterval)
  allCells[bulletIndex].classList.remove("bullet")
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
      startBullet()
      break
  }
})

startButton.addEventListener("click", startAliensRight)
