//UI elements
let generateMnemonic = document.getElementById("newMnemonic");
let sliderText = document.getElementById("sliderText");
let slider = document.getElementById("range");
let mnemonicText = document.getElementById("mnemonicText");
let hdPrivateKeyText = document.getElementById("hdPrivateKeyText");
let privateKeyText = document.getElementById("privateKeyText");
let publicKeyText = document.getElementById("publicKeyText");
let addressText = document.getElementById("addressText");
let qrcode = document.getElementById("qrModal");
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
let utxoAppend = document.getElementById("utxoAppend");

let rawTX;
let newTx;
let utxoArrayUI = [];
let utxoArray = [];
let differenceArray;
let x;

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
    // after pushing a transaction call function to get new utxo data --

    let txData = res.data;
    console.log(txData);
    let txid = txData.payload;
    console.log(txid);

    setTimeout(() => {
      utxoData();
    }, 1000);
  };
});

// function to get utxo data from address
const utxoData = function () {
  let config = {
    method: "get",
    url: `https://api.mattercloud.net/api/v3/main/address/${address}/utxo`,
  };
  axios(config).then((response) => {
    let data = JSON.stringify(response.data);
    console.log(data);

    // UPDATE ARRAY OF UTXOS
    utxoArray = response.data;
    console.log(utxoArray);

    x = utxoArray.map(function (a) {
      return a.txid + a.scriptPubKey + a.vout + a.satoshis;
    });
    console.log(x);
    console.log(utxoArrayUI);

    // if array is empty then fill it with current data
    if (utxoArrayUI === []) {
      utxoArrayUI = [...x];
    }
    // check for over lap and animate difference
    const arrayOverlap = function () {
      differenceArray = utxoArrayUI.filter((value) => !x.includes(value));
      console.log(differenceArray);

      differenceArray.forEach(function (x) {
        document.getElementById(x).style.border = "5px red solid";
      });
    };
    // refresh UI and update utxo data
    const updateUtxo = function () {
      while (utxoAppend.firstChild) {
        utxoAppend.removeChild(utxoAppend.firstChild);
      }
      utxoArrayUI.forEach(function (arr) {
        const html = `
        <div id="${arr}" style="display: flex">
    
          <div style="min-height: 50px; max-height: 50px; padding: 10px; background-color: orange; width: 13%">${arr.slice(
            115,
            arr.length
          )} </div>
    
          <div style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px; background-color: green; width: 8%">${arr.slice(
            114,
            115
          )} </div>
    
          <div style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px; background-color: blue; cursor: pointer; width: 43%">${arr.slice(
            0,
            64
          )} </div>
    
          <div style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px;  background-color: purple; width: 36%">${arr.slice(
            64,
            114
          )} </div>
    
      </div>
        
        `;
        utxoAppend.insertAdjacentHTML("beforeend", html);
      });
    };

    setTimeout(() => {
      arrayOverlap();
    }, 1000);

    // add in time out to allow animation
    setTimeout(() => {
      //update array and then update UI
      utxoArrayUI = [...x];
      updateUtxo();
    }, 4000);
  });
};
