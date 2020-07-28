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
    console.log('User state change detected from the Background script of the Chrome Extension:', user);
  });
}

window.onload = function() {
  initApp();
};