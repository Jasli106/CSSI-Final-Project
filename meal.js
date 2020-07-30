/*global rect, fill, text, meals, items, createInput, DELETE, ENTER, TAB, firebase, database, currUser, textSize, textAlign, CENTER, noStroke, strokeWeight, stroke, keyCode, width, height, keyIsPressed, BACKSPACE*/

let inp;

class Meal {
  constructor(name, ingredients) {
    this.name = name;
    this.ingredients = ingredients;
    //position will depend on how many meals there are
    //maybe make a scrolling div
    this.size = 200;
    //10 pixel margins on each side
    this.x = meals.length*(this.size+20)+this.size*1.35;
    //appear on the sime horizontal line
    this.y = 110;
    this.index = meals.length;
    this.shape = rect(this.x, this.y, this.size, this.size);
    this.on = false; //if selected by clicking on
    this.editing = false;
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
      if(keyIsPressed === true && (keyCode == DELETE || keyCode == BACKSPACE)) {
        this.clear();
      }
      //check if name is being edited/altered
      if(keyIsPressed === true && keyCode == 67 && !this.editing) {
        this.editing = true;
        inp = createInput();
        inp.size(this.size*0.9);
        inp.position(this.x-this.size*0.31, this.y+this.size*0.1);
      }
      stroke(150, 17, 81);
      strokeWeight(5);
    }
    
    if(this.editing) {
      //this.editName();
      if(keyIsPressed === true && keyCode == ENTER) {
        this.saveName();
        this.editing = false;
      }
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
    
    //fix this text ui
    text("DELETE to remove meal. \n'c' to change name.", this.x, this.y + this.size*0.6);
  }
  
  
  saveName() {
    if(inp.value() != null && inp.value() != ''){
      console.log(this.name);
      database.ref(currUser.uid + "/meals/" + this.name).remove();
      this.name = inp.value();
      database.ref(currUser.uid + "/meals/" + this.name).set({
        name: this.name
      });
      for(let i=0; i<this.ingredients.length; i++) {
        database.ref(currUser.uid + "/meals/" + this.name + "/ingredients").push(this.ingredients[i].name);
      }
      inp.remove(); 
    }
  }
  
  shiftMeal() {
    //and ingredients within it
    //change index
    this.index -= 1;
    this.x -= 220; //170=meals.size+20 margin
    for(let i = 0; i < this.ingredients.length; i++){
      this.ingredients[i].shape.x -= 220;
    }
  }
  
  clear() {
    //moves ingredients to main 
    //console.log("clearing");
    //console.log(this.ingredients);
    for(let i = 0; i < this.ingredients.length; i++){
      this.ingredients[i].shape.y += 100;
      this.ingredients[i].meal = null;
    }
    //deletes this instance of meal from array
    meals.splice(this.index, 1);
    for(let i = this.index; i < meals.length; i++) {
      meals[i].shiftMeal();
    }
    //Removes from the database
    if(currUser != null) {
      database.ref(currUser.uid + "/meals/" + this.name).remove();
    }
    
    keyIsPressed = false;
  }
  
}
