/*global rect, fill, text, meals, items, firebase, database, currUser, textSize, textAlign, CENTER, noStroke, strokeWeight, stroke, keyCode, width, height, keyIsPressed, BACKSPACE*/

class Meal {
  constructor(name, ingredients) {
    this.name = name;
    this.ingredients = ingredients;
    //position will depend on how many meals there are
    //maybe make a scrolling div
    this.size = 150;
    //10 pixel margins on each side
    this.x = meals.length*(this.size+20)+this.size*1.35;
    //appear on the sime horizontal line
    this.y = 100;
    this.index = meals.length;
    this.shape = rect(this.x, this.y, this.size, this.size);
    this.on = false;
  }
  
  addIngredient(item) {
    this.ingredients.push(item);
    
    if(currUser != null) {

      database.ref(currUser.uid + "/meals/" + this.name + "/ingredients").push(item.name);
    }
  }
  
  draw() {
    if(this.on) {
      this.drawPopUp();
      //while clicked on, check if it should be deleted
      if(keyIsPressed === true && keyCode == BACKSPACE) {
        this.clear();
      }  
      stroke(150, 100, 100);
      strokeWeight(5);
    }
    fill(281, 17, 81);
    rect(this.x, this.y, this.size, this.size, 12);
    
    noStroke();
    fill(234, 33, 36);
    textAlign(CENTER, CENTER);
    text(`${this.name}`, this.x, this.y-this.size*0.3);
  }
 
  openDetails() {
    this.on = true;
  }
  
  closeDetails() {
    this.on = false;
  }
  
  drawPopUp() {
    fill(360);
    rect(this.x, this.y+this.size*0.6, this.size, 20);
    fill(0);
    textSize(10);
    text(" BACKSPACE to delete meal.", this.x, this.y + this.size*0.6);
  }
  
  shiftMeal() {
    //and ingredients within it
    //change index
    this.index -= 1;
    this.x -= 170; //170=meals.size+20 margin
  }
  
  clear() {
    //moves ingredients to main 
    for(let i = 0; i < this.ingredients.length; i++){
      this.ingredients[i].meal = null;
    }
    //deletes this instance of meal from array
    meals.splice(this.index, 1);
    console.log(meals);
    console.log(meals.length);
    for(let i = this.index; i < meals.length; i++) {
      meals[i].shiftMeal();
      console.log("shifting");
    }
    //Removes from the database
    if(currUser != null) {
      database.ref(currUser.uid + "/meals/" + this.name).remove();
    }
  }
  
}
