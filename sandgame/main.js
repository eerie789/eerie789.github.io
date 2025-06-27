const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const debug01 = document.getElementById("debug01")

const width = canvas.width;
const height = canvas.height;

const grid = new Array(width*height).fill(0);
function swap(a, b) {
    const temp = grid[a];
    grid[a] = grid[b];
    grid[b] = temp;
}
function isEmpty(index){
  return grid[index] === 0;
}
function update(){
  for(let i = grid.length - width - 1; i > 0; i--){
    const bellow = i + width;
    const bellowleft = bellow - 1;
    const bellowright = bellow + 1;
    
    if(isEmpty(bellow)){
      swap(i,bellow);
    }else if (i % width !== 0 && isEmpty(bellowleft)){
      swap(i,bellowleft);
    }else if ((i + 1) % width !== 0 && isEmpty(bellowright)){
      swap(i,bellowright);
    }
  }
}
function draw(){
  ctx.clearRect(0,0,width,height)
  grid.forEach((val,index) => {
    if(val === 1) {
      const x = index % width;
      const y = Math.floor(index / width);
      setPixel(x,y)
    }
  })
}
// touch system
canvas.addEventListener("touchstart",handleTouch)
canvas.addEventListener("touchmove",handleTouch)
function handleTouch(e){
  e.preventDefault()
  const rect = canvas.getBoundingClientRect();
  
  for (let i = 0; i < e.touches.length; i++){
    const touch = e.touches[i];
    const x = Math.floor((touch.clientX - rect.left) * (canvas.width / rect.width));
    const y = Math.floor((touch.clientY - rect.top) * (canvas.height / rect.width));
    if (x >= 0 && y >= 0 && x < width && y < height) {
      grid[y*width+x] = 1;
      //succes
      //debug01.innerHTML = `x: ${x} y : ${y}`
    }
  }
}
function setPixel(x,y){
  const imgData = ctx.getImageData(x, y, 1, 1);
  
  imgData.data[0] = 255; // R
  imgData.data[1] = 0;   // G
  imgData.data[2] = 0;   // B
  imgData.data[3] = 255; // A 
  
  ctx.putImageData(imgData, x, y);
}

function gameloop(){
  update()
  draw()
  requestAnimationFrame(gameloop)
}
gameloop()