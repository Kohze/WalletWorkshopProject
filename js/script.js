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

  utxoUpdateUI();
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

  utxoUpdateUI();
});

////////////// Transaction Upgrade///////////////
////////////////////////////////////////////////

//declare variables
let sendTransaction = document.getElementById("sendTransaction");
let sendTo = document.getElementById("sendToText");
let amount = document.getElementById("amountText");
let utxoAppend = document.getElementById("utxoAppend");
let loader = document.getElementById("loader");

let txData;
let txid;
let txStatus;
let rawTX;
let utxoArray = [];
let utxoCombinedAmount = 0;
let utxoArrayInput = [];
let openExplorer;

////////////////////////////////////////////////////////////////////
// function to get utxo data from address

const utxoData = function () {
  utxoArray = [];
  let config = {
    method: "get",
    url: `https://api.mattercloud.net/api/v3/main/address/${address}/utxo`,
  };
  axios(config).then((response) => {
    utxoArray = response.data;
    console.log(utxoArray);
  });
};

/////////////////////////////////////////////////////////////
// refresh UI and update utxo data
const updateUtxo = function () {
  while (utxoAppend.firstChild) {
    utxoAppend.removeChild(utxoAppend.firstChild);
  }
  utxoArray.forEach(function (arr) {
    const html = `
        <div id="${
          arr.txid + arr.scriptPubKey + arr.vout + arr.satoshis
        }" style="display: flex; width: 100%">
    
          <div style="min-height: 50px; max-height: 50px; padding: 10px 0px; background-color: rgb(255, 165, 0, 0.3); min-width: 16%"><div style="padding: 10px">${
            arr.satoshis
          }</div> </div>
    
          <div style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px 0px; background-color: rgba(0, 255, 0, 0.3); min-width: 9%"><div style="padding: 10px">${
            arr.vout
          }</div>
           </div>
    
          <div 
          style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding:10px 0px; background-color: rgba(0, 0, 255, 0.3); cursor: pointer; min-width: 42%"><div style="padding: 10px">${
            arr.txid
          }</div>
          </div>
    
          <div style="word-wrap: break-word; min-height: 50px; max-height: 50px; padding:10px 0px;  background-color: rgba(128,0,128,0.3); min-width: 33%"><div style="padding: 10px">${
            arr.scriptPubKey
          }</div>
            
           </div>
    
      </div> 
        `;
    utxoAppend.insertAdjacentHTML("beforeend", html);
  });
};

//////////////////////////////////////////////////////////////////
// animate utxo DIVs that are removed from utxo array
const animateDivs = function () {
  utxoArrayInput.forEach(function (a) {
    let section = document.getElementById(
      a.txid + a.script + a.vout + a.amount
    );
    section.style.color = "red";
    section.style.opacity = 0;
    section.style.transition = "opacity 3s linear 2.5s, color 1s linear 0s";
  });
};

///////////////////////////////////////////////////////////////////
// create function to update the UI with timeout to fetch data
const utxoUpdateUI = function () {
  utxoData();
  setTimeout(() => {
    updateUtxo();
  }, 1500);
};

////////////////////////////////////////////////////////////////////
// create function to see if the satoshis in the utxos are < send amount
const checkSatoshis = function () {
  utxoCombinedAmount = 0;
  utxoArrayInput = [];
  for (let i in utxoArray) {
    if (utxoCombinedAmount < amount.value) {
      let el = utxoArray[i];
      utxoArrayInput.push({
        txid: el.txid,
        amount: el.value,
        script: el.scriptPubKey,
        vout: el.vout,
      });
      utxoCombinedAmount += el.value;
    } else {
      break;
    }
  }
};

////////////////////////////////////////////////////////
//push tx
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
  //reset variables
  txData = 0;
  txid = 0;
  txStatus = 0;

  txData = res.data;
  console.log(txData);
  txid = txData.payload;

  txStatus = JSON.parse(txid);
  console.log(txStatus);

  openExplorer = function () {
    window.open(`https://whatsonchain.com/tx/${txStatus.txid}`);
  };
};

/////////////////////////////////////////////////////
//successful transaction sequence
const txSuccess = function () {
  setTimeout(() => {
    utxoUpdateUI();
    refreshBalance();
    setTimeout(() => {
      loader.style.visibility = "hidden";
      sendTransaction.disabled = false;
      sentTxDisplay();
    }, 1500);
  }, 4000);
};

/////////////////////////////////////////////////////
// send transaction with all function sequences
sendTransaction.addEventListener("click", function () {
  checkSatoshis();
  var config = {
    safe: true,
    data: ["Satolearn"],
    pay: {
      key: privateKey,
      rpc: "https://api.mattercloud.net",
      feeb: 0.5,
      inputs: utxoArrayInput,
      to: [
        {
          address: sendTo.value,
          value: parseInt(amount.value),
        },
      ],
    },
  };

  //add if statement if send amount is too low *135 min dust limit
  if (amount.value < 135) {
    console.log("error 64 dust");
    amount.style.outline = " solid red 1px";
    amount.style.color = "red";
    amount.value = "dust limit 135";
  } else {
    ///////////////////////////////////////////////////////

    //build tx
    //catch error make border red on send to address
    try {
      filepay.build(config, function (error, tx) {
        rawTX = tx.toString();
        loader.style.visibility = "visible";
        sendTransaction.disabled = true;
        animateDivs();
        pushTx();
        txSuccess();
      });
    } catch (e) {
      console.log(e);
      sendTo.style.outline = "red solid 1px";
    }
  }
});
