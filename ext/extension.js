let addDeliveries, signIn, delivered;
let items, delivery;

//------------------------------------------------------------------------------

function setup() {
    createCanvas(200, 400);
    colorMode(HSB, 360, 100, 100);
    backgroundColor = color(52, 9, 96);
    background(backgroundColor);
    
    items = [];
    delivery = [];

    drawButtons();

}

function draw() {
    background(backgroundColor);
    if(currUser == null) {
      signIn.show();
      addDeliveries.hide();
    } else { //If signed in
      signIn.hide();
      textSize(16);
      fill(0);
      textAlign(LEFT);
      text("Expiring Soon:", 10, 30);
      text("Delivery:", 10, 150);
      checkDates();
      addDeliveries.show();
      drawDelivery();
    }
}

function drawButtons() {
  addDeliveries = createButton('Add Deliveries');
  addDeliveries.position(75, 370);
  addDeliveries.size(70, 30);
  addDeliveries.style('font-size', '10px');
  addDeliveries.mousePressed(addFromCart);

  signIn = createButton('Sign In');
  signIn.position(20, 20);
  signIn.size(50, 50);
  signIn.mousePressed(login);
}

//Determine which items to show in extension
function checkDates() {
  for(let i=0; i<items.length; i++){
    let compareDate = items[i].expiration;
    let currentDate = Date.now();
    let timeLeft = compareDate.getTime()-currentDate;
    if(timeLeft <= 3221501482) { //1 week
      items[i].drawExt(i);
    }
  }
}

function addFromCart() {
  //gets current url
  chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
      let url = tabs[0].url;
      //console.log(url);

      //specifically for amazon.com
      if(url.includes('amazon')){
        //console.log('on amazon');
        let redirectURL = 'https://www.amazon.com/cart/localmarket';
        chrome.tabs.update(tabs[0].id, {url: redirectURL});
      }
  });
}

chrome.tabs.onUpdated.addListener(getInfo);

function getInfo(tabId, changeInfo, tab) {
  //console.log('updated');
  if(tab.url == 'https://www.amazon.com/cart/localmarket' && changeInfo.status == 'complete') {
    chrome.tabs.executeScript(tab.id, {
      code: 'elementResults = document.getElementsByClassName("a-size-medium sc-product-title a-text-bold");names = [];for(let i = 0; i < elementResults.length; i++) {names.push(elementResults[i].innerText);}names'
    }, pushToDelivery);
  }
}

function pushToDelivery(cartItems) {
  delivery = cartItems[0];
  drawDeliveryButtons();
}

function drawDelivery(){
  for(let i=0; i<delivery.length; i++) {
    //Draw boxes and text
    noStroke();
    fill(100);
    rectMode(CENTER);
    textAlign(CENTER);
    textSize(8);
    rect(i*70+30, 200, 50, 50);
    fill(0);
    text(delivery[i], i*70+30, 200, 50, 50);
    textSize(16);
  }
}

function drawDeliveryButtons() {
  console.log(delivery);
  for(let i=0; i<delivery.length; i++) {
    //Add delivered button
    delivered = createButton('Delivered!');
    delivered.size(50, 10);
    delivered.position(i*70+12.5, 230)
    delivered.style('font-size', '6px');
    delivered.mousePressed(function() { deliveryDelivered(delivery[i], i);});

    database.ref(currUser.uid + "/delivery/" + delivery[i]).set({
      name: delivery[i],
    });

  }
}

function deliveryDelivered(name, index){
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
  
  let date = new Date(modayr[2], modayr[0], modayr[1]);     
  let item = new Item(name, date, null, width/2, height/2);
  items.push(item);

  delivery.splice(index, 1);
  
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

    database.ref(currUser.uid + "/delivery/" + name).remove();
  }

  var all = document.getElementsByTagName("*");

  for (var i=0; i < all.length; i++) {
      if(all[i].innerHTML == "Delivered!") {
        console.log(all[i].innerHTML);
        all[i].style.display = "none";
      }
  }
  drawDeliveryButtons();
}
