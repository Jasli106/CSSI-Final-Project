/*global mouseX, mouseY, stroke, fill, noStroke, rect, text, rectMode, CENTER, checkDraggables*/

// Click and Drag an object
// Daniel Shiffman <http://www.shiffman.net>

class Draggable {
  constructor(x, y, w, h, text, expiration) {
    this.dragging = false; // Is the object being dragged?
    this.rollover = false; // Is the mouse over the ellipse?
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.expiration = expiration;
    this.text = text;
    this.offsetX = 0;
    this.offsetY = 0;
  }

  over() {
    // Is mouse over object
    if (mouseX > this.x - this.w/2 && mouseX < this.x + this.w/2 && mouseY > this.y - this.h/2 && mouseY < this.y + this.h/2) {
      this.rollover = true;
    } else {
      this.rollover = false;
    }
  }

  update() {
    // Adjust location if being dragged
    if (this.dragging) {
      this.x = mouseX + this.offsetX;
      this.y = mouseY + this.offsetY;
    }
  }

  show() {
    stroke(0);
    // Different fill based on state
    if (this.dragging) {
      fill(50);
    } else if (this.rollover) {
      fill(100);
    } else {
      fill(175, 200);
    }
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
    noStroke();
    fill(this.getColor(), 100, 100);
    text(this.text, this.x, this.y-this.h*0.7);
  }
  
  //change color of display text for item depending on how close to expiration it is (red: , yellow: , green: )
  getColor() {
    let currentDate = Date.now();
    let timeLeft = this.expiration.getTime()-currentDate;
    //console.log(timeLeft);
    if(timeLeft <= 604800000) { //1 week -> red
      return 0;
    } else if (timeLeft <= 1209600000) { //2 weeks -> yellow
      return 40;
    } else { //anything more than two weeks -> green
      return 140;
    }
  }

  pressed() {
    // Did I click on the rectangle?
    if (mouseX > this.x-this.w/2 && mouseX < this.x + this.w/2 && mouseY > this.y -this.h/2 && mouseY < this.y + this.h/2) {
      this.dragging = true;
      // If so, keep track of relative location of click to center of rectangle
      this.offsetX = this.x - mouseX;
      this.offsetY = this.y - mouseY;
    }
  }

  released() {
    // Quit dragging
    this.dragging = false;
    checkDraggables();
  }
}