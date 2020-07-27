/* global fill, rect, text, windowWidth, windowHeight*/

//store data about user's trash habits
class TrashCan {
  constructor() {
    this.amountThrownAway = 0;
  }
  
  draw() {
    fill(130, 100, 100);
    rect(windowWidth - 200, windowHeight - 100, 100, 100);
    fill(0);
    text(`Trash Can :(`, windowWidth - 200, windowHeight - 100+50);
    text(`Food Trashed: \n${this.amountThrownAway} kgs`, windowWidth - 200, windowHeight - 100+70);
  }
  
  throwAway(kilograms) {
    this.amountThrownAway += kilograms;
  }
  
}