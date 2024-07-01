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
      <p>Sell Hash: ${parsedResult.Sell}</p>
      <p>Transfer Back Hash: ${parsedResult.TransferBack}</p>
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

function volumeFake() {
  var unpause = false;
  const transactions = document.getElementById("transactions").value;
  const transactionTime = document.getElementById("transactionTime").value;
  const wallet = document.getElementById("wallet").value;
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
