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
let address,
  addressQr,
  privateKey,
  publicKey,
  hdPrivateKey,
  words,
  mnemonic;

slider.oninput = function () {
  slider.innerHTML = this.value;
  num = this.value;
  derivationPath();
};

//Step 1
function generateQr() {
  
};

//Step 2
const randomMnemonic = function () {
  
};

//Step 3
const hdPrivKeyFunc = function () {
  
};

//Step 4
const privateKeyFunc = function () {
  
};

//Step 5
const publicKeyFunc = function () {
  
};

//Step 6
const addressFunc = function () {
  
};

const derivationPath = () => {
  privateKeyFunc();
  sliderText.innerHTML = `Choose derivation path... (m/44'/0'/${num}')`;

  publicKeyFunc();

  addressFunc();

  generateQr();

  refreshBalance();
};

//Step 7
const refreshBalance = function () {
  
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


