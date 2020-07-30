let button, signIn;
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
      textAlign(CENTER);
      text("Expiring Soon:", 60, 30);
      checkDates();
      addDeliveries.show();
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
  delivery = cartItems[0];
  console.log(delivery[0]);
}
