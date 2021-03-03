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
//let pushTxText = document.getElementById("pushTxText");
//let txExplorer = document.getElementById("txExplorer");

let txBox = document.getElementById("txBox");
let txBoxSatoshis = document.getElementById('txBox__satoshis')
let txBoxTxid = document.getElementById('txBox__txid')
let txBoxVout = document.getElementById('txBox__vout')
let txBoxScriptPK = document.getElementById('txBox__scriptPK')

let rawTX;
let newTx;
let num2 = 0;
//let txidText;

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
     utxoData()
   
    let txData = res.data;
      console.log(txData);
    let txid = txData.payload;
      console.log(txid);

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
    //console.log(data)

    let utxoArray = response.data;
    console.log(utxoArray)

    let utxoArrayUI = [...utxoArray]
    //let utxoArrayUI = utxoArray.map((x) => x)
    console.log(utxoArrayUI)
    
    // function filter using two arrays to match differences
    // if tx output txid = txBoxTxid.innerHTML animate red opacity
    const filterArray = utxoArrayUI.filter(value => utxoArray.includes(value))

    console.log(filterArray)
    // refresh UTXO divs


    // refresh the UI -- utxoDiv()
    // create utxo divs with unique ID number -- utxoDiv()
    
    const utxoDiv = function () {

      //reset DIVs on refresh of UTXO list
      while (txBoxSatoshis.firstChild) {
        txBoxSatoshis.removeChild(txBoxSatoshis.firstChild)
    } 
      while (txBoxTxid.firstChild) {
      txBoxTxid.removeChild(txBoxTxid.firstChild)
    } 
      while (txBoxVout.firstChild) {
      txBoxVout.removeChild(txBoxVout.firstChild)
    } 
      while (txBoxScriptPK.firstChild) {
      txBoxScriptPK.removeChild(txBoxScriptPK.firstChild)
    } 
    //map UTXO array to add in DIVs for 4 object values per array index
      utxoArray.map(utxoArrayUI => {    
        txBox1 = document.createElement("div");
        txBox2 = document.createElement("div");
        txBox3 = document.createElement("div");
        txBox4 = document.createElement("div");

        txBoxSatoshis.appendChild(txBox1); 
        txBox1.setAttribute("id", `tx${num2}`);
        txBox1.setAttribute("style", "min-height: 50px; max-height: 50px; padding: 10px; background-color: orange");
        txBox1.innerHTML = utxoArrayUI.satoshis;

        txBoxTxid.appendChild(txBox2); 
        txBox2.setAttribute("id", `tx${num2}`);
        txBox2.setAttribute("style", "word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px; background-color: blue; cursor: pointer");
        txBox2.innerHTML = utxoArrayUI.txid;
        txBox2.addEventListener('click', function() {
          window.open(
            "https://whatsonchain.com/tx/" +
              utxoArrayUI.txid,
            "_blank"
          );
        })

        txBoxVout.appendChild(txBox3); 
        txBox3.setAttribute("id", `tx${num2}`);
        txBox3.setAttribute("style", "word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px; background-color: green");
        txBox3.innerHTML = utxoArrayUI.vout;

        txBoxScriptPK.appendChild(txBox4); 
        txBox4.setAttribute("id", `tx${num2}`);
        txBox4.setAttribute("style", "word-wrap: break-word; min-height: 50px; max-height: 50px; padding: 10px;  background-color: purple");
        txBox4.innerHTML = utxoArrayUI.scriptPubKey;
        num2++
        console.log(utxoArrayUI.txid)
        })
      }
      
      utxoDiv()

    })
    
  };






///////////// TEST SAMPLE CODE////////////
/*
    let txData = res.data;
    console.log(txData);
    let txid = txData.payload;
    txidText = txid.slice(69, 133);
    console.log(txid);
    console.log(txid.slice(69, 133));

    // create new div element to store new tx ID
    newTx = document.createElement("div");
    txBox.appendChild(newTx);
    newTx.setAttribute(
      "class",
      `"class="uk-card uk-card-default uk-card-body uk-card-small uk-margin-top newTx" "`
    );

    newTx.setAttribute("id", `tx${num2}`);
    newTx.setAttribute("style", "margin: 20px; word-wrap: break-word");
    newTx.innerHTML = txidText;

    // create new world icon for each new transaction element
    let newExplorerIcon = document.createElement("span");
    newTx.appendChild(newExplorerIcon);
    newExplorerIcon.setAttribute("class", "uk-margin-small-right iconRight");
    newExplorerIcon.setAttribute("uk-icon", "world");
    newExplorerIcon.setAttribute("style", "cursor: pointer");
    newExplorerIcon.setAttribute("id", `txExplorer${num2}`);

    // add event listener function to open block explorer with relevant txid
    document
      .getElementById(`txExplorer${num2}`)
      .addEventListener("click", function () {
        window.open(
          "https://whatsonchain.com/tx/" +
            this.parentElement.innerHTML.slice(0, 64),
          "_blank"
        );
      });
    num2++;
*/

