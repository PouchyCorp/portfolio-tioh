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

let keypadButtonConfig = [{
      id: "button1",
      onClickFunc: () => {
        currentState.onKeypadButtonClick(1);
      },
      position: { x: 300, y: 400 },
      size: { width: 200, height: 50 },
      hoverimg: bouton1,
      normalimg: bouton1_pushed,
      hoverimgpos: { x: 0, y: 0 },
      normalimgpos: { x: 0, y: 0 }
    },
    {
      id: "button2",
      onClickFunc: () => {
        currentState.onKeypadButtonClick(2);
      },
      position: { x: 100, y: 100 },
      size: { width: 100, height: 30 },
      hoverimg: null,
      normalimg: null,
      hoverimgpos: { x: 0, y: 0 },
      normalimgpos: { x: 0, y: 0 }
    }];

class KeycodeState extends State {
  enter() {
    console.log("Entering Keycode State");
    this.pressedKeys = [];
    this.buttons = keypadButtonConfig.map(cfg => new Button(cfg.id, cfg.onClickFunc, cfg.position, cfg.size, cfg.hoverimg, cfg.normalimg, cfg.hoverimgpos, cfg.normalimgpos));
    initPhysics();
  }
  exit() {
    console.log("Exiting Keycode State");
    clearButtons();
  }

  onKeypadButtonClick(number) {
    let code = "6767"

    console.log("Keypad button clicked: " + number);
    this.pressedKeys.push(number);
    if (this.pressedKeys.length >= 4 && this.pressedKeys.slice(-4).join("") === code) {
      changeState(new TransitionToMainState());
      // TODO play sound
    }
  }
  update(dt) { }
  render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    for (const btn of this.buttons) {
      btn.render(ctx);
    }
  }
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
