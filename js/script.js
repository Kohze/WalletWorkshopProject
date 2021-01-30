//bsv.js functions
const privKey = bsv.PrivateKey.fromRandom();
const pubKey = bsv.PublicKey.fromPrivateKey(privKey);
const addressFromPub = bsv.Address.fromPublicKey(pubKey).toString();
const addressFromPriv = bsv.Address.fromPrivateKey(privKey).toString();
const addressCode = "bitcoinsv:" + addressFromPriv;
const hdPrivateKey = bsv.HDPrivateKey.fromString("");
const privateKeyStandard = hdPrivateKey.deriveChild("m/44'/0'/0'");
const hdPrivateKeyRand = bsv.HDPrivateKey.fromRandom();
const hdPrivateKeyRecover = bsv.HDPrivateKey.fromString("");
const keyChild = hdPrivateKey.deriveChild("m/5/2/8").toString();
const hdPrivateFromChild = hdPrivateKey.deriveChild("m/5'/2/8").toString();
const privateKeyFromRandHD = hdPrivateKeyRand.privateKey.toString();
const privateKeyFromXprv = privateKeyStandard.privateKey;
const pubKeyFromXprv = bsv.HDPublicKey.fromHDPrivateKey(privateKeyStandard);
const mnemonic = window.bsvMnemonic;
let seedWords = mnemonic.fromRandom();
const hdPrivateKeyFromSeed = bsv.HDPrivateKey.fromSeed(seedWords.toSeed());

//UI elements
const generateDiv = document.getElementById("mnemonicDiv");
const hdPrivateKeyDiv = document.getElementById("hdPrivateKey");
const privateKeyDiv = document.getElementById("privateKey");
const publicKeyDiv = document.getElementById("publicKey");
const addressDiv = document.getElementById("addressDiv");
const walletOutput = document.getElementById("walletOutputText");
const sliderText = document.getElementById("sliderText");
const slider = document.getElementById("myRange");
const mnemonicText = document.getElementById("mnemonicText");
const hdPrivateKeyText = document.getElementById("hdPrivateKeyText");
const privateKeyText = document.getElementById("privateKeyText");
const publicKeyText = document.getElementById("publicKeyText");
const addressText = document.getElementById("addressText");

// add refresh functionality currently just displays the seed after click
// add modal for seed
// work out general UI changes and functionality required
// use a transaction flow chart for improved design?

generateDiv.addEventListener("click", function () {
  mnemonicText.innerHTML = seedWords.phrase.toString();
  console.log("clicked generate mnemonic");
  //let el = hdPrivateKeyFromSeed.toString();
  //el = el.slice(0, 8) + "....";
  //hdPrivateKeyText.innerHTML = el;
});

hdPrivateKeyDiv.addEventListener("click", function () {
  hdPrivateKeyText.innerHTML = hdPrivateKeyFromSeed.toString();
  let el = hdPrivateKeyFromSeed.toString();
  //el = el.slice(0, 8) + "....";

  hdPrivateKeyText.innerHTML = el;
  console.log("clicked HDprivate key");
});

privateKeyDiv.addEventListener("click", function () {
  privateKeyText.innerHTML = privateKeyFromXprv.toString();
  let el = privateKeyFromXprv.toString();
  //el = el.slice(0, 8) + "....";
  privateKeyText.innerHTML = el;
  console.log("clicked privateKey");
});

publicKeyDiv.addEventListener("click", function () {
  publicKeyText.innerHTML = pubKey.toString();
  let el = pubKey.toString();
  //el = el.slice(0, 8) + "....";
  publicKeyText.innerHTML = el;
  console.log("clicked publicKey");
});

addressDiv.addEventListener("click", function () {
  addressText.innerHTML = addressFromPub.toString();
  let el = addressFromPub.toString();
  //el = el.slice(0, 8) + "....";
  addressText.innerHTML = el;
  console.log("clicked address");
});

//need workflow for transaction types

slider.oninput = function () {
  slider.innerHTML = this.value;
  if (this.value <= 33) {
    sliderText.innerHTML = "Choose derivation path... (M/44'/0'/X')";
    walletOutput.innerHTML = privateKeyStandard.toString();
  } else if (this.value <= 66 && this.value >= 33) {
    sliderText.innerHTML = "Choose derivation path... (m/5/2/8)";
    walletOutput.innerHTML = keyChild.toString();
  } else {
    sliderText.innerHTML = "Choose derivation path... (m/5'/2/8)";
    walletOutput.innerHTML = hdPrivateFromChild.toString();
  }
};