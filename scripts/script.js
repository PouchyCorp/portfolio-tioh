
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

let transitionAnimPlayer = null;
let backgroundkeypad = null;

async function bootstrap() {
  // Load assets here
  const paperFrames = await loadPngSequence({
    path: "data/papier_animation",
    start: 1,
    end: 11,
    prefix: "",
    suffix: ".png"
  });
  const transitionFrames = await loadPngSequence({
    path: "data/cinematic",
    start: 1,
    end: 157,
    prefix: "0 (",
    suffix: ").jpg"

  });
  backgroundenter = await loadImage({
    path: "data/bg/porte" 
  });
  backgroundkeypad = await loadImage({
    path: "data/bg/keypad" 
  });
  bouton1 = await loadImage({
    path: "data/boutons/bouton1"
  });
  bouton1_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed"
  });
  bouton2 = await loadImage({
    path: "data/boutons/bouton2"
  });
  bouton2_pushed = await loadImage({
    path: "data/boutons/bouton2_pushed"
  });
    bouton3 = await loadImage({
    path: "data/boutons/bouton3"
  });
  bouton3_pushed = await loadImage({
    path: "data/boutons/bouton3_pushed"
  });
    bouton4 = await loadImage({
    path: "data/boutons/bouton4"
  });
  bouton4_pushed = await loadImage({
    path: "data/boutons/bouton4_pushed"
  });
    bouton5 = await loadImage({
    path: "data/boutons/bouton1"
  });
  bouton5_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed"
  });

  window.addEventListener("resize", () => resizeCanvas(ctx, canvas));
  resizeCanvas(ctx, canvas);
  initKeypadConfig();


  transitionAnimPlayer = new AnimPlayer(transitionFrames, 30);
  paperAnimPlayer = new AnimPlayer(paperFrames, 10);
  reversePaperFrames = [...paperFrames].reverse();
  reversePaperAnimPlayer = new AnimPlayer(reversePaperFrames, 10);

  currentState = new EntranceDoorState();

  currentState.enter();
  last = performance.now();
  requestAnimationFrame(loop);
}

bootstrap();