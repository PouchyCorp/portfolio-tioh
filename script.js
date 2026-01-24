class State {
  enter() {}
  exit() {}
  update(dt) {}
  render(ctx) {}
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
            console.log("hovering " + this.id);
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
  
  update(dt) {}
  
  render(ctx) {}

}

class KeycodeState extends State {
  enter() {
    console.log("Entering Keycode State");
  }
  exit() {
    console.log("Exiting Keycode State");
    clearButtons();
  }
  update(dt) {}
  render(ctx) {}
}


function changeState(next) {
  currentState.exit();
  currentState = next;
  currentState.enter();
}

let currentState = new EntranceDoorState();

currentState.enter();

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
      
let last = performance.now();

function loop(now) {
  const dt = (now - last) / 1000;
  last = now;

  currentState.update(dt);
  currentState.render(ctx);

  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);