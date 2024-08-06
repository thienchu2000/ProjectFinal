function showPendingModal() {
  document.getElementById("nftpending").style.display = "block";
}

function hidePendingModal() {
  document.getElementById("nftpending").style.display = "none";
}

function showPendingModall() {
  document.getElementById("Mint").style.display = "block";
}

function hidePendingModall() {
  document.getElementById("Mint").style.display = "none";
}

function displayResults(results) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  results.forEach((result, index) => {
    const parsedResult = JSON.parse(result);
    const transactionElement = document.createElement("div");
    transactionElement.innerHTML = `
      <p>Transaction ${index + 1}:</p>
      <p> <a href="https://sepolia.etherscan.io/tx/${
        parsedResult.Sell
      }">Check Transaction Sell</a></p>
      <p> <a href="https://sepolia.etherscan.io/tx/${
        parsedResult.TransferBack
      }">Check Transaction TransferBack</a></p>
    `;
    resultContainer.appendChild(transactionElement);
  });
}
function display(results) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  results.forEach((result, index) => {
    const parsedResult = JSON.parse(result);
    const transactionElement = document.createElement("div");
    transactionElement.innerHTML = `
      <p> <a href="https://sepolia.etherscan.io/tx/${parsedResult}">Check Transaction </a></p>
    `;
    resultContainer.appendChild(transactionElement);
  });
}
function displayy(results) {
  const resultContainer = document.getElementById("result");
  resultContainer.innerHTML = "";

  results.forEach((result, index) => {
    const parsedResult = JSON.parse(result);
    const transactionElement = document.createElement("div");
    transactionElement.innerHTML = `
    <p> <a href="https://sepolia.etherscan.io/tx/${parsedResult}">Check Call Function </a></p>
    `;
    resultContainer.appendChild(transactionElement);
  });
}

function volumeFake() {
  var unpause = false;
  const transactions = document.getElementById("transactions").value;
  const transactionTime = document.getElementById("transactionTime").value;
  const wallet = document.getElementById("wallet").value;

  const pricemin = document.getElementById("pricemin").value;
  const pricemax = document.getElementById("pricemax").value;

  if (!transactions || transactions <= 0) {
    return alert("Please enter a valid number of transactions");
  }

  if (!transactionTime || transactionTime <= 0) {
    return alert("Please select a valid transaction time");
  }

  showPendingModal();

  axios
    .post("/admin/volumFake", {
      transactions,
      transactionTime: Number(transactionTime),
      wallet,
      unpause,
      pricemin: Number(pricemin),
      pricemax: Number(pricemax),
    })
    .then((response) => {
      displayResults(response.data.result);
      alert("volume creation successful");
      hidePendingModal();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModal();
    });
}

function unpause() {
  var unpause = true;

  axios
    .post("/admin/volumFake", {
      unpause,
    })
    .then((response) => {
      displayResults(response.data.result);
      alert("unpause successful");
      hidePendingModal();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModal();
    });
}

function mintToken() {
  const MintAmount = document.getElementById("MintAmount").value;
  const MintWallet = document.getElementById("MintWallet").value;
  showPendingModall();
  axios
    .post("/admin/mintTk", {
      MintAmount,
      MintWallet,
    })
    .then((response) => {
      window.location.reload();
      display(response.data.message);
      alert("successful");
      hidePendingModall();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModall();
    });
}
function mintNft1() {
  const SmartContact = "0xb4436D31E4Db1Ed2FC55262A93aF9D3b946fEE78";
  console.log(SmartContact);
  const mintNft = document.getElementById("mintNft").value;
  showPendingModall();
  axios
    .post("/admin/mintNft", {
      mintNft,
      SmartContact,
    })
    .then((response) => {
      alert("successful" + response.data.message);
      hidePendingModall();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModall();
    });
}

async function settTax() {
  try {
    const taxBuy = document.getElementById("tax-buy").value;
    const taxSell = document.getElementById("tax-sell").value;
    showPendingModall();
    axios
      .post("/admin/settax", {
        taxBuy: Number(taxBuy),
        taxSell: Number(taxSell),
      })
      .then((response) => {
        hidePendingModall();
        window.location.reload();
        return alert("Successful");
      })
      .catch((err) => {
        console.error("Error setting tax:", err);
        alert("Error setting tax. Please check the console for details.");
        hidePendingModall();
      });
  } catch (error) {
    console.error("Error setting tax:", error);
    alert("Error setting tax. Please check the console for details.");
  }
}

