/* global width, height, firebase, collideRectRect, trashT, Draggable, fill, meals, items, windowWidth, windowHeight, database, currUser*/

class Item {
  constructor(name, expiration, image=null, x, y) {
    this.name = name;
    this.expiration = expiration; 
    this.imageURL = image;
    this.meal = null; //Meal Class Instance
    //start at default position
    this.x = x;
    this.y = y;
    this.width = 50;
    this.height = 50;
    this.index = items.length;
    this.text = `${this.name} best by: ${this.expiration.getMonth()}/${this.expiration.getDate()}/${this.expiration.getFullYear()}`;
    this.shape = new Draggable(this.x, this.y, this.width, this.height, this.text, this.expiration);
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
        if(currUser != null){
          //Get all keys and values of ingredient list
          //Remove the one who's value matches the item's name
          let itemName = this.name;
          let currMeal = this.meal;
          firebase.database().ref(currUser.uid).once("value").then(function(snapshot) {
            let meals = snapshot.val().meals;
            console.log(meals.length);
            let ingredients, ingredientKeys, ingredientVals;
            Object.keys(meals).forEach(function(key) {

              console.log(key, meals[key]);
              ingredients = meals[key].ingredients;
              
              console.log(ingredients);
              Object.keys(ingredients).forEach(function(key) {
                console.log(itemName);
                if(ingredients[key] == itemName){
                  database.ref(currUser.uid + "/meals/" + currMeal.name + "/ingredients/" + key).remove();
                }
              });

            });
          });
        }
        
        //Remove ingredient from meal
        let index = this.meal.ingredients.indexOf(this);
        this.meal.ingredients.splice(index, 1);
        
        //Reset to no meal
        this.meal = null;
      }
    }
  }
  
  //helper function
  checkCollision() {
    for(let i = 0; i < meals.length; i++) {
      if(collideRectRect(this.shape.x-this.shape.w/2, this.shape.y+this.shape.h, this.shape.w, this.shape.h, meals[i].x-meals[i].size/2, meals[i].y, meals[i].size, meals[i].size)) {
        //alert to check if user wants to add ingredient (but only if the ingredient isn't already in the meal)
        if(!meals[i].ingredients.includes(this)){
          let yesAdd = window.confirm(`Do you want to add ${this.name} to ${meals[i].name}?`);

          if(yesAdd) {
            this.meal = meals[i];  
            meals[i].addIngredient(this);

          } else {
            this.shape.y += meals[i].size + this.shape.h;
          }

        }
      }
    } 
  }
  
  checkNoCollision() {
    let noCollision = true;
    for(let i = 0; i < meals.length; i++) {
      if(collideRectRect(this.shape.x-this.shape.w/2, this.shape.y+this.shape.h, this.shape.w, this.shape.h, meals[i].x-meals[i].size/2, meals[i].y, meals[i].size, meals[i].size)) {
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
    this.shape.show();
    if(currUser != null) {
      database.ref(currUser.uid + "/items/" + this.name + "/x").set(this.shape.x);
      database.ref(currUser.uid + "/items/" + this.name + "/y").set(this.shape.y);
    }
    fill(0);
  }

  drawExt(index) {
    noStroke();
    fill(100);
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(8);
    rect(index*70+30, 70, 50, 50);
    fill(0);
    text(this.name, index*70+30, 60);
    text('Best By:', index*70+30, 70);
    text(`${this.expiration.getMonth()}/${this.expiration.getDate()}/${this.expiration.getFullYear()}`, index*70+30, 80);
    textSize(16);
  }
  
  //returns whether item was trashed or not
  trashItem(trash) {
    if(collideRectRect(this.shape.x-this.shape.w/2, this.shape.y+this.shape.h, this.shape.w, this.shape.h, trash.x-trash.w/2, trash.y+trash.h/2, trash.w, trash.h)) {
      //remove instance of current item
      if(window.confirm("Are you sure you want to throw this item away?")) {
        let kgs = parseInt(window.prompt("How many kilograms are you throwing away?"));
        console.log(kgs);
        while(isNaN(kgs)) {
          kgs = parseInt(window.prompt("Please enter a valid number. How many kilograms are you throwing away?"));
        }
        trashT.throwAway(kgs);
        this.deleteItem();
        return true;
        
      } else {
        this.shape.y -= (trash.h+this.shape.h);
      }
    }
    return false;
  }
  
  deleteItem() {
    items.splice(this.index, 1); //deletes item element from array
    for(let i = this.index; i < items.length; i++) {
      items[i].index -= 1;
    }
    if(currUser != null){
      //Removes from the database
      database.ref(currUser.uid + "/items/" + this.name).remove();
    }
  }
  
  compostItem(compost) {
    //check collision
    if(collideRectRect(this.shape.x-this.shape.w/2, this.shape.y+this.shape.h, this.shape.w, this.shape.h, compost.x-compost.w/2, compost.y+compost.h/2, compost.w, compost.h)) {
      if(window.confirm("Are you sure you've finished this item or are ready to compost it?")) {
        this.deleteItem();
        
      } else {
        this.shape.y -= (compost.h+this.shape.h);
      }
    }
  }
  
}