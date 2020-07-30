/* global firebase, Meal, Item, textFont, keyCode, BACKSPACE, collidePointRect, mouseX, mouseY, CompostBin, TrashCan, noStroke, Draggable, windowWidth, createButton, collideRectRect, windowHeight, collideRectCircle,keyIsDown, RETURN, didHitCollectible, collideCircleCircle, fill, rect, ellipse, textSize, text, createCanvas, colorMode, HSB, random, width, height, background, color */

//import { format, compareAsc } from 'date-fns';

let button, userText, backgroundColor;
var meals;
var items;
let compost, trashT;
var currUser = firebase.auth().currentUser;

//Firebase stuff
let provider = new firebase.auth.GoogleAuthProvider();
let database = firebase.database();

function login() {
  if(currUser == null) {
    firebase.auth().signInWithPopup(provider).then(function(result) {
      // This gives you a Google Access Token. You can use it to access the Google API.
      var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      //Write/read user data to/from database
      writeUserData(user.uid, user.email);
      fill(0);
      userText = "User:" + user.email;
      currUser = user;
      getUserData();
      makeButton('Sign Out', width*0.05, height*0.07, 75, 50, login);
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // The email of the user's account used.
      var email = error.email;
      // The firebase.auth.AuthCredential type that was used.
      var credential = error.credential;
      console.log(errorMessage);
    });
  }
  else {
    firebase.auth().signOut().then(function() {
      currUser = firebase.auth().currentUser;
      makeButton('Sign In', width*0.05, height*0.07, 75, 50, login);
    }).catch(function(error) {
      // An error happened.
      console.log(error);
    });
  }
  
}

function writeUserData(uid, email) {
  database.ref(uid + "/email").set(email);
}

function getUserData() {
  firebase.database().ref(currUser.uid).once("value").then(function(snapshot) {
    //Regenerate all items
    if(snapshot.val().items != undefined) {
      let itemArr = Object.values(snapshot.val().items);
    
      for(let i = itemArr.length-1; i >= 0; i--){
        let modayr = itemArr[i].expiration.split("/");
        console.log(modayr);
        for(let i = 0; i < 3; i++) {
          modayr[i] = parseInt(modayr[i]);
        }
        let date = new Date(modayr[2], modayr[0], modayr[1]);
        
        items.push(new Item(itemArr[i].name, date, itemArr[i].image, itemArr[i].x, itemArr[i].y));
      };
    }
    //Regenerate all meals
    if(snapshot.val().meals != undefined) {
      let mealArr = Object.values(snapshot.val().meals);
      for(let i = mealArr.length-1; i >= 0; i--){
        let ingredientsArr = []
        if(mealArr[i].ingredients != undefined) {
          let ingredientsNameArr = Object.values(mealArr[i].ingredients);
          for (let i=0;i<ingredientsNameArr.length;i++){
            for (let j=0; j<items.length; j++){
              if(items[j].name == ingredientsNameArr[i]){
                ingredientsArr.push(items[j]);
              }
            }
          }
        }
        meals.push(new Meal(mealArr[i].name, ingredientsArr));
        
      };
    }
    
    //Add correct meal tags to items
    for(let i=0; i<items.length; i++){
      for(let j=0; j<meals.length; j++){
        if(meals[j].ingredients.includes(items[i])){
          items[i].meal = meals[j];
        }
      }
    }
    
    
  });
}

//-----------------------------------------------------------------------


// functions called by p5
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  backgroundColor = color(52, 9, 96);
  background(backgroundColor);
  textFont('Monaco');
  
  meals = [];
  items = [];
  compost = new CompostBin();
  trashT = new TrashCan();
  
  
  //Creating all buttons
  makeButton('Add Meal', width/2, height/4, 75, 50, createMeal);  
  makeButton('Add Item', width/2, height/4*3, 75, 50, addItem);  
  makeButton('Sign In', width*0.05, height*0.07, 75, 50, login);
  
}

function draw() {
  background(backgroundColor);
  trashT.draw();
  compost.draw();
  
  //draw meals
  for(let i=0;i<meals.length;i++) {
    meals[i].draw();
  }
  
  //draw ingredients
  for(let i=0;i<items.length;i++) {
    items[i].draw();
    if(!items[i].shape.dragging) {
      items[i].dragMeal();
      if(!items[i].trashItem(trashT)) {
        items[i].compostItem(compost);
      }
    } 
  }
  
}

function createMeal() {
  //console.log("Creating Meal");
  let name = window.prompt("What is this meal called?");
  if(name != null) {
    let meal = new Meal(name, []);
    meals.push(meal);
    if(currUser != null) {
      database.ref(currUser.uid + "/meals/" + name).set({
        name: meal.name, 
        ingredients: meal.ingredients
      });
    }
    
  }
}

function addItem() {
  let name = window.prompt("What is this item called?");  
  if(name != null) {
    let dateString = window.prompt("When does it expire? (Format: MM/DD/YYYY)");
    let modayr = dateString.split("/");
    for(let i = 0; i < 3; i++) {
      modayr[i] = parseInt(modayr[i]);
    }
    //checks if date entered is in valid format
    while(isNaN(modayr[0]) || isNaN(modayr[1]) || isNaN(modayr[2]) &&
         !(modayr[0] >= 1 &&  modayr[0] <=12) && !(modayr[1] >= 1 &&  modayr[1] <=31)) {
      dateString = window.prompt("When does it expire? (Format: MM/DD/YYYY))");
      modayr = dateString.split("/");
      for(let i = 0; i < 3; i++) {
        modayr[i] = parseInt(modayr[i]);
      }
    }
  
    let date = new Date(modayr[2], modayr[0]-1, modayr[1]); 
    console.log(date);
    let item = new Item(name, date, null, width/2, height/2);
    items.push(item);
    
    //If signed in, stores item info in database
    if(currUser != null) {
      database.ref(currUser.uid + "/items/" + name).set({
        name: item.name,
        expiration: dateString,
        imageURL: item.imageURL,
        meal: item.meal,
        x: item.shape.x,
        y: item.shape.y
      });
    }
    
    checkDraggables();
    
  }
}

function mousePressed() {
  //for dragging and dropping items
  for(let i = 0; i < items.length; i++) {
    items[i].shape.pressed();
  }
  
  //click to open or close details
  
  for(let i = 0; i < meals.length; i++) {
    if(collidePointRect(mouseX, mouseY, meals[i].x, meals[i].y, meals[i].size, meals[i].size)) {
      if(meals[i].on) {
        meals[i].closeDetails();
      } else {
        meals[i].openDetails();
      }   
    } 
  }
}

function mouseReleased() {
  for(let i = 0; i < items.length; i++) {
    items[i].shape.released();
  }
}

function makeButton(text, x, y, w, h, func) {
  button = createButton(text);
  button.position(x, y);
  button.size(w, h);
  button.mousePressed(func);
  button.style('color', color(234, 33, 36));
  button.style('background-color', color(37, 41, 95));
  button.style('border-radius', '12px');
  button.style('border-color', 'transparent');
  button.style('font-family', 'Monaco');
}

function checkDraggables() {
  for(let i=0; i<items.length; i++) {
    for(let j=0; j<items.length; j++) {
      if((items[i].shape.x == items[j].shape.x && items[i].shape.y == items[j].shape.y) && i!=j){
        items[i].shape.x += 10;
        checkDraggables();
        console.log("Overlap");
      }
    }
  }
}