// this file will run once on extension load
var config = {
    apiKey: "AIzaSyAPv_-lSK5-v7ZfNmvZ6tJYI13prt2Ofqg",
    authDomain: "cssi-final-project.firebaseapp.com",
    databaseURL: "https://cssi-final-project.firebaseio.com",
    projectId: "cssi-final-project",
    storageBucket: "cssi-final-project.appspot.com",
    messagingSenderId: "768622047992",
    appId: "1:768622047992:web:7ca11a0b79d50ebb81010d",
    measurementId: "G-H3TG8YGS9B",
    
    clientId: "768622047992-ipt85grjap993cesd9t0bagu4bevjeqr.apps.googleusercontent.com",
    
    scopes: [
         "email"
    ]
};

firebase.initializeApp(config);

function initApp() {
  // Listen for auth state changes.
  firebase.auth().onAuthStateChanged(function(user) {
    console.log('User state change detected from the Background script of the Chrome Extension:', user.email);
    writeUserData(user.uid, user.email);
    fill(0);
    userText = "User:" + user.email;
    currUser = user;
    getUserData();
  });
}

window.onload = function() {
  initApp();
};

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
    if(snapshot.val().items != undefined) {
      let itemArr = Object.values(snapshot.val().items);
    
      for(let i = itemArr.length-1; i >= 0; i--){
        let modayr = itemArr[i].expiration.split("/");
        for(let i = 0; i < 3; i++) {
          modayr[i] = parseInt(modayr[i]);
        }
        let date = new Date(modayr[2], modayr[0], modayr[1]);
        
        items.push(new Item(itemArr[i].name, date, itemArr[i].image, itemArr[i].x, itemArr[i].y));
      };
    }
    
  });
}
