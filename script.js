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
startButton.addEventListener("click", startAliensRight)

let interval
let alienIndex = 6
allCells[alienIndex].classList.add("alien")

function moveAliens(indexChange) {
  const rightBoundary = (alienIndex) => (alienIndex + 1) % 12 === 0
  const leftBoundary = (alienIndex) => alienIndex === 0 || alienIndex % 12 === 0
  switch (indexChange) {
    case 1:
      if (rightBoundary(alienIndex)) {
        console.log("Aliens hit the boundary.")
        stopAliens(indexChange)
        return
      }
      break
    case -1:
      if (leftBoundary(alienIndex)) {
        console.log("Aliens hit the boundary.")
        stopAliens(indexChange)
        return
      }
      break
  }
  allCells[alienIndex].classList.remove("alien")
  alienIndex = alienIndex + indexChange
  allCells[alienIndex].classList.add("alien")
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

function stopAliens(indexChange) {
  console.log("Stopping aliens")
  clearInterval(interval)
  allCells[alienIndex].classList.remove("alien")
  alienIndex = alienIndex + row.length
  allCells[alienIndex].classList.add("alien")
  console.log("Aliens moved down.")
  if (indexChange === 1) {
    startAliensLeft()
  } else if (indexChange === -1) {
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
  } else if (allCells[newBullet].classList.contains("alien")) {
    killAlien(newBullet)
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

function killAlien(newBullet) {
  allCells[newBullet].classList.remove("alien")
  stopBullet()
}

function stopBullet() {
  clearInterval(bulletInterval)
  allCells[bulletIndex].classList.remove("bullet")
}

///// BOMB FUNCTION //////////////////////////////////////
startButton.addEventListener("click", startBombing)
let bombing
let bombInterval
let bombIndex

function startBombing() {
  const randomInterval = Math.floor(Math.random() * (5 - 3)) * 1000
  bombing = setInterval(startBomb, 5000)
}

function startBomb() {
  const randomCell = Math.ceil(Math.random() * 12)
  bombIndex = randomCell
  bombInterval = setInterval(function () {
    dropBomb(bombIndex)
  }, 500)
}

function dropBomb(bombIndex) {
  const newBombIndex = bombIndex + row.length
  console.log(newBombIndex)
  if (newBombIndex > allCells.length) {
    stopBomb()
    return
  } else if (allCells[newBombIndex].classList.contains("player")) {
    stopBomb()
    hitPlayer(newBombIndex)
    return
  } else {
    moveBombDown(newBombIndex)
  }
}

function stopBomb() {
  clearInterval(bombInterval)
  allCells[bombIndex].classList.remove("bomb")
}

function hitPlayer(newBombIndex) {
  allCells[newBombIndex].classList.remove("player")
}

function moveBombDown(newBombIndex) {
  allCells[bombIndex].classList.remove("bomb")
  allCells[newBombIndex].classList.add("bomb")
  bombIndex = newBombIndex
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
    case "z":
      startBullet()
      break
  }
})
