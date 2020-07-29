/*global fill, rect, text, textAlign, windowHeight, windowWidth, rectMode, CENTER, noStroke*/

class CompostBin {
  constructor() {
    this.w = windowWidth/10,
    this.h = windowHeight/10,
    this.x = this.w,
    this.y = windowHeight - this.h;
  }
  
  draw() {
    noStroke();
    fill(151, 28, 70);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 12);
    fill(234, 33, 36);
    textAlign(CENTER, CENTER);
    text(`Compost Bin :)`, this.x, this.y);
  }
}