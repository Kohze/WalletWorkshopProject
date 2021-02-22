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
let sendTransaction = document.getElementById('sendTransaction')
let sendTo = document.getElementById('sendToText')
let amount = document.getElementById('amountText')
let rawTxText = document.getElementById('rawTxText')
let pushTxText = document.getElementById('pushTxText')

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
  console.log(publicKey.toString())
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

/*
https.get('https://api.mattercloud.net/api/v3/main/address/${address.toString()}/utxo', (res) => {
  let data = "";
  res.on('data', (chunk) => {
    data += chunk
  })
  res.on('end', ()=> {
    let resp = JSON.parse(data)
  })
})
*/

let rawTX
sendTransaction.addEventListener('click', function () {
  var config = {
    safe: true,
    data: ["Satolearn"],
    pay: {
       key: privateKey ,
       rpc: "https://api.mattercloud.net",
       feeb: 0.5,
       to: [{
        address: sendTo.value,
        value: parseInt(amount.value) 
       }]
   }
   }

setTimeout(() => {
  filepay.build(config, function(error, tx) {
        
    //rawTxText.innerHTML = tx.toString(); 
    rawTX = tx.toString()
    console.log(rawTX)
});
}, 1000);


setTimeout(() => {
  const pushTx = async () => {
    const res = await axios.post(
          "https://merchantapi.taal.com/mapi/tx",
          { rawtx: rawTX },
          {
            headers: {
              "content-type": "application/json"
            }
          }
        );
        let txData = res.data;
        let txid = txData.payload;
        console.log(txid)
        //pushTxText.innerHTML = txid;
    };
        
    pushTx();
}, 2000);

  /*
  console.log(address)
  console.log(sendTo.value)
  console.log(amount.value)
  console.log(privateKey)
  const utxo = new bsv.Transaction.UnspentOutput({
    "txId" : "bf14b65d1627f665f21bf656c5b3a7e99d8237cf0e038a1a46bf704524ab5bcf",
    "outputIndex" : 2,
    "address" : "1C3ifsTFkfP1RSBSXcV117iyrFnv2gwZCn",
    "script" : "76a914792d00036023fdbd165b6947e4f7934ac9f1d55088ac",
    "satoshis" : 327450
  });
  
  const transaction = new bsv.Transaction()
  .from(utxo)
  .to(sendTo.value, parseInt(amount.value))
  .change(address)
  .sign(privateKey);
     
  var p = document.querySelector("#rawTx");
  p.innerHTML = transaction.toString();
  
  */
})




