document.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))
  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  const width = 10
  let nextRandom = 0
  let timerId
  let score = 0
  const colors = [
    'orange',
    'red',
    'blue',
    'purple',
    'green',
    'pink',
    'yellow'
  ]
  let difficulty
  let difficultyNoted = false

  const lTetromino = [
    [width, width+1, width+2, 2],
    [1, width+1, width*2+1, width*2+2],
    [width, width+1, width+2, width*2],
    [0, 1, width+1, width*2+1]
  ]

  const zTetromino = [
    [0, 1, width+1, width+2],
    [2, width+1, width+2, width*2+1],
    [width, width+1, width*2+1, width*2+2],
    [1, width, width+1, width*2]
  ]

  const tTetromino = [
    [1, width, width+1, width+2],
    [1, width+1, width+2, width*2+1],
    [width, width+1, width+2, width*2+1],
    [1, width, width+1, width*2+1]
  ]

  const oTetromino = [
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2],
    [1, 2, width+1, width+2]
  ]

  const iTetromino = [
    [width, width+1, width+2, width+3],
    [2, width+2, width*2+2, width*3+2],
    [width*2, width*2+1, width*2+2, width*2+3],
    [1, width+1, width*2+1, width*3+1]
  ]

  const sTetromino = [
    [1, 2, width, width+1],
    [1, width+1, width+2, width*2+2],
    [width+1, width+2, width*2, width*2+1],
    [0, width, width+1, width*2+1]
  ]

  const jTetromino = [
    [0, width, width+1, width+2],
    [1, 2, width+1, width*2+1],
    [width, width+1, width+2, width*2+2],
    [1, width+1, width*2, width*2+1]
  ]


  const theTetrominoes = [lTetromino, zTetromino, tTetromino, oTetromino, iTetromino, sTetromino, jTetromino]

  let currentPosition = 4
  let currentRotation = 0

  //rondomly select a tetromino
  let random = Math.floor(Math.random()*theTetrominoes.length)
  let current = theTetrominoes[random][currentRotation]


  //draw the tetromino
  function draw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.add('tetromino')
      squares[currentPosition + index].style.backgroundColor = colors[random]
    })
  }

  //undraw the tetromino
  function undraw(){
    current.forEach(index => {
      squares[currentPosition + index].classList.remove('tetromino')
      squares[currentPosition + index].style.backgroundColor = ''
    })
  }


  //assign functions to keyCodes
  function control(e){
    if(e.keyCode === 37){
      moveLeft()
    } else if (e.keyCode === 38){
      rotate()
    } else if (e.keyCode === 39){
      moveRight()
    } else if (e.keyCode === 40){
      moveDown()
    }
  }
  // document.addEventListener('keyup', control)

  //move down function
  function moveDown(){
    undraw()
    currentPosition+=width
    draw()
    freeze()
  }

  //freeze function
  function freeze(){
    if(current.some(index => squares[currentPosition + index + width].classList.contains('taken'))){
      current.forEach(index => squares[currentPosition + index].classList.add('taken'))
      //start a new tetromino falling
      random = nextRandom
      nextRandom = Math.floor(Math.random()*theTetrominoes.length)
      current = theTetrominoes[random][currentRotation]
      currentPosition = 4
      draw()
      displayShape()
      addScore()
      gameOver()
    }
  }

  //move the tetromino left, unless its at the left edge
  function moveLeft(){
    undraw()
    const isAtLeftEdge = current.some(index => (currentPosition+index) % width === 0)
    if(!isAtLeftEdge) currentPosition -= 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition += 1
    }

    draw()
  }

  //move the tetromino right, unless its at the right edge
  function moveRight(){
    undraw()
    const isAtRightEdge = current.some(index => (currentPosition+index) % width === width-1)
    if(!isAtRightEdge) currentPosition += 1

    if(current.some(index => squares[currentPosition + index].classList.contains('taken'))){
      currentPosition -= 1
    }

    draw()
  }

  //rotate the tetromino
  function rotate(){
    undraw()
    currentRotation ++
    if (currentRotation === current.length){
      currentRotation = 0
    }
    current = theTetrominoes[random][currentRotation]
    const isAtLeftEdge = current.some(index => (currentPosition+index) % width === 0)
    const isAtRightEdge = current.some(index => (currentPosition+index) % width === width-1)
    const isAtBase = current.some(index => squares[currentPosition + index + width].classList.contains('taken'))
    if(isAtLeftEdge || isAtRightEdge || isAtBase){
      currentRotation --
      if (currentRotation === -1){
        currentRotation = 3
      }
      current = theTetrominoes[random][currentRotation]
    }
    draw()
  }

  //show up-next tetromino in mini-grid display
  const displaySquares = document.querySelectorAll('.mini-grid div')
  const displayWidth = 4
  const displayIndex = 0

  //the Tetrominos without rotations
  const upNextTetrominoes = [
    [displayWidth, displayWidth+1, displayWidth+2, 2],
    [0, 1, displayWidth+1, displayWidth+2],
    [1, displayWidth, displayWidth+1, displayWidth+2],
    [1, 2, displayWidth+1, displayWidth+2],
    [displayWidth, displayWidth+1, displayWidth+2, displayWidth+3],
    [1, 2, displayWidth, displayWidth+1],
    [0, displayWidth, displayWidth+1, displayWidth+2],
  ]

  //display the shape in the mini-grid display
  function displayShape(){
    //remove any trace of a tetromino from the mini-grid
    displaySquares.forEach(square => {
      square.classList.remove('tetromino')
      square.style.backgroundColor = ''
    })
    upNextTetrominoes[nextRandom].forEach(index=>{
      displaySquares[displayIndex + index].classList.add('tetromino')
      displaySquares[displayIndex + index].style.backgroundColor = colors[nextRandom]
    })
  }

  function startGame(){
    if (timerId){
      document.removeEventListener('keyup', control)
      clearInterval(timerId)
      timerId = null
    } else {
      if(!difficultyNoted){
        var ele = document.getElementsByName('level')
        for (i=0; i<ele.length; i++){
          if(ele[i].checked) difficulty = ele[i].value
          ele[i].disabled="true"
        }
        difficultyNoted = true
      }
      document.addEventListener('keyup', control)
      draw()
      timerId = setInterval(moveDown, difficulty)
      displayShape()
    }
  }


  //working up the button
  startBtn.addEventListener('click', startGame)

  //add score
  function addScore(){
    for (let i=0; i<199; i+=width){
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9]

      if(row.every(index => squares[index].classList.contains('taken'))){
        score+=10
        difficulty -= 10
        scoreDisplay.innerHTML = score
        row.forEach(index=>{
          squares[index].classList.remove('taken')
          squares[index].classList.remove('tetromino')
          squares[index].style.backgroundColor=''
        })
        const squaresRemoved = squares.splice(i,width)
        squares = squaresRemoved.concat(squares)
        squares.forEach(cell=> grid.appendChild(cell))
      }
    }
  }

  //game over
  function gameOver(){
    if(current.some(index => squares[currentPosition +  index].classList.contains('taken'))){
      scoreDisplay.innerHTML = score + ' Game Over'
      clearInterval(timerId)
      document.removeEventListener('keyup', control)
      startBtn.removeEventListener('click', startGame)
    }
  }

  //prevent scrolling by the arrow keys
  window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);








  // function to check all the tetromino positions
  // let tet = theTetrominoes[6]
  // function drawTet(){
  //   tet.forEach(tetro => {
  //     tetro.forEach(index => {
  //       squares[currentPosition + index].classList.add('tetromino')
  //     })
  //     currentPosition += 40
  //   })
  // }


})
