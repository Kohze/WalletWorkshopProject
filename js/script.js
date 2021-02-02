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
let qrDiv = document.getElementById("qrDiv");
let enterMnemonic = document.getElementById("enterMnemonic");
let qrDivClass = document.querySelector(".qrDivClass");

let num = 0;
let address,
  addressQr,
  privateKey,
  publicKey,
  hdPrivateKey,
  words,
  mnemonic,
  newWords;

slider.oninput = function () {
  slider.innerHTML = this.value;
  num = this.value;
  console.log(num);
  refreshAddresses();
};

const qrGenerate = function () {
  addressQr = "bitcoinsv:" + address;
  new QRCode(document.getElementById("qrcode"), addressQr);
  //QRCode generates a new QR element on top of the last one - remove previous QR before generating new one
};

const randomMnemonic = function () {
  mnemonic = window.bsvMnemonic;
  words = mnemonic.fromRandom();
  mnemonicText.value = words.phrase.toString();
};

const enterMnemonicFunc = function () {
  hdPrivateKey = bsv.HDPrivateKey.fromString(words.toSeed());
  hdPrivateKeyText.value = hdPrivateKey.toString();
  console.log(words);
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

const refreshAddresses = () => {
  privateKeyFunc();
  sliderText.innerHTML = `Choose derivation path... (M/44'/0'/${num}')`;

  publicKeyFunc();

  addressFunc();
};

//Make the output nicer with dollar value and satoshi value
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
    p.innerHTML = data;
  });
};

generateMnemonic.addEventListener("click", function () {
  randomMnemonic();

  hdPrivKeyFunc();

  privateKeyFunc();

  publicKeyFunc();

  addressFunc();

  num = 0;
  slider.value = 0;
  sliderText.innerHTML = `Choose derivation path... (M/44'/0'/${num}')`;
  address = addressText.value;
  qrGenerate();
  refreshBalance();
});

enterMnemonic.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log(mnemonicText.value);
  //need to generate HD key from seed words not object which is created from random generation

  /*words = mnemonicText.value;

  enterMnemonicFunc();

  hdPrivFunc();

  privateKeyFunc();

  publicKeyFunc();

  addressFunc();
  */
});
enterHdPrivKey.addEventListener("submit", function (e) {
  e.preventDefault();

  hdPrivateKey = hdPrivateKeyText.value;
  hdPrivateKey = bsv.HDPrivateKey.fromString(hdPrivateKey);
  privateKeyFunc();
  publicKeyFunc();
  addressFunc();
  mnemonicText.value = "";
});

enterPrivKey.addEventListener("submit", function (e) {
  e.preventDefault();
  privateKey = privateKeyText.value;
  console.log(privateKey);
  //Need to generate public Key from private key string or create privatekey object from private key string
  //publicKeyFunc();
  //addressFunc();
});

////////////////////////////////////////////////////////////
//create function for all copy icons DRY format and move to HTML Script
function copyHD() {
  var copyText = hdPrivateKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied : " + copyText.value);
}
function copyPrivK() {
  var copyText = privateKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied : " + copyText.value);
}

function copyPubK() {
  var copyText = publicKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied : " + copyText.value);
}

function copyAddress() {
  var copyText = addressText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied : " + copyText.value);
}
/*- select not a function when using argument in function -
function copy(elem) {
  var copyText = elem;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}
*/
