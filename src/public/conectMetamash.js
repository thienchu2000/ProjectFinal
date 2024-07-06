document.addEventListener("DOMContentLoaded", async function () {
  const connectButton = document.getElementById("connectButton");
  const connectWalletItem = document.getElementById("connectWalletItem");
  if (typeof window.ethereum === "undefined") {
    connectButton.innerText = "MetaMask is not installed";
    connectButton.setAttribute("disabled", true);
    return;
  }
  var symbol = "MCTK";
  var SmartContact = "0xF00aa648C743a0dfF310c62EaCe3dF9757A14Ef8";
  connectButton.addEventListener("click", async () => {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const address = accounts[0];
      await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: SmartContact,
            symbol: symbol,
            decimals: 18,
          },
        },
      });

      alert(`Connected with address: ${address}`);
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      alert("Failed to connect wallet: " + error.message);
    }
  });

  connectButton.addEventListener("mouseenter", function () {
    // connectButton.style.backgroundColor = "#0056b3";
  });

  connectButton.addEventListener("mouseleave", function () {
    // connectButton.style.backgroundColor = "#007bff";
  });
  connectWalletItem.classList.add("custom-nav-item");
});
