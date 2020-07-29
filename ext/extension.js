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
        let modayr = itemArr[i].expiration.split("/");
        console.log(modayr);
        for(let i = 0; i < 3; i++) {
          modayr[i] = parseInt(modayr[i]);
        }
        let date = new Date(modayr[2], modayr[0], modayr[1]);
        
        items.push(new Item(itemArr[i].name, date, itemArr[i].image, itemArr[i].x, itemArr[i].y));
      };
    }

    console.log("GETTING USER DATA");
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

    addDeliveries = createButton('Add Deliveries');
    addDeliveries.position(20, 200);
    addDeliveries.size(75, 50);
    addDeliveries.mousePressed(addFromCart);
}

function draw() {
    background(backgroundColor);
    if(currUser == null) {
      signIn.show();
    } else {
      signIn.hide();
    }
}

function addFromCart() {
  //gets current url
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      console.log(url);

      //specifically for amazon.com
      if(url.includes('amazon')){
        console.log('on amazon');
        let redirectURL = 'https://www.amazon.com/cart/localmarket';
        chrome.tabs.update(tabs[0].id, {url: redirectURL});
      }
  });
}

chrome.tabs.onUpdated.addListener(getInfo);

function getInfo(tabId, changeInfo, tab) {
  console.log('updated');
  if(tab.url == 'https://www.amazon.com/cart/localmarket' && changeInfo.status == 'complete') {
    chrome.tabs.executeScript(tab.id, {
      code: 'elementResults = document.getElementsByClassName("a-size-medium sc-product-title a-text-bold");names = [];for(let i = 0; i < elementResults.length; i++) {names.push(elementResults[i].innerText);}names'
    }, pushToDelivery);
  }
}

function pushToDelivery(cartItems) {
  delivery = cartItems[0];
  console.log(delivery[0]);
}