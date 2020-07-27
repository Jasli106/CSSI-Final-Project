/* global firebase, Meal, Item, keyCode, BACKSPACE, CompostBin, TrashCan, noStroke, Draggable, windowWidth, createButton, collideRectRect, windowHeight, collideRectCircle,keyIsDown, RETURN, didHitCollectible, collideCircleCircle, fill, rect, ellipse, textSize, text, createCanvas, colorMode, HSB, random, width, height, background */

let button, signIn, userText;
let meals;
let items;
let compost, trashT;
var currUser = firebase.auth().currentUser;

//Firebase stuff
let provider = new firebase.auth.GoogleAuthProvider();
let database = firebase.database();

function login() {
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

function writeUserData(uid, email) {
  console.log("Writing user data");
  database.ref(uid + "/email").set(email);
}

function getUserData() {
  firebase.database().ref(currUser.uid).once("value").then(function(snapshot) {
    console.log(Object.values(snapshot.val().items));
    console.log(snapshot.val().meals);
    if(snapshot.val().meals != undefined) {
      let mealArr = Object.values(snapshot.val().meals);
      for(let i = mealArr.length-1; i >= 0; i--){
        meals.push(new Meal(mealArr[i].name));
      };
    }
    if(snapshot.val().items != undefined) {
      let itemArr = Object.values(snapshot.val().items);
    
      for(let i = itemArr.length-1; i >= 0; i--){
        items.push(new Item(itemArr[i].name, itemArr[i].expiration, itemArr[i].image, itemArr[i].x, itemArr[i].y));
      };
    }
    
    
  });
}
//-----------------------------------------------------------------------


// functions called by p5
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100);
  background(186, 20, 100);
  meals = [];
  items = [];
  compost = new CompostBin();
  trashT = new TrashCan();
  
  button = createButton('Add Meal');
  button.position(width/2, height/4);
  button.size(50, 50);
  button.mousePressed(createMeal);
  
  button = createButton('Add Item');
  button.position(width/2, height/4*3);
  button.size(50, 50);
  button.mousePressed(addItem);
  
  signIn = createButton('Sign In');
  signIn.position(20, 20);
  signIn.size(50, 50);
  signIn.mousePressed(login);
  
}

function draw() {
  background(186, 20, 100);
  trashT.draw();
  compost.draw();
  
  //draw meals
  for(let i=0;i<meals.length;i++) {
    meals[i].draw();
  }
  
  //draw ingredients
  for(let i=0;i<items.length;i++) {
    items[i].draw();
    if(items[i].shape.dragging == false) {
      items[i].dragMeal();
      items[i].trashItem();
      items[i].compostItem();
    } 
  }
  
  text(userText, width/2, height/2);
}


function createMeal() {
  //console.log("Creating Meal");
  let name = window.prompt("What is this meal called?");
  if(name != null) {
    let meal = new Meal(name);
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
    let date = window.prompt("When does it expire?"); //change date type
    
    let item = new Item(name, date, null, width/2, height/2);
    items.push(item);  
    
    if(currUser != null) {
      database.ref(currUser.uid + "/items/" + name).set({
        name: item.name,
        expiration: item.expiration,
        imageURL: item.imageURL,
        meal: item.meal,
        x: item.shape.x,
        y: item.shape.y
      });
    }
    
  }
  
}

function mousePressed() {
  //for dragging and dropping items
  for(let i = 0; i < items.length; i++) {
    items[i].shape.pressed();
  }
  
  for(let i = 0; i < meals.length; i++) {
    meals[i].openDetails();
  }
}

function mouseReleased() {
  for(let i = 0; i < items.length; i++) {
    items[i].shape.released();
  }
}