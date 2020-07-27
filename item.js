/* global width, height, collideRectRect, trashT, Draggable, fill, meals, items, windowWidth, windowHeight, database, currUser*/

class Item {
  constructor(name, expiration, image=null, x, y) {
    this.name = name;
    this.expiration = expiration; 
    this.imageURL = image;
    this.meal = null; //Meal Class Instance
    //start at deafult position
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.text = `${this.name} best by: ${this.expiration}`;
    this.shape = new Draggable(this.x, this.y, this.width, this.height, this.text);
  }
  
  //detect collision between food item and any meal
  dragMeal() {
    //how to add the same ingredients to multiple meals --> max number of meals user can plan?
    if(this.meal == null){
      //if not currently in a meal, check for collisions
      this.checkCollision();
    } else if(this.meal != null && this.checkNoCollision()) {
      //if in a meal, check for no collision which means it has moved outside
      if(window.confirm(`Do you want to remove ${this.name} from ${this.meal.name}?`)){
        //this.meal.remove(this);
        this.meal = null;
      }
    }
  }
  
  //helper function
  checkCollision() {
    for(let i = 0; i < meals.length; i++) {
      if(collideRectRect(this.shape.x, this.shape.y, this.shape.w, this.shape.h, meals[i].x, meals[i].y, meals[i].size, meals[i].size)) {
        //alert to check if user wants to add ingredient
        let yesAdd = window.confirm(`Do you want to add ${this.name} to ${meals[i].name}?`);
        if(yesAdd) {
          this.meal = meals[i];  
          meals[i].addIngredient(this);
        } else {
          this.shape.y += meals[i].size;
        }
      }
    } 
  }
  
  checkNoCollision() {
    let noCollision = true;
    for(let i = 0; i < meals.length; i++) {
      if(collideRectRect(this.shape.x, this.shape.y, this.shape.w, this.shape.h, meals[i].x, meals[i].y, meals[i].size, meals[i].size)) {
          noCollision = false;
      }
    } 
    return noCollision;
  }
  
  draw() {
    //depending on whether it is attached to a meal or not, position will change
    fill(60, 100, 100); //change color --> image
    //for dragging
    this.shape.over();
    this.shape.update();
    database.ref(currUser.uid + "/items/" + this.name + "/x").set(this.shape.x);
    database.ref(currUser.uid + "/items/" + this.name + "/y").set(this.shape.y);
    this.shape.show();
    //rect(this.x, this.y, this.width, this.height);
    fill(0);
  }
  
  trashItem() {
    //coords: rect(windowWidth - 200, windowHeight - 100, 100, 100);
    if(collideRectRect(this.shape.x, this.shape.y, this.shape.w, this.shape.h, windowWidth - 200, windowHeight - 100, 100, 100)) {
      //remove instance of current item
      if(window.confirm("Are you sure you want to throw this item away?")) {
        let kgs = parseInt(window.prompt("How many kilograms are you throwing away?"));
        console.log(kgs);
        while(isNaN(kgs)) {
          kgs = parseInt(window.prompt("Please enter a valid number. How many kilograms are you throwing away?"));
        }
        trashT.throwAway(kgs);
        //items.remove(this);
        
        //Removes from the database
        database.ref(currUser.uid + "/items/" + this.name).remove();
      } else {
        this.shape.y -= 100;
      }
    }
  }
  
  compostItem() {
    //check collision
    //coords: rect(50, windowHeight - 100, 100, 100);
    if(collideRectRect(this.shape.x, this.shape.y, this.shape.w, this.shape.h, 50, windowHeight - 100, 100, 100)) {
      if(window.confirm("Are you sure you've finished this item or are ready to compost it?")) {
        //items.remove(this);
        
        //Removes from the database
        database.ref(currUser.uid + "/items/" + this.name).remove();
      } else {
        this.shape.y -= 100;
      }
    }
  }
  
}