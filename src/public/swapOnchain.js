async function getMetaMaskTokens(tokenAddress, symbol) {
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

    await window.ethereum.request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: 18,
        },
      },
    });

    console.log("Added asset to MetaMask:", assets);
    return assets;
  } catch (error) {
    console.error("Failed to get MetaMask tokens:", error);
    throw error;
  }
}
