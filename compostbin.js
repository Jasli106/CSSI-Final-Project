/*global fill, rect, text, windowHeight*/

class CompostBin {
  constructor() {
    
  }
  
  draw() {
    fill(30, 100, 100);
    rect(50, windowHeight - 100, 100, 100);
    fill(0);
    text(`Compost Bin :)`, 50, windowHeight - 100+50);
  }
}