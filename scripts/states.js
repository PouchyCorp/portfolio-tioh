let beat = new Audio('data/sounds/blop.mp3');


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
    ctx.drawImage(backgroundenter, 0, 0);
  }
}

let keypadButtonConfig = null;

function initKeypadConfig() {


  keypadButtonConfig = [{
        id: "button1",
        onClickFunc: () => {
          currentState.onKeypadButtonClick(1);
        },
        position: { x: 860, y: 350 },
        size: { width: 50, height: 50 },
        hoverimg: bouton1_pushed,
        normalimg: bouton1,
        hoverimgpos: { x: -15, y: -15},
        normalimgpos: { x: -15, y: -15 }
      },
      {
        id: "button2",
        onClickFunc: () => {
          currentState.onKeypadButtonClick(2);
        },
        position: { x: 930, y: 353 },
        size: { width: 50, height: 50 },
        hoverimg: bouton2_pushed, 
        normalimg: bouton2,
        hoverimgpos: { x: 0, y: 0 },
        normalimgpos: { x: -15, y: -15 }
      },
      {
        id: "button3",
        onClickFunc: () => {
          currentState.onKeypadButtonClick(2);
        },
        position: { x: 1000, y: 356 },
        size: { width: 50, height: 50 },
        hoverimg: bouton3_pushed, 
        normalimg: bouton3,
        hoverimgpos: { x: 0, y: 0 },
        normalimgpos: { x: -15, y: -15 }
      }];

}

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
    let code = "2222"
    beat.play()
    console.log("Keypad button clicked: " + number);
    this.pressedKeys.push(number);
    if (this.pressedKeys.length >= 4 && this.pressedKeys.slice(-4).join("") === code) {
      changeState(new TransitionToMainState());
      // TODO play sound
    }
  }
  update(dt) {}
   
  
  render(ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.drawImage(backgroundkeypad, 0, 0);
    for (const btn of this.buttons) {
      btn.render(ctx);
    }
    
  }
}

class TransitionToMainState extends State {
  enter() {
    console.log("Entering Transition To Main State");
    this.animPlayer = cinematicPlayer;
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
let cinematicPlayer = null
let backgroundkeypad = null;
