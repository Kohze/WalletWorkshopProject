//bsv.js functions
let privKey = bsv.PrivateKey.fromRandom();
let pubKey = bsv.PublicKey.fromPrivateKey(privKey);
let addressFromPub = bsv.Address.fromPublicKey(pubKey).toString();
let addressFromPriv = bsv.Address.fromPrivateKey(privKey).toString();
let addressCode = "bitcoinsv:" + addressFromPriv;
let hdPrivateKey = bsv.HDPrivateKey.fromString("");
let privateKeyStandard = hdPrivateKey.deriveChild("m/44'/0'/0'");
let hdPrivateKeyRand = bsv.HDPrivateKey.fromRandom();
let hdPrivateKeyRecover = bsv.HDPrivateKey.fromString("");
let keyChild = hdPrivateKey.deriveChild("m/5/2/8").toString();
let hdPrivateFromChild = hdPrivateKey.deriveChild("m/5'/2/8").toString();
let privateKeyFromRandHD = hdPrivateKeyRand.privateKey.toString();
let privateKeyFromXprv = privateKeyStandard.privateKey;
let pubKeyFromXprv = bsv.HDPublicKey.fromHDPrivateKey(privateKeyStandard);
let mnemonic = window.bsvMnemonic;
let seedWords = mnemonic.fromRandom();
let hdPrivateKeyFromSeed = bsv.HDPrivateKey.fromSeed(seedWords.toSeed());

//UI elements
let newMnemonic = document.getElementById("newMnemonic");
let sliderText = document.getElementById("sliderText");
let slider = document.getElementById("range");
let mnemonicText = document.getElementById("mnemonicText");
let hdPrivateKeyText = document.getElementById("hdPrivateKeyText");
let privateKeyText = document.getElementById("privateKeyText");
let publicKeyText = document.getElementById("publicKeyText");
let addressText = document.getElementById("addressText");

let num = 0;
slider.oninput = function () {
  slider.innerHTML = this.value;
  num = this.value;
  console.log(num);
  sliderAddress();
};

const sliderAddress = () => {
  let privateKey = hdPrivateKey.deriveChild(`m/44'/0'/${num}'`).privateKey;
  privateKeyText.value = privateKey.toString();
  sliderText.innerHTML = `Choose derivation path... (M/44'/0'/${num}')`;

  let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  publicKeyText.innerHTML = publicKey.toString();

  let address = bsv.Address.fromPublicKey(publicKey).toString();
  addressText.innerHTML = address.toString();
};
let c;

//add modal for seed
newMnemonic.addEventListener("click", function () {
  let mnemonic = window.bsvMnemonic;
  words = mnemonic.fromRandom();
  mnemonicText.value = words.phrase.toString();

  let hdPrivateKey = bsv.HDPrivateKey.fromSeed(words.toSeed());
  hdPrivateKeyText.value = hdPrivateKey.toString();

  let privateKey = hdPrivateKey.deriveChild(`m/44'/0'/${num}'`).privateKey;
  privateKeyText.value = privateKey.toString();

  let publicKey = bsv.PublicKey.fromPrivateKey(privateKey);
  publicKeyText.innerHTML = publicKey.toString();

  let address = bsv.Address.fromPublicKey(publicKey).toString();
  addressText.innerHTML = address.toString();

  num = 0;
  slider.value = 0;
  sliderText.innerHTML = `Choose derivation path... (M/44'/0'/${num}')`;
});

//create function for text box adjustment on input fields
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
