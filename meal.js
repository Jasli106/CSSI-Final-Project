/*global rect, fill, text, meals, database, currUser*/

class Meal {
  constructor(name) {
    this.name = name;
    this.ingredients = [];
    //position will depend on how many meals there are
    //maybe make a scrolling div
    this.size = 150;
    //10 pixel margins on each side
    this.x = meals.length*170+10;
    //appear on the sime horizontal line
    this.y = 50;
    this.index = meals.length;
    this.shape = rect(this.x, this.y, this.size, this.size);
  }
  
  addIngredient() {
    
  }
  
  draw() {
    fill(340, 100, 100);
    rect(this.x, this.y, this.size, this.size);
    fill(0);
    text(`${this.name}`, this.x+this.size/10, this.y+this.size/5);
  }
  
  //pop up box to edit meal, ingredients, etc.
  openDetails() {
    console.log("clicked");
    //fill in later: edit name, delete, clear
    text("Hit BACKSPACE to delete this meal.", this.x, this.y);
    function keyPressed() {
  if (keyCode === BACKSPACE) {
    this.clear();
  }
}
  }
  
  shiftMeal() {
    //and ingredients within it
    //change index
    this.index -= 1;
    this.x = meals.length*170+10;
  }
  
  clear() {
    //moves ingredients to main 
    for(let i = 0; i < this.ingredients.length; i++){
      this.ingredients[i].meal = null;
    }
    //deletes this instance of meal from array
    meals.splice(this.index, this.index+1);
    for(let i = this.index; i < meals.length; i++) {
      meals[i].shiftMeal();
    }
    //Removes from the database
    database.ref(currUser.uid + "/meals/" + this.name).remove();
  }
  
}
