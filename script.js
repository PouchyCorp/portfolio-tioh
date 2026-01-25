class State {
  enter() { }
  exit() { }
  update(dt) { }
  render(ctx) { }
}

class AnimPlayer {
  constructor(frames, speed = 10) {
    this.frames = frames;
    this.index = 0;
    this.speed = speed;
    this.time = 0;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;

    this.time += dt * 1000; // ms

    if (this.time >= 1000 / this.speed) {
      this.time -= 1000 / this.speed;
      this.index++;

      if (this.index >= this.frames.length) {
        this.index = this.frames.length - 1;
        this.done = true;
      }
    }
  }

  render(ctx, x, y) {
    const frame = this.frames[this.index];
    ctx.drawImage(frame, x, y);
  }
}

function loadPngSequence({ path, start, end }) {
  const frames = [];
  let loaded = 0;
  const total = end - start + 1;

  return new Promise((resolve, reject) => {
    for (let i = start; i <= end; i++) {
      const img = new Image();
      img.src = `${path}/${i}.png`;

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

class Button {
  constructor(id, onClickFunc, position, size) {
    this.id = id;
    this.pos = position;
    this.size = size;
    this.onClickFunc = onClickFunc;
    this.element = createButton(this);
  }

  onClick(event) {
    if (!this.isInside(event.clientX, event.clientY)) return;
    console.log("clicked " + this.id);
    this.onClickFunc(event);
  }

  onMouseMove(event) {
    if (this.isInside(event.clientX, event.clientY)) {
      // mouse pointer
      this.element.style.cursor = "pointer";
      this.element.style.borderColor = "red";
    } else {
      this.element.style.cursor = "default";
      this.element.style.borderColor = "black";
    }
  }

  isInside(x, y) {
    const rect = this.element.getBoundingClientRect();
    return (
      x >= rect.left &&
      x <= rect.right &&
      y >= rect.top &&
      y <= rect.bottom
    );
  }
}

let currentPageButtons = [];

function createButton(btn) {
  console.log("Creating button: " + btn.id);
  const el = document.createElement("button");
  el.id = btn.id;
  el.className = "ui-button";
  el.addEventListener("click", (event) => {
    btn.onClick(event);
  });
  document.addEventListener("mousemove", (event) => {
    btn.onMouseMove(event);
  });
  el.style.position = "absolute";
  el.style.left = btn.pos.x + "px";
  el.style.top = btn.pos.y + "px";
  el.style.width = btn.size.width + "px";
  el.style.height = btn.size.height + "px";
  el.style.border = "2px solid black";
  el.style.background = "none";


  currentPageButtons.push(el);
  document.body.appendChild(el);
  return el;
}

function clearButtons() {
  currentPageButtons.forEach((btn) => {
    document.body.removeChild(btn);
  });
  currentPageButtons = [];
}

// entrance door state
class EntranceDoorState extends State {
  enter() {
    console.log("Entering Entrance Door State");
    this.startButton = new Button("startButton", () => {
      changeState(new KeycodeState());
    }, { x: 0, y: 0 }, { width: 200, height: 50 });
  }

  exit() {
    console.log("Exiting Entrance Door State");
    clearButtons();
  }

  update(dt) { }

  render(ctx) { }

}


function initPhysics() {
  Physics(function(world){

    var viewWidth = 500;
    var viewHeight = 300;

    var renderer = Physics.renderer('canvas', {
      el: 'physics',
      width: viewWidth,
      height: viewHeight,
      meta: false, 
      styles: {
          
          'circle' : {
              strokeStyle: '#351024',
              lineWidth: 1,
              fillStyle: '#d33682',
              angleIndicator: '#351024'
          }
      }
    });

    world.add( renderer );
    world.on('step', function(){
      world.render();
  });

    // bounds of the window
    var viewportBounds = Physics.aabb(0, 0, viewWidth, viewHeight);

    // constrain objects to these bounds
    world.add(Physics.behavior('edge-collision-detection', {
        aabb: viewportBounds,
        restitution: 0.99,
        cof: 0.99
    }));

  // add a circle
  world.add(
      Physics.body('circle', {
        x: 50, // x-coordinate
        y: 30, // y-coordinate
        vx: 0.2, // velocity in x-direction
        vy: 0.01, // velocity in y-direction
        radius: 20
      })
  );

  // ensure objects bounce when edge collision is detected
  world.add( Physics.behavior('body-impulse-response') );

  // add some gravity
  world.add( Physics.behavior('constant-acceleration') );

  // subscribe to ticker to advance the simulation
  Physics.util.ticker.on(function( time, dt ){

      world.step( time );
  });

  // start the ticker
  Physics.util.ticker.start();

  });
}


class KeycodeState extends State {
  enter() {
    console.log("Entering Keycode State");
    this.startButton = new Button("startButton", () => {
      changeState(new TransitionToMainState());
    }, { x: 100, y: 50 }, { width: 100, height: 100 });
    initPhysics();
  }
  exit() {
    console.log("Exiting Keycode State");
    clearButtons();
  }
  update(dt) { }
  render(ctx) { }
}

class TransitionToMainState extends State {
  enter() {
    console.log("Entering Transition To Main State");
    this.animPlayer = transitionAnimPlayer;
    console.log(this.animPlayer)
  }
  exit() {
    console.log("Exiting Transition To Main State");
    clearButtons();
  }
  update(dt) {
    this.animPlayer.update(dt);
    if (this.animPlayer.done) {
      changeState(new MainState());
    }
  }
  render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    this.animPlayer.render(ctx, 0, 0);
  }
}

class MainState extends State {
  enter() {
    console.log("Entering Main State");
  }
}

function changeState(next) {
  currentState.exit();
  currentState = next;
  currentState.enter();
}

let currentState = new EntranceDoorState();
currentState.enter();

let canvas = document.getElementById("viewport");
let ctx = canvas.getContext("2d");

let last = performance.now();

let transitionAnimPlayer = null;


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

  transitionAnimPlayer = new AnimPlayer(transitionFrames, 10);

  currentState = new EntranceDoorState();
  currentState.enter();

  last = performance.now();
  requestAnimationFrame(loop);

}

bootstrap();