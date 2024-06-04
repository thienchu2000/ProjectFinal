const spinner = document.getElementById("loading-spinner");
function showSpinner() {
  document.getElementById("spinner-container").classList.add("show");
}

function hideSpinner() {
  document.getElementById("spinner-container").classList.remove("show");
}

async function connectMetamask(id, Price) {
  const tokenAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";
  const addressOwner = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
  const gasPrice = "0x37";

  const gasLimit = "0x186a0";

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const tokenAbi = [
      {
        constant: false,
        inputs: [
          {
            name: "_to",
            type: "address",
          },
          {
            name: "_value",
            type: "uint256",
          },
        ],
        name: "transfer",
        outputs: [
          {
            name: "",
            type: "bool",
          },
        ],
        type: "function",
      },
    ];
    const provider = window.ethereum;
    const web3 = new Web3(provider);
    const contract = new web3.eth.Contract(tokenAbi, tokenAddress);

    const tx = {
      from: accounts[0],
      to: tokenAddress,
      value: "0x0",
      data: contract.methods
        .transfer(addressOwner, web3.utils.toWei(String(Price), "ether"))
        .encodeABI(),
      gas: gasLimit,
      gasPrice: gasPrice,
    };

    const hash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });
    showSpinner();
    console.log(`Transaction hash: ${hash}`);
    try {
      const response = await axios.post(`/order/payment`, {
        productId: id,
        addressUser: accounts[0],
        txhash: hash,
      });

      hideSpinner();

      if (response.status === 200) {
        alert("Payment successful! You can now use the bot.");
      } else {
        alert("Payment failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending token payment:", error);
      alert("Error sending token payment: " + error.message);
    }
  } catch (error) {
    console.error("Error sending token payment:", error);
    throw error;
  }
}
