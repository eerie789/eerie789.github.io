const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const addButton = document.getElementById('addButton');

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

addButton.addEventListener("click",()=>{
    const nominal = getRandomInt(27);
    for (let i = nominal; i < nominal+3;i++){
        for (let j = 0; j < 3;j++){
            grid[i][j] = 1;
        }
    }
})

const rows = 20;
const cols = 20;
const size = canvas.width/rows;
const grid = Array.from({length: rows}, ()=> Array(cols).fill(0));
let currentRow = rows -1 ;

function update(){
    const row = currentRow;
    for (let col = 0; col < cols; col++){
          if (grid[col][row] === 1) {
              if (grid[col][row + 1] === 0){
                  grid[col][row + 1] = 1;
                  grid[col][row] = 0;
              } else if (grid[col + 1][row + 1] === 0){
                  grid[col + 1][row + 1] = 1;
                  grid[col][row] = 0;
              } else if (grid[col - 1][row + 1] === 0){
                  grid[col - 1][row + 1] = 1;
                  grid[col][row] = 0;
              } 
          }
            /*  if (grid[row][col] === 1) {
                if (grid[row][col+1] === 0) {
          // Turun lurus
                    grid[row][col+1] = 1;
                    grid[row][col] = 0;
                } else if (grid[row-1][col+1] === 0){
                    grid[row-1][col+1] = 1;
                    grid[row][col] = 0;
                } else if (grid[row+1][col+1] === 0){
                    grid[row+1][col+1] = 1;
                    grid[row][col] = 0;
                }
            }*/
    }
    currentRow--;
    if (currentRow < 0) currentRow = rows -1;
}
function draw(ctx){
    ctx.clearRect(0,0,canvas.width,canvas.height)
    for (let row = 0; row < rows; row++){
        for (let col = 0; col < rows;col++){
            if (grid[row][col] === 1){
                ctx.fillStyle = 'white';
                ctx.fillRect(row*size,col*size,size,size);
            } else {
                ctx.strokeStyle = 'white';
                ctx.strokeRect(row*size,col*size,size,size);
            }
        }
    }
}
/*
let lastTime = 0;
const targetFPS = 120;
const frameDelay = 1000 / targetFPS; // = 100ms

function gameloop(timestamp) {
  if (timestamp - lastTime >= frameDelay) {
    update();
    draw(ctx);
    lastTime = timestamp;
  }
  requestAnimationFrame(gameloop);
}

requestAnimationFrame(gameloop);

*/
function gameloop(){
    update()
    draw(ctx);
    requestAnimationFrame(gameloop);
}
gameloop();