const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const score = document.getElementById("score");
const nextCol = document.getElementById("col");
const debug = document.getElementById("bottom");

const tetris = {
  play: false,
  secPlay: false,
  pause: false,
  score: 0,
  topScore: 0,
  y: 25,
  w: 80,
  h: 103
}
const kiri = {
  id: null,
  touched: false,
  x: 0,
  y: 130,
  w: 25,
  h: 20
}
const tengah = {
  id: null,
  touched: false,
  x: 27,
  y: 130,
  w: 26,
  h: 20
}
const kanan = {
  id: null,
  touched: false,
  x: 55,
  y: 130,
  w: 25,
  h: 20
}
const detect = {
  count: 0,
  color: 1,
  nextColor: 1,
  x: 0,
  y: 0,
  w: 10,
  h: 10,
  speed: 80,
  lastFall: 0
}
setupInput(canvas,[kiri,tengah,kanan])

function drawButton(){
  ctx.clearRect(0,130,canvas.width,20);
  ctx.fillStyle = kiri.touched ? "#4e4e4e" : "#cccccc";
  ctx.fillRect(kiri.x,kiri.y,kiri.w,kiri.h)
  ctx.fillStyle = kanan.touched ? "#4e4e4e" : "#cccccc";
  ctx.fillRect(kanan.x,kanan.y,kanan.w,kanan.h)
  ctx.fillStyle = tengah.touched ? "#4e4e4e" : "#cccccc";
  ctx.fillRect(tengah.x,tengah.y,tengah.w,tengah.h)
}

function gameloop(timestamp){
  if(tetris.play && !tetris.pause){
    update(timestamp);
    draw();
  }else if(tengah.touched){
    tetris.secPlay = true;
    detect.count = 0;
    detect.speed = getSpeed(detect.count);
    tengah.touched = false;
    tetris.play = true;
    detect.w = (getRandomInt(2)+1)*5;
    detect.h = detect.w
    detect.x = getRandomInt(tetris.w-detect.w)
    detect.color = getRandomInt(4);
    detect.nextColor = getRandomInt(4)
    nextCol.style.background = getColor(detect.nextColor)
    if(tetris.secPlay){
      for(let y = 0; y < tetris.h; y++){
        for(let x = 0; x < tetris.w; x++){
          grid[y][x] = 0
        }
      }
    }
  }
  drawButton()
  requestAnimationFrame(gameloop)
}
gameloop()

const grid = Array.from({length: tetris.h}, () => new Array(tetris.w).fill(0))

function update(timestamp){
  cekConnect()
   // Gerakkan pasir di grid (efek jatuh)
  for (let y = tetris.h - 2; y >= 0; y--) {
    if (y % 2 === 0) {
      // Kiri ke kanan
      for (let x = 0; x < tetris.w; x++) {
        fallingSand(x, y);
      }
    } else {
      // Kanan ke kiri
      for (let x = tetris.w - 1; x >= 0; x--) {
        fallingSand(x, y);
      }
    }
  }
  if(!kanan.touched && kiri.touched && detect.x > 0){
    kanan.isTouched = false
    detect.x--
  } else if(!kiri.touched && kanan.touched && detect.x + detect.w < tetris.w){
    kiri.isTouched = false
    detect.x++
  }
  let shouldPlace = false;
  if(detect.y >= tetris.y){
    for (let i = 0; i < detect.w; i ++){
      const gx = detect.x + i;
      const gy = detect.y-tetris.y +1;
      if(gy >= tetris.h  || grid[gy][gx] !== 0){
        shouldPlace = true
        break;
      }
    }
    
  }
  if(shouldPlace ){
    createBlock(detect.color)
    detect.count++;
    detect.speed = getSpeed(detect.count);
    detect.y = 0;
    detect.w = (getRandomInt(2)+1)*5;
    detect.h = detect.w
    detect.x = getRandomInt(tetris.w-detect.w)
    detect.color = detect.nextColor;
    detect.nextColor = getRandomInt(4);
    nextCol.style.background = getColor(detect.nextColor)
  }
  if(!tengah.touched && timestamp - detect.lastFall > detect.speed ){
    detect.lastFall = timestamp;
    detect.y++;
  } else if (tengah.touched ){
    detect.lastFall = timestamp;
    detect.y++;
  }
}
function draw(){
  score.textContent = `Score: ${tetris.score}`;
  ctx.clearRect(0,0,80,128);
  ctx.fillStyle = '#2e2e2e';
  ctx.fillRect(0,25,tetris.w,tetris.h)
  for ( let y = 0; y < tetris.h; y++){
    for (let x = 0; x < tetris.w; x++){
      if (grid[y][x] !== 0) {
        setPixel(x, y+tetris.y, grid[y][x]);
      } 
    }
  }
  ctx.fillStyle = getColor(detect.color);
  ctx.fillRect(detect.x,detect.y-detect.h,detect.w,detect.h);
  
}
function createBlock(col){
  for(let i = detect.y-tetris.y; i > (detect.y-tetris.y) - detect.h; i--){
    if(i < 0){
      //game over
      gameOver()
      return
    }
    for(let j = detect.x; j < detect.x + detect.w ; j++){
      grid[i][j] = col
    }
  }
}
function setPixel(x, y, col) {
  ctx.fillStyle = getColor(col);
  ctx.fillRect(x, y, 1, 1);
}
function getRandomInt(max) {
  return Math.floor(Math.random() * max) + 1;
}
function getColor(col){
  let color = "#000";
  if (col === 1) color = "red";
  else if (col === 2) color = "green";
  else if (col === 3) color = "blue";
  else if (col === 4) color = "yellow";
  else if (col === 5) color = "white";
  return color
}
function getSpeed(count) {
  const maxCount = 40;
  const maxSpeed = 60;
  const minSpeed = 16;

  const clampedCount = Math.min(count, maxCount);
  const t = clampedCount / maxCount;
  const interpolated = maxSpeed - t * (maxSpeed - minSpeed);

  return Math.max(interpolated, minSpeed);
}
function cekConnect() {
  const visited = Array.from({ length: tetris.h}, () => Array(tetris.w).fill(false));
  let prevColor = null;

  for (let i = tetris.h - 1; i >= 0; i--) {
    const startColor = grid[i][0];
    if (startColor === 0) continue;
    if (startColor === prevColor) continue;

    prevColor = startColor;

    const stack = [[i, 0]];
    const connected = [];
    let reachesRight = false;

    while (stack.length) {
      const [y, x] = stack.shift();
      if (
        y < 0 || y >= tetris.h ||
        x < 0 || x >= tetris.w ||
        visited[y][x] ||
        grid[y][x] !== startColor
      ) continue;

      visited[y][x] = true;
      connected.push([y, x]);

      if (x === tetris.w - 1) reachesRight = true;

      // Tetangga 4 arah (horizontal & vertical)
      stack.push([y + 1, x]);
      stack.push([y - 1, x]);
      stack.push([y, x + 1]);
      stack.push([y, x - 1]);
      stack.push([y+1, x+1]);
      stack.push([y-1, x+1]);
      stack.push([y+1, x-1]);
      stack.push([y-1, x-1]);
    }

    if (reachesRight) {
      tetris.score += connected.length;
     // tetris.pause = true;
      for (const [y, x] of connected) {
        grid[y][x] = 0
      }
     // boomEffect(connected)
      return; // setelah satu koneksi ditemukan & dihapus, keluar fungsi
    }
  }
}
function fallingSand(x,y){
  if(grid[y][x] === 0) return;
  
  if (grid[y + 1][x] === 0) {
    grid[y + 1][x] = grid[y][x];
    grid[y][x] = 0;
  } else if (x > 0 && grid[y + 1][x - 1] === 0) {
    grid[y + 1][x - 1] = grid[y][x];
    grid[y][x] = 0;
  } else if (x < tetris.w - 1 && grid[y + 1][x + 1] === 0) {
    grid[y + 1][x + 1] = grid[y][x];
    grid[y][x] = 0;
  }
}
function gameOver(){
  tetris.play = false;
  ctx.fillStyle = 'white';
  ctx.fillRect(detect.x,detect.y-detect.h,detect.w,detect.h)
  if(tetris.score >= tetris.topScore) debug.innerText = `Top Score: ${tetris.score}`;
tetris.score = 0;
}
function boomEffect(gridList){
  setTimeout(()=>{
    for (const [y, x] of gridList) {
    grid[y][x] = 0
  }
  tetris.pause = false;
  },100)
}