function resizeContainer() {
  const container = document.getElementById("container");
  const winW = window.innerWidth;
  const winH = window.innerHeight;
  const aspectRatio = 1 / 2;

  let width = winW;
  let height = width * 2;

  if (height > winH) {
    height = winH;
    width = height / 2;
  }

  container.style.width = width + "px";
  container.style.height = height + "px";
  container.style.left = (winW - width) / 2 + "px";
  container.style.top = (winH - height) / 2 + "px";
  container.style.fontSize = (width * 0.07) + "px";
  container.style.borderRadius = (width * 0.05) + "px";
}

window.addEventListener("resize", resizeContainer);
window.addEventListener("load", resizeContainer);

function setupInput(canvas, tombolList) {
  canvas.addEventListener("touchstart", (e) => {
    e.preventDefault();
    tombolList.forEach(tombol => touchStart(e, tombol));
  });

  canvas.addEventListener("touchmove", (e) => {
    e.preventDefault();
    tombolList.forEach(tombol => touchMove(e, tombol));
  });

  canvas.addEventListener("touchend", (e) => {
    e.preventDefault();
    tombolList.forEach(tombol => touchEnd(e, tombol));
  });
}

function touchStart(e, button) {
  if (button.id === null) {
    for (let i = 0; i < e.touches.length; i++) {
      const touch = e.touches[i];
      if (isIn(touch, button)) {
        button.id = touch.identifier;
        button.touched = true;
        break;
      }
    }
  }
}

function touchMove(e, button) {
  if (button.id !== null) {
    const touch = [...e.touches].find(t => t.identifier === button.id);
    if (touch && !isIn(touch, button)) {
      button.id = null;
      button.touched = false;
    }
  }
}

function touchEnd(e, button) {
  if (button.id !== null) {
    const touch = [...e.changedTouches].find(t => t.identifier === button.id);
    if (touch) {
      button.id = null;
      button.touched = false;
    }
  }
}

function isIn(touch, button) {
  const rect = canvas.getBoundingClientRect();
  const x = Math.floor((touch.clientX - rect.left) * (canvas.width / rect.width));
  const y = Math.floor((touch.clientY - rect.top) * (canvas.height / rect.height));
  return (
    x >= button.x &&
    x <= button.x + button.w &&
    y >= button.y &&
    y <= button.y + button.h
  );
}
