// State machine and states
// Assumes AnimPlayer, loadPngSequence, loadImage, Button, clearButtons, initPhysics are globally available

class State {
  enter() { }
  exit() { }
  update(dt) { }
  render(ctx) { }
}

class EntranceDoorState extends State {
  enter() {
    console.log("Entering Entrance Door State");
    this.startButton = new Button("startButton", () => {
      changeState(new KeycodeState());
    }, { x: 0, y: 0 }, { width: 200, height: 50 });
  }
  exit() {
    console.log("Exiting Entrance Door State");
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    clearButtons();
  }
  update(dt) { }
  render(ctx) {
    ctx.drawImage(backgroundkeypad, 0, 0);
  }
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
let transitionAnimPlayer = null;
let backgroundkeypad = null;
