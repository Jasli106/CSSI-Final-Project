/* global fill, rect, text, textAlign, windowWidth, windowHeight, rectMode, CENTER, noStroke*/

//store data about user's trash habits
class TrashCan {
  constructor() {
    this.amountThrownAway = 0,
    this.w = windowWidth/10,
    this.h = windowHeight/10,
    this.x = windowWidth - this.w,
    this.y = windowHeight - this.h;
  }
  
  draw() {
    noStroke();
    fill(13, 58, 88);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h, 12);
    fill(234, 33, 36);
    textAlign(CENTER, CENTER);
    text(`Trash Can :(`, this.x, windowHeight - this.h*1.2);
    text(`Food Trashed: \n${this.amountThrownAway} kgs`, this.x, windowHeight - this.h*0.85);
  }
  
  throwAway(kilograms) {
    this.amountThrownAway += kilograms;
  }
  
}