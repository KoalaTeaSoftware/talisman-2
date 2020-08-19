showDebugMsg("loading up listeners");

const sentinelsProductID = "com.earthoracles.celtmistic.premium_sentinels";

// window.addEventListener('load', debugDeviceReady, false); // for debugging in browser
document.addEventListener('deviceready', phoneDeviceReady);

function debugDeviceReady() {
    showDebugMsg("onLoad was triggered");
    onDeviceReady();
};

function phoneDeviceReady() {
    showDebugMsg("deviceReady was triggered");
    onDeviceReady();
};

function onDeviceReady() {
    if ((typeof store) === 'undefined') {
        showDebugMsg("Store is undefined")
        return;
    }
    store.when(sentinelsProductID)
        .updated(refreshUI)
        .approved(finishPurchase);
    store.register({type: store.NON_CONSUMABLE, id: sentinelsProductID});
    store.refresh();
}

function finishPurchase(p) {
    localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
    p.finish();
}

function refreshUI() {
    const product = store.get('cc.fovea.purchase.consumable1');
    const button = `<button onclick="store.order(sentinelsProductID)">Purchase</button>`;

    document.getElementById('display').innerHTML = `
  <div>
  <pre>
  Gold: ${localStorage.goldCoins | 0}

  Product.state: ${product.state}
  .title: ${product.title}
  .descr: ${product.description}
  .price: ${product.price}

  </pre>
  ${product.canPurchase ? button : ''}
  </div>`;
}

function showDebugMsg(msg) {
    const block = document.getElementById("messages");
    block.innerHTML += ("<br>" + msg);
}
