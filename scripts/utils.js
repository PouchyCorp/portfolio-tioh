// Utility and asset loading code

class AnimPlayer {
  constructor(frames, speed = 10) {
    this.frames = frames;
    this.index = 0;
    this.speed = speed;
    this.time = 0;
    this.done = false;
    this.justDone = false;
  }

  reset() {
    this.index = 0;
    this.time = 0;
    this.done = false;
    this.justDone = false;
  }

  update(dt) {
    if (this.justDone) {
      this.justDone = false;
      return;
    }
    if (this.done) return;
    this.time += dt * 1000; // ms
    if (this.time >= 1000 / this.speed) {
      this.time -= 1000 / this.speed;
      this.index++;
      if (this.index >= this.frames.length) {
        this.index = this.frames.length - 1;
        this.done = true;
        this.justDone = true;
      }
    }
  }

  render(ctx, x, y) {
    const frame = this.frames[this.index];
    ctx.drawImage(frame, x, y);
  }
}

function loadPngSequence({ path, start, end, prefix, suffix}) {
  const frames = [];
  let loaded = 0;
  const total = end - start + 1;
  return new Promise((resolve, reject) => {
    for (let i = start; i <= end; i++) {
      const img = new Image();
      img.src = `${path}/${prefix}${i}${suffix}`;
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          resolve(frames);
        }
      };
      img.onerror = () => {
        reject(new Error(`Failed to load ${img.src}`));
      };
      frames.push(img);
    }
  });
}


function loadJpgSequence({ path, start, end }) {
  const frames = [];
  let loaded = 0;
  const total = end - start + 1;
  return new Promise((resolve, reject) => {
    for (let i = start; i <= end; i++) {
      const img = new Image();
      img.src = `${path}/0 (${i}).jpg`;
      img.onload = () => {
        loaded++;
        if (loaded === total) {
          resolve(frames);
        }
      };
      img.onerror = () => {
        reject(new Error(`Failed to load ${img.src}`));
      };
      frames.push(img);
    }
  });
}

function loadImage({ path }) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = `${path}.png`;
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load ${img.src}`));
  });
}

function resizeCanvas(ctx, canvas) {
  const dpr = window.devicePixelRatio || 1;

  const rect = canvas.getBoundingClientRect();

  canvas.width  = rect.width  * dpr;
  canvas.height = rect.height * dpr;

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}