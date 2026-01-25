
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
  bouton1 = await loadImage({
    path: "data/boutons/bouton1.png"
  });
  bouton1_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed.png"
  });
  bouton2 = await loadImage({
    path: "data/boutons/bouton1.png"
  });
  bouton2_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed.png"
  });
    bouton3 = await loadImage({
    path: "data/boutons/bouton1.png"
  });
  bouton3_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed.png"
  });
    bouton4 = await loadImage({
    path: "data/boutons/bouton1.png"
  });
  bouton4_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed.png"
  });
    bouton5 = await loadImage({
    path: "data/boutons/bouton1.png"
  });
  bouton5_pushed = await loadImage({
    path: "data/boutons/bouton1_pushed.png"
  });
  
  transitionAnimPlayer = new AnimPlayer(transitionFrames, 10);
  currentState = new EntranceDoorState();
  currentState.enter();
  last = performance.now();
  requestAnimationFrame(loop);
}

bootstrap();