const spinner = document.getElementById("loading-spinner");

function showPendingModal() {
  document.getElementById("nftpending").style.display = "block";
}

function hidePendingModal() {
  document.getElementById("nftpending").style.display = "none";
}

async function connectMetamask(id, Price) {
  const tokenAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";
  const addressOwner = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
  const gasPriceHex = "0x30";
  const gasLimitHex = "0x493e0";

  try {
    showPendingModal();

    if (typeof window.ethereum === "undefined") {
      alert(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
      hidePendingModal();
      return;
    }

    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = window.ethereum;
    const web3 = new Web3(provider);

    const balance = await web3.eth.getBalance(accounts[0]);
    console.log(
      "Account balance:",
      web3.utils.fromWei(balance, "ether"),
      "ETH"
    );

    const gasPrice = await web3.eth.getGasPrice();
    console.log("Current gas price:", gasPrice);

    const tokenAbi = [
      {
        constant: false,
        inputs: [
          { name: "_to", type: "address" },
          { name: "_value", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ name: "", type: "bool" }],
        type: "function",
      },
    ];

    const contract = new web3.eth.Contract(tokenAbi, tokenAddress);

    const tx = {
      from: accounts[0],
      to: tokenAddress,
      value: "0x0",
      data: contract.methods
        .transfer(addressOwner, web3.utils.toWei(String(Price), "ether"))
        .encodeABI(),
      gas: gasLimitHex,
      gasPrice: web3.utils.toHex(gasPrice),
    };

    const hash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    console.log(`Transaction hash: ${hash}`);

    web3.eth.getTransactionReceipt(hash, (err, receipt) => {
      if (err) {
        console.error("Error fetching transaction receipt:", err);
        alert("Transaction failed. Please try again later.");
        hideSpinner();
        return;
      }
      console.log("Transaction receipt:", receipt);
    });

    try {
      const response = await axios.post(`/order/payment`, {
        productId: id,
        addressUser: accounts[0],
        txhash: hash,
      });

      if (response.status === 200) {
        alert("Payment successful! You can now use the bot.");
      } else {
        alert("Payment failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending token payment:", error);
      alert("Error sending token payment: " + error.message);
    } finally {
      hidePendingModal();
    }
  } catch (error) {
    console.error("Error sending token payment:", error);
    alert("Error sending token payment: " + error.message);
    hidePendingModal();
    throw error;
  }
}
