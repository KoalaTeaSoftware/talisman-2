showDebugMsg("loading up listeners");

const sentinelsProductID = "com.earthoracles.celtmistic.premium_sentinels";

// window.addEventListener('load', debugDeviceReady, false); // for debugging in browser
document.addEventListener('deviceready', phoneDeviceReady);

// function debugDeviceReady() {
//     showDebugMsg("onLoad was triggered");
//     onDeviceReady();
// }

function phoneDeviceReady() {
    showDebugMsg("deviceReady was triggered");
    onDeviceReady();
}

function onDeviceReady() {
    if ((typeof store) === 'undefined') {
        showDebugMsg("Store is undefined")
        return;
    }
    showDebugMsg("Store is defined")
    store.verbosity = store.DEBUG;

    store.when(sentinelsProductID)
        .updated(function (prod) {
            showDebugMsg("Store Update Triggered for:<pre>" + JSON.stringify(prod, null, 2) + "</pre>:")
            refreshUI();
        })
        .approved(function (prod) {
            showDebugMsg("Store Approved Triggered:<pre>" + JSON.stringify(prod, null, 2) + "</pre>:")
            finishPurchase();
        });

    store.register({type: store.NON_CONSUMABLE, id: sentinelsProductID});
    store.refresh();
    store.error(function (e) {
        showDebugMsg("Store Error: " + e.code + ": " + e.message);
    })
}

function finishPurchase(p) {
    localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
    p.finish();
}

function refreshUI() {
    showDebugMsg("Refreshing the UI");
    const product = store.get(sentinelsProductID);
    if (!product) {
        showDebugMsg("Unable to get the product's details")
        return;
    }
    showDebugMsg("Product is<pre>" + JSON.stringify(product, null, 2) + "</pre>:")

    const button = `<button onclick="store.order(sentinelsProductID)">Purchase</button>`;

    document.getElementById('display').innerHTML = `
  <div>
  <pre>
  Gold: ${localStorage.goldCoins | 0}

  Product.state: ${product.state | "undefined"}
  Product.title: ${product.title | "undefined"}
  Product.descr: ${product.description | "undefined"}
  Product.price: ${product.price | "undefined"}
  Product.canPurchase: ${product.canPurchase | "undefined"}

  </pre>
  ${product.canPurchase ? button : ''}
  </div>`;
}

function showDebugMsg(msg) {
    const block = document.getElementById("messages");
    block.innerHTML += ("<br>" + msg);
}
