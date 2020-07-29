let button, signIn;
let items, delivery;

//Firebase stuff
let provider = new firebase.auth.GoogleAuthProvider();
let database = firebase.database(); 
let currUser = firebase.auth().currentUser;

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
    console.log(userText);
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
  //console.log("Writing user data");
  database.ref(uid + "/email").set(email);
}

function getUserData() {
  firebase.database().ref(currUser.uid).once("value").then(function(snapshot) {
    console.log(Object.values(snapshot.val().items));
    if(snapshot.val().items != undefined) {
      let itemArr = Object.values(snapshot.val().items);
    
      for(let i = itemArr.length-1; i >= 0; i--){
        items.push(new Item(itemArr[i].name, itemArr[i].expiration, itemArr[i].image, itemArr[i].x, itemArr[i].y));
      };

    }
    
    console.log("GETTING USER DATA");
    console.log(items);
    for(let i = 0; i < items.length; i++) {
      console.log(items[i].expiration);
    }
    
  });
}

//------------------------------------------------------------------------------

function setup() {
    createCanvas(200, 400);
    colorMode(HSB, 360, 100, 100);
    backgroundColor = color(52, 9, 96);
    background(backgroundColor);

    signIn = createButton('Sign In');
    signIn.position(20, 20);
    signIn.size(50, 50);
    signIn.mousePressed(login);
    
    items = [];
    delivery = [];


    
}

function draw() {
    background(backgroundColor);
    if(currUser == null) {
      signIn.show();
    } else {
      signIn.hide();
    }
}
