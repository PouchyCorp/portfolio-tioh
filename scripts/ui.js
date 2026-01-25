// UI (Button) code

class Button {
  constructor(id, onClickFunc, position, size, hoverimg, normalimg, hoverimgpos, normalimgpos) {
    this.id = id;
    this.pos = position;
    this.size = size;
    this.onClickFunc = onClickFunc;
    this.hoverimg = hoverimg || null;
    this.normalimg = normalimg || null;
    this.hoverimgpos = hoverimgpos || { x: 0, y: 0 };
    this.normalimgpos = normalimgpos || { x: 0, y: 0 };
    this.element = createButton(this);
  }

  onClick(event) {
    if (!this.isInside(event.clientX, event.clientY)) return;
    console.log("clicked " + this.id);
    this.onClickFunc(event);
  }

  onMouseMove(event) {
    if (this.isInside(event.clientX, event.clientY)) {
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

  render(ctx) {
    // custom rendering of button images
    if (this.hoverimg && this.isHover) {
      ctx.drawImage(this.hoverimg, this.pos.x + this.hoverimgpos.x, this.pos.y + this.hoverimgpos.y);
    } else if (this.normalimg) {
      ctx.drawImage(this.normalimg, this.pos.x + this.normalimgpos.x, this.pos.y + this.normalimgpos.y);
    }
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
