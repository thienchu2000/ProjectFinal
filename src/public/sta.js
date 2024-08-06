async function sta() {
  const tokenAddress = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
  const addressOwner = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
  const gasPriceHex = "0x30";
  const gasLimitHex = "0x493e0";
  var price = document.getElementById("staking").value;
  var day = document.getElementById("day").value;
  try {
    if (typeof window.ethereum === "undefined") {
      alert(
        "MetaMask is not installed. Please install MetaMask to use this feature."
      );
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
        .transfer(addressOwner, web3.utils.toWei(String(price), "ether"))
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
      const response = await axios.post("/staking", {
        addressUser: accounts[0],
        price: price,
        txhash: hash,
        day,
      });

      if (response.status === 200) {
        alert("Staking successful!");
      } else {
        alert("Staking failed. Please try again later.");
      }
    } catch (error) {
      console.error("Error sending token ", error);
      alert("Error sending token : " + error.message);
    } finally {
    }
  } catch (error) {
    console.error("Error sending token ", error);
    alert("Error sending token  " + error.message);
    throw error;
  }
}
