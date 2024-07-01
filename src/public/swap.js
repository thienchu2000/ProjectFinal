// async function getMetaMaskTokens(symbol, tokenAddress, decimals) {
//   try {
//     if (typeof window.ethereum === "undefined") {
//       alert(
//         "MetaMask is not installed. Please install MetaMask to use this feature."
//       );
//       return;
//     }

//     const accounts = await window.ethereum.request({
//       method: "eth_requestAccounts",
//     });

//     const provider = window.ethereum;
//     const web3 = new Web3(provider);

//     await window.ethereum.request({
//       method: "wallet_watchAsset",
//       params: {
//         type: "ERC20",
//         options: {
//           address: tokenAddress,
//           symbol: symbol,
//           decimals: decimals,
//         },
//       },
//     });

//     console.log("Added asset to MetaMask:", assets);
//     return assets;
//   } catch (error) {
//     console.error("Failed to get MetaMask tokens:", error);
//     throw error;
//   }
// }

async function swap(symbol) {
  console.log(symbol);
  const apiKey = "23Mm4AVnjoSgb1BB1St5h80RuEITMV8E";
  const proxyUrl = "http://localhost:3000/api";

  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
    params: {
      chainId: 1,
      query: symbol,
    },
  };

  try {
    const response = await axios.get(proxyUrl, config);
    const filteredTokens = response.data.filter((item) => {
      return item.chainId === 1;
    });

    async function getMetaMaskTokens(symbol, tokenAddress, decimals) {
      console.log(symbol, tokenAddress, decimals);
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
        const asset = {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: symbol,
            decimals: decimals,
          },
        };

        const added = await window.ethereum.request({
          method: "wallet_watchAsset",
          params: asset,
        });

        if (added) {
          console.log("Added asset to MetaMask:", asset);
          return asset;
        } else {
          console.error("Failed to add asset to MetaMask");
          throw new Error("Failed to add asset to MetaMask");
        }
      } catch (error) {
        console.error("Failed to get MetaMask tokens:", error);
        throw error;
      }
    }
    getMetaMaskTokens(
      filteredTokens[0].symbol,
      filteredTokens[0].address,
      filteredTokens[0].decimals
    );

    console.log("Token Info:", filteredTokens);
  } catch (error) {
    console.error(
      "Error fetching token info:",
      error.response?.data || error.message
    );
    throw error;
  }
}
