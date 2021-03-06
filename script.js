const grid = document.querySelector(".grid")
const main = document.querySelector("main")
const startButton = document.querySelector(".start")
const startContainer = document.querySelector(".start-game-container")
const scoreSpan = document.querySelector(".score span")
const livesImages = document.querySelector(".lives-container")
const levelSpan = document.querySelector(".level span")
const oneLIfe = document.querySelector("#one-life")
const twoLives = document.querySelector("#two-lives")
const threeLives = document.querySelector("#three-lives")
const gameOverPopup = document.querySelector(".gameover-container")
const finalScore = document.querySelector(".final-score")
const playAgain = document.querySelector(".play-again")
const bulletAudio = document.querySelector(".bullet-audio")
const bombAudio = document.querySelector(".bomb-audio")
const gameoverAudio = document.querySelector(".gameover-audio")

let lives = 3
let score = 0
let level = 1
let playerIndex

scoreSpan.innerHTML = score
levelSpan.innerHTML = level

startButton.addEventListener("click", startGame)

function startGame() {
  startContainer.classList.add("hidden")
  main.classList.remove("hidden")
  startAliensRight()
  startBombing()
}

////////// CONSTRUCTING THE GRID //////////////////////////////////////
const row = Array.from({ length: 19 }).fill("space")
const gridMap = row
  .concat(row)
  .concat(row)
  .concat(row)
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

////////// INITIALISING THE PLAYER //////////////////////////////////////

const playerStart = allCells[199]
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

///// ALIENS //////////////////////////////////////

let interval
let intervalSpeed = 1000
const alienStart = [
  3, 5, 7, 9, 11, 13, 15, 23, 25, 27, 29, 31, 33, 41, 43, 45, 47, 49, 51, 53,
  61, 63, 65, 67, 69, 71,
]
// const alienStart = [5, 7, 9, 11, 13]
let alienIndex = Array.from(alienStart)
alienIndex.forEach((alien) => allCells[alien].classList.add("alien"))

function moveAliens(indexChange) {
  const rightBoundary = (alienIndex) => (alienIndex + 1) % 19 === 0
  const leftBoundary = (alienIndex) => alienIndex === 0 || alienIndex % 19 === 0
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
  if (alienIndex.some((alien) => alien > 189)) {
    gameOver()
    return
  }
}

function startAliensRight() {
  interval = setInterval(function () {
    moveAliens(1)
  }, intervalSpeed)
}

function startAliensLeft() {
  interval = setInterval(function () {
    moveAliens(-1)
  }, intervalSpeed)
}
///// BULLET FUNCTIONS //////////////////////////////////////
let newBullet
let bulletIndex
let bulletInterval

function startBullet() {
  if (allCells.some((cell) => cell.classList.contains("bullet"))) {
    return
  }
  bulletIndex = playerIndex
  bulletAudio.play()
  bulletInterval = setInterval(function () {
    moveBullet(bulletIndex)
  }, 100)
}

function moveBullet(bulletIndex) {
  newBullet = bulletIndex - row.length
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

function stopBullet() {
  clearInterval(bulletInterval)
  allCells[bulletIndex].classList.remove("bullet")
}

function killAlien(newBullet) {
  allCells[newBullet].classList.remove("alien")
  alienIndex.splice(alienIndex.indexOf(newBullet), 1)
  stopBullet()
  score += 30
  scoreSpan.innerHTML = score
  if (!allCells.some((cell) => cell.classList.contains("alien"))) {
    level++
    newAlienWave()
    levelSpan.innerHTML = level
  }
}

function newAlienWave() {
  clearInterval(interval)
  clearInterval(bulletInterval)
  clearInterval(bombing)
  intervalSpeed = intervalSpeed * 0.8
  alienIndex = Array.from(alienStart)
  startAliensRight()
  startBombing()
}

///// BOMB FUNCTION //////////////////////////////////////
let bombing
let bombInterval
let bombIndex

function startBombing() {
  bombing = setInterval(startBomb, 3000)
}

function startBomb() {
  const randomCell = Math.ceil(Math.random() * 19)
  bombIndex = randomCell
  bombAudio.play()
  bombInterval = setInterval(function () {
    dropBomb(bombIndex)
  }, 200)
}

function dropBomb(bombIndex) {
  const newBombIndex = bombIndex + row.length
  if (newBombIndex >= allCells.length) {
    stopBomb()
    return
  } else if (allCells[newBombIndex].classList.contains("player")) {
    stopBomb()
    hitPlayer(newBombIndex)
    return
  } else if (allCells[newBombIndex].classList.contains("blockade")) {
    stopBomb()
    hitBlockade(newBombIndex)
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

///// BLOCKADES //////////////////////////////////////
const blockades = [173, 174, 175, 179, 180, 181, 185, 186, 187]
blockades.forEach((cell) => allCells[cell].classList.add("blockade"))
blockades.forEach((cell) => allCells[cell].classList.add("undamaged"))

function hitBlockade(index) {
  if (allCells[index].classList.contains("undamaged")) {
    allCells[index].classList.remove("undamaged")
    allCells[index].classList.add("damaged")
  } else if (allCells[index].classList.contains("damaged")) {
    allCells[index].classList.remove("damaged")
    allCells[index].classList.remove("blockade")
  }
}

///// GAME OVER FUNCTION //////////////////////////////////////
playAgain.addEventListener("click", () => document.location.reload())

function gameOver() {
  clearInterval(interval)
  clearInterval(bombing)
  gameoverAudio.play()
  gameOverPopup.classList.remove("hidden")
  finalScore.innerHTML = score
}

///// EVENT LISTENERS //////////////////////////////////////
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
