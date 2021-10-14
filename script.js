const grid = document.querySelector(".grid")
const startButton = document.querySelector(".start")
const scoreSpan = document.querySelector(".score span")
const livesImages = document.querySelector(".lives-container")
const levelSpan = document.querySelector(".level span")
const oneLIfe = document.querySelector("#one-life")
const twoLives = document.querySelector("#two-lives")
const threeLives = document.querySelector("#three-lives")
const gameOverPopup = document.querySelector(".gameover-container")
const finalScore = document.querySelector(".final-score")
const playAgain = document.querySelector(".play-again")

let lives = 3
let score = 0
let level = 1
let playerIndex

scoreSpan.innerHTML = score
levelSpan.innerHTML = level
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
const alienStart = [4, 6, 8, 15, 17, 19]
let alienIndex = [4, 6, 8, 15, 17, 19]
alienIndex.forEach((alien) => allCells[alien].classList.add("alien"))

function moveAliens(indexChange) {
  const rightBoundary = (alienIndex) => (alienIndex + 1) % 12 === 0
  const leftBoundary = (alienIndex) => alienIndex === 0 || alienIndex % 12 === 0
  switch (indexChange) {
    case 1:
      if (alienIndex.some(rightBoundary)) {
        stopAliens(indexChange)
        return
      }
      break
    case -1:
      if (alienIndex.some(leftBoundary)) {
        stopAliens(indexChange)
        return
      }
      break
  }
  for (let i = 0; i < alienIndex.length; i++) {
    allCells[alienIndex[i]].classList.remove("alien")
    alienIndex[i] = alienIndex[i] + indexChange
    allCells[alienIndex[i]].classList.add("alien")
  }
}

function stopAliens(indexChange) {
  clearInterval(interval)
  moveAliensDown()
  indexChange === 1 ? startAliensLeft() : startAliensRight()
}

function moveAliensDown() {
  for (let i = 0; i < alienIndex.length; i++) {
    allCells[alienIndex[i]].classList.remove("alien")
    alienIndex[i] = alienIndex[i] + row.length
    allCells[alienIndex[i]].classList.add("alien")
  }
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
  alienIndex.splice(alienIndex.indexOf(newBullet), 1)
  stopBullet()
  score += 30
  scoreSpan.innerHTML = score
  if (!allCells.some((cell) => cell.classList.contains("alien"))) {
    level++
    newAlienWave(level)
    levelSpan.innerHTML = level
  }
}

function stopBullet() {
  clearInterval(bulletInterval)
  allCells[bulletIndex].classList.remove("bullet")
}

function newAlienWave(level) {
  clearInterval(interval)
  clearInterval(bombing)
  alienIndex = alienStart
  startAliensRight()
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
  playerIndex = allCells.indexOf(playerStart)
  allCells[playerIndex].classList.add("player")
  lives--
  loseLife()
}

function moveBombDown(newBombIndex) {
  allCells[bombIndex].classList.remove("bomb")
  allCells[newBombIndex].classList.add("bomb")
  bombIndex = newBombIndex
}

function loseLife() {
  if (lives === 2) {
    threeLives.classList.add("hidden")
  } else if (lives === 1) {
    twoLives.classList.add("hidden")
  } else if (lives === 0) {
    gameOver()
  }
}

///// GAME OVER FUNCTION //////////////////////////////////////
playAgain.addEventListener("click", () => document.location.reload())

function gameOver() {
  clearInterval(interval)
  clearInterval(bombing)
  gameOverPopup.classList.remove("hidden")
  finalScore.innerHTML = score
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
