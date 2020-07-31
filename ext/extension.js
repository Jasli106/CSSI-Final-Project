let addDeliveries, signIn, delivered;
let items, delivery;

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
    addDeliveries.position(75, 370);
    addDeliveries.size(70, 30);
    addDeliveries.style('font-size', '10px');
    addDeliveries.mousePressed(addFromCart);

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
  delivery = cartItems[0]; //Why not delivery = cartItems? Which cart items?
  console.log(delivery[0]);
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
    text(delivery[i].name, i*70+30, 200);
    textSize(16);
    //Add delivered button (TODO: not sure if this works?)
    delivered = createButton('Delivered!');
    delivered.size(50, 10);
    delivered.position(i*70+30, 205)
    delivered.style('font-size', '6px');
    delivered.mousePressed(deliveryDelivered());
  }
}

function deliveryDelivered(){
  //Prompt for date
  //Create new item with (item.name, prompt input formatted as date, x: width/2, y: height/2) somehow
  //Add new item to items array
  //Remove item from delivery array
}