/*
    const utxoDiv = function () {
      utxoArrayUI.map(utxoArrayUI => {    
        newTx = document.createElement("div");
        txBox.appendChild(newTx);
        newTx.setAttribute(
          "class",
          `"class="uk-card uk-card-default uk-card-body uk-card-small uk-margin-top newTx" "`
        );
        newTx.setAttribute("id", `tx${num2}`);
        newTx.setAttribute("style", "margin: 20px; word-wrap: break-word");
        newTx.innerHTML = utxoArrayUI.amount;
        num2++
        console.log(utxoArrayUI.txid)

          setTimeout(() => {
            for (let a = 0; a < utxoArray.length; a++)
          if (newTx.innerHTML == utxoArray[a].txid) {
            console.log(`match`);
            console.log(utxoArray[a].txid)
            newTx.style.color = "green"                      
          } else {
            newTx.style.color = "red"                    
          } 
          }, 2000);   
      }
    )}
*/

/* 
    const filterArray = utxoArrayUI.filter(value => utxoArray.includes(value))

    console.log(filterArray)
*/

/*
    loopArrays = function() {
      for (let a = 0; a < utxoArray.length; a++)
          if (newTx.innerHTML == utxoArray[a].txid) {
            console.log(`match`);
            console.log(utxoArray[a].txid)
            newTx.style.color = "green"                   
          } else {
            newTx.style.color = "red"             
          } 
    }
    setTimeout(() => {
      loopArrays()
    }, 2000);
*/

/*       
const checkArray = function() {

  for (let i = 0; i < utxoArray.length; i++) {
    for (let a = 0; a < utxoArrayUI.length; a++)
      if (utxoArrayUI[i].includes(utxoArray[a])) {
        console.log(
          `we found a match array1 ${utxoArrayUI[i]} and array2 ${utxoArray[a]}`
        );
      } else {
        console.log("no match");  
      }
  }
}
 // Replace while loop with for loop check if TXID matches utxoArray from data source. Use "ID" attribute in loop to check over all innerHTML to see if it matches current UTXO txids. 
    // if utxoArray element != current source Array then remove div.
    // add in another if statment where if current array does not match to arrayUI then add element.

    
    //checkArray()
*/
     
    
    
/* 
    loopArrays = function() {
      for (let a = 0; a < utxoArray.length; a++)
          if (newTx.innerHTML == utxoArray[a].txid) {
            console.log(`match`);
            console.log(utxoArray[a].txid)
            newTx.style.color = "green"            
          } else {
            newTx.style.color = "red"            
          } 
    }
    setTimeout(() => {
      loopArrays()
    }, 2000);
*/

/*
    const loopArray = function() {
        let i;
        let num3 = 0
        for(i = 0; i < utxoArrayUI.length; i++) {
          newTx = document.createElement("div");
      txBox.appendChild(newTx);
      newTx.setAttribute(
        "class",
        `"class="uk-card uk-card-default uk-card-body uk-card-small uk-margin-top newTx" "`
      );
      newTx.setAttribute("id", `tx${num3}`);
      
      newTx.setAttribute("style", "margin: 20px; word-wrap: break-word");
      newTx.innerHTML = utxoArrayUI.txid;
      num3++
      
        }
      }
      loopArray()
*/

    
/*
    utxoArrayUI.forEach((element) => {
      newTx = document.createElement("div");
      txBox.appendChild(newTx);
      newTx.setAttribute(
        "class",
        `"class="uk-card uk-card-default uk-card-body uk-card-small uk-margin-top newTx" "`
      );
      newTx.setAttribute("id", `tx${num2}`);
      newTx.setAttribute("style", "margin: 20px; word-wrap: break-word");
      newTx.innerHTML = element.txid;
      num++
      
    });
*/


