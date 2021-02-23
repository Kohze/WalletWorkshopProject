//UI elements
let generateMnemonic = document.getElementById("newMnemonic");
let sliderText = document.getElementById("sliderText");
let slider = document.getElementById("range");
let mnemonicText = document.getElementById("mnemonicText");
let hdPrivateKeyText = document.getElementById("hdPrivateKeyText");
let privateKeyText = document.getElementById("privateKeyText");
let publicKeyText = document.getElementById("publicKeyText");
let addressText = document.getElementById("addressText");
let qrcode = document.getElementById("qrcode");
let enterMnemonic = document.getElementById("enterMnemonic");

let num = 0;
let qrcodeNew = new QRCode("qrcode");
let address, addressQr, privateKey, publicKey, hdPrivateKey, words, mnemonic;

slider.oninput = function () {
  slider.innerHTML = this.value;
  num = this.value;
  derivationPath();
};

function generateQr() {
  addressQr = "bitcoin:" + address;
  qrcodeNew.makeCode(addressQr);
}

const randomMnemonic = function () {
  mnemonic = window.bsvMnemonic;
  words = mnemonic.fromRandom();
  mnemonicText.value = words.phrase.toString();
};

const hdPrivKeyFunc = function () {
  hdPrivateKey = bsv.HDPrivateKey.fromSeed(words.toSeed());
  hdPrivateKeyText.value = hdPrivateKey.toString();
};

const privateKeyFunc = function () {
  privateKey = hdPrivateKey.deriveChild(`m/44'/0'/${num}'`).privateKey;
  privateKeyText.value = privateKey.toString();
};

const publicKeyFunc = function () {
  publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  publicKeyText.value = publicKey.toString();
};

const addressFunc = function () {
  address = bsv.Address.fromPublicKey(publicKey).toString();
  addressText.value = address.toString();
};

const derivationPath = () => {
  privateKeyFunc();
  sliderText.innerHTML = `Choose derivation path... (m/44'/0'/${num}')`;

  publicKeyFunc();

  addressFunc();

  generateQr();

  refreshBalance();
};

const refreshBalance = function () {
  let config = {
    method: "get",
    url:
      "https://api.whatsonchain.com/v1/bsv/main/address/" +
      address +
      "/balance",
  };

  axios(config).then((response) => {
    let data = JSON.stringify(response.data);
    console.log(data);
    let p = document.getElementById("balance");
    p.value = data;
  });
};

const submitMnemonic = function () {
  try {
    words = bsvMnemonic.fromString(mnemonicText.value);
  } catch (err) {
    console.log(err);
    mnemonicText.style.outline = " solid red 1px";
    return;
  }

  mnemonicText.style.outline = "none";
  hdPrivKeyFunc();

  privateKeyFunc();

  publicKeyFunc();

  addressFunc();

  generateQr();

  refreshBalance();
  console.log(publicKey.toString());
};

generateMnemonic.addEventListener("click", function () {
  mnemonicText.style.outline = "none";
  randomMnemonic();

  hdPrivKeyFunc();

  privateKeyFunc();

  publicKeyFunc();

  addressFunc();

  num = 0;
  slider.value = 0;
  sliderText.innerHTML = `Choose derivation path... (m/44'/0'/${num}')`;
  address = addressText.value;

  generateQr();

  refreshBalance();
});

////////////// Transaction Upgrade///////////////
////////////////////////////////////////////////

//declare variables
let sendTransaction = document.getElementById("sendTransaction");
let sendTo = document.getElementById("sendToText");
let amount = document.getElementById("amountText");
let pushTxText = document.getElementById("pushTxText");
let txExplorer = document.getElementById("txExplorer");
let txBox = document.getElementById("txBox");
let rawTX;
let txidText;

sendTransaction.addEventListener("click", function () {
  var config = {
    safe: true,
    data: ["Satolearn"],
    pay: {
      key: privateKey,
      rpc: "https://api.mattercloud.net",
      feeb: 0.5,
      to: [
        {
          address: sendTo.value,
          value: parseInt(amount.value),
        },
      ],
    },
  };

  filepay.build(config, function (error, tx) {
    //rawTxText.innerHTML = tx.toString();
    rawTX = tx.toString();
    console.log(rawTX);
    pushTx();
  });

  const pushTx = async () => {
    const res = await axios.post(
      "https://merchantapi.taal.com/mapi/tx",
      { rawtx: rawTX },
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
    let txData = res.data;
    let txid = txData.payload;
    txidText = txid.slice(69, 133);
    console.log(txid);
    console.log(txid.slice(69, 133));

    // create new div element to store new tx ID
    let newTx = document.createElement("div");
    txBox.appendChild(newTx);
    newTx.setAttribute(
      "class",
      `"class="uk-card uk-card-default uk-card-body uk-card-small cardColour uk-margin-top" "`
    );
    newTx.innerHTML = txidText;

    // create new world icon for each new transaction element - FIX - need to create id matching previous txs +  DRY fixes on set attributes
    let newExplorerIcon = document.createElement("span");
    newTx.appendChild(newExplorerIcon);
    newExplorerIcon.setAttribute("class", "uk-margin-small-right iconRight");
    newExplorerIcon.setAttribute("uk-icon", "world");
    newExplorerIcon.setAttribute("style", "cursor: pointer");
    newExplorerIcon.setAttribute("id", "txExplorer");
    newExplorerIcon.setAttribute("onClick", "openExplorer()");
  };
});

let openExplorer = function () {
  window.open("https://whatsonchain.com/tx/" + txidText, "_blank");
};