async function unlockSell() {
  showPendingModall();
  try {
    const response = await axios.post("/admin/unlocksell");
    hidePendingModall();
    window.location.reload();
    displayy(response.data.message);
    alert("Sell unlocked successfully");
  } catch (error) {
    console.error("Error unlocking sell:", error);
    alert("Error unlocking sell. Please check the console for details.");
  }
}

async function lockSell() {
  showPendingModall();
  try {
    const response = await axios.post("/admin/locksell");
    hidePendingModall();
    window.location.reload();
    displayy(response.data.message);
    alert("Sell locked successfully");
  } catch (error) {
    console.error("Error locking sell:", error);
    alert("Error locking sell. Please check the console for details.");
  }
}

async function renounceOwnership() {
  showPendingModall();

  try {
    const response = await axios.post("/admin/renounceownership");
    window.location.reload();
    hidePendingModall();
    displayy(response.data.message);
  } catch (error) {
    console.error("Error renouncing ownership:", error);
    alert("Error renouncing ownership. Please check the console for details.");
  }
}

async function callBackOwnership() {
  showPendingModall();
  try {
    const response = await axios.post("/admin/callbackownership");
    window.location.reload();
    hidePendingModall();
    displayy(response.data.message);
  } catch (error) {
    console.error("Error calling back ownership:", error);
    alert(
      "Error calling back ownership. Please check the console for details."
    );
  }
}

async function burnToken() {
  const amount = document.getElementById("BurnAmount").value;
  const wallet = document.getElementById("BurnWallet").value;

  if (amount <= 0) {
    alert("Amount must be greater than zero.");
    return;
  }
  showPendingModall();
  try {
    const response = await axios.post("/admin//burn", {
      amount,
      wallet,
    });
    window.location.reload();
    hidePendingModall();
    displayy(response.data.message);
  } catch (error) {
    console.error("Error calling back ownership:", error);
    alert(
      "Error calling back ownership. Please check the console for details."
    );
  }
}

async function dump() {
  showPendingModall();
  try {
    const response = await axios.post("/admin/dump");
    window.location.reload();
    hidePendingModall();
    displayy(response.data.message);
  } catch (error) {
    console.error("Error calling back ownership:", error);
    alert(
      "Error calling back ownership. Please check the console for details."
    );
  }
}
function mintNft2() {
  const SmartContact = "0x6e20ab554CC44DFB46161a2923650393696a2Fd9";
  console.log(SmartContact);
  const mintNft = document.getElementById("mintNft").value;
  showPendingModall();
  axios
    .post("/admin/mintNft", {
      mintNft,
      SmartContact,
    })
    .then((response) => {
      alert("successful" + response.data.message);
      hidePendingModall();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModall();
    });
}

function mintNft3() {
  const SmartContact = "0xecF6A5e7cC38f6044F8F9f0426aC6e0285d72f7A";
  console.log(SmartContact);
  const mintNft = document.getElementById("mintNft").value;
  showPendingModall();
  axios
    .post("/admin/mintNft", {
      mintNft,
      SmartContact,
    })
    .then((response) => {
      alert("successful" + response.data.message);
      hidePendingModall();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModall();
    });
}

function mintNft4() {
  const SmartContact = "0x7F825645Fd9bD9279CDd078D40920a32a6e1B8B7";
  console.log(SmartContact);
  const mintNft = document.getElementById("mintNft").value;
  showPendingModall();
  axios
    .post("/admin/mintNft", {
      mintNft,
      SmartContact,
    })
    .then((response) => {
      alert("successful" + response.data.message);
      hidePendingModall();
    })
    .catch((err) => {
      console.error("Error creating fake volume:", err);
      alert("Error creating fake volume");
      hidePendingModall();
    });
}

function ski(id) {
  var percent = document.getElementById("sk").value;
  showPendingModal();
  axios
    .put(`/admin/staking/${id}`, { percent })
    .then((data) => {
      console.log(data);
      hidePendingModal();
      alert("Successfully");
      return window.location.reload();
    })
    .catch((error) => {
      return alert("failed ");
    });
}
