//UI elements
let newMnemonic = document.getElementById("newMnemonic");
let sliderText = document.getElementById("sliderText");
let slider = document.getElementById("range");
let mnemonicText = document.getElementById("mnemonicText");
let hdPrivateKeyText = document.getElementById("hdPrivateKeyText");
let privateKeyText = document.getElementById("privateKeyText");
let publicKeyText = document.getElementById("publicKeyText");
let addressText = document.getElementById("addressText");
let qrcode = document.getElementById("qrcode");
let pkform = document.getElementById("pkForm");

let num = 0;
let address, addressQr, privateKey, publicKey, hdPrivateKey, words;

slider.oninput = function () {
  slider.innerHTML = this.value;
  num = this.value;
  console.log(num);
  refreshAddresses();
};

const qrGenerate = function () {
  console.log(address);
  addressQr = "bitcoinsv:" + address;
  new QRCode(document.getElementById("qrcode"), addressQr);
  //QRCode generates a new QR element on top of the last one - remove previous QR before generating new one
};

const publicKeyFunc = function () {
  publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  publicKeyText.value = publicKey.toString();
};

const privateKeyFunc = function () {
  privateKey = hdPrivateKey.deriveChild(`m/44'/0'/${num}'`).privateKey;
  privateKeyText.value = privateKey.toString();
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

newMnemonic.addEventListener("click", function () {
  mnemonic = window.bsvMnemonic;
  words = mnemonic.fromRandom();
  mnemonicText.value = words.phrase.toString();

  hdPrivateKey = bsv.HDPrivateKey.fromSeed(words.toSeed());
  hdPrivateKeyText.value = hdPrivateKey.toString();

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

/*- select not a function when using argument in function -
function copy(elem) {
  var copyText = elem;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}
*/

//create function for all copy icons DRY format
function copyHD() {
  var copyText = hdPrivateKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}
function copyPrivK() {
  var copyText = privateKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function copyPubK() {
  var copyText = publicKeyText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

function copyAddress() {
  var copyText = addressText;
  copyText.select();
  copyText.setSelectionRange(0, 99999);
  document.execCommand("copy");
  alert("Copied the text: " + copyText.value);
}

// input function not working needs a fix
const pkForm = function () {
  privateKeyText.value = privateKey;
  console.log(privateKey);
  publicKeyFunc();
  addressFunc();
};
