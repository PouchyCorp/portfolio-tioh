
// Main entry point, assumes all modules are loaded globally
let canvas = document.getElementById("viewport");
let ctx = canvas.getContext("2d");
let last = performance.now();

function loop(now) {
  const dt = (now - last) / 1000;
  last = now;
  currentState.update(dt);
  currentState.render(ctx);
  requestAnimationFrame(loop);
}

async function bootstrap() {
  // Load assets here
  const transitionFrames = await loadPngSequence({
    path: "data/papier_animation",
    start: 1,
    end: 11 
  });
  backgroundkeypad = await loadImage({
    path: "data/bg/porte" 
  });

  initKeypadConfig();
  transitionAnimPlayer = new AnimPlayer(transitionFrames, 10);
  currentState = new EntranceDoorState();
  currentState.enter();
  last = performance.now();
  requestAnimationFrame(loop);
}

bootstrap();