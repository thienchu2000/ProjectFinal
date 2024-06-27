// function showPendingModal() {
//   document.getElementById("nftpending").style.display = "block";
// }

// function hidePendingModal() {
//   document.getElementById("nftpending").style.display = "none";
// }

// async function buynft(contractAddress, tokenId) {
//   console.log("davao");
//   const tokenAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";
//   const addressOwner = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
//   const gasPriceHex = "0x30";
//   const gasLimitHex = "0x493e0";
//   const Price = "200";

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

//     const balance = await web3.eth.getBalance(accounts[0]);
//     console.log(
//       "Account balance:",
//       web3.utils.fromWei(balance, "ether"),
//       "ETH"
//     );

//     const gasPrice = await web3.eth.getGasPrice();
//     console.log("Current gas price:", gasPrice);

//     const tokenAbi = [
//       {
//         constant: false,
//         inputs: [
//           { name: "_to", type: "address" },
//           { name: "_value", type: "uint256" },
//         ],
//         name: "transfer",
//         outputs: [{ name: "", type: "bool" }],
//         type: "function",
//       },
//     ];

//     const contract = new web3.eth.Contract(tokenAbi, tokenAddress);

//     const tx = {
//       from: accounts[0],
//       to: tokenAddress,
//       value: "0x0",
//       data: contract.methods
//         .transfer(addressOwner, web3.utils.toWei(String(Price), "ether"))
//         .encodeABI(),
//       gas: gasLimitHex,
//       gasPrice: web3.utils.toHex(gasPrice),
//     };

//     showPendingModal();

//     const hash = await ethereum.request({
//       method: "eth_sendTransaction",
//       params: [tx],
//     });

//     console.log(`Transaction hash: ${hash}`);

//     try {
//       const response = await axios.post(`/nft/payment`, {
//         contractAddress: contractAddress,
//         tokenId: tokenId,
//         addressUser: accounts[0],
//         txhash: hash,
//       });

//       if (response.status === 200) {
//         alert("Payment NFT done");
//         const nftContract = new web3.eth.Contract(
//           [
//             {
//               constant: true,
//               inputs: [{ name: "_tokenId", type: "uint256" }],
//               name: "ownerOf",
//               outputs: [{ name: "owner", type: "address" }],
//               type: "function",
//             },
//           ],
//           contractAddress
//         );

//         let ownershipVerified = false;
//         const maxRetries = 20;
//         const retryInterval = 500;

//         for (let i = 0; i < maxRetries; i++) {
//           ownershipVerified = await checkNftOwnership(
//             nftContract,
//             accounts[0],
//             tokenId
//           );
//           if (ownershipVerified) break;
//           await new Promise((resolve) => setTimeout(resolve, retryInterval));
//         }

//         if (ownershipVerified) {
//           await window.ethereum.request({
//             method: "wallet_watchAsset",
//             params: {
//               type: "ERC721",
//               options: {
//                 address: response.data.contractAddress,
//                 token_id: response.data.tokenId,
//               },
//             },
//           });
//         } else {
//           alert("Ownership verification failed. Please try again later.");
//         }
//         return;
//       } else {
//         return alert("Payment failed. Please try again later.");
//       }
//     } catch (error) {
//       console.error("Error sending token payment:", error);
//       alert("Error sending token payment: " + error.message);
//     } finally {
//       hidePendingModal();
//     }
//   } catch (error) {
//     console.error("Error sending token payment:", error);
//     alert("Error sending token payment: " + error.message);
//     hidePendingModal();
//     throw error;
//   }
// }
async function checkNftOwnership(contract, ownerAddress, tokenId) {
  try {
    const owner = await contract.methods.ownerOf(tokenId).call();
    return owner.toLowerCase() === ownerAddress.toLowerCase();
  } catch (error) {
    console.error("Error checking NFT ownership:", error);
    return false;
  }
}

function showPendingModal() {
  document.getElementById("nftpending").style.display = "block";
}

function hidePendingModal() {
  document.getElementById("nftpending").style.display = "none";
}

async function buynft(contractAddress, tokenId) {
  console.log("davao");
  const tokenAddress = "0xBB1Ae18020520Eb943D26cAe21551d6C9Fb5de62";
  const addressOwner = "0x9B555039084f8feCB75AeF928B7ccd2b15A84575";
  const gasPriceHex = "0x30";
  const gasLimitHex = "0x493e0";
  const Price = "200";

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
        .transfer(addressOwner, web3.utils.toWei(String(Price), "ether"))
        .encodeABI(),
      gas: gasLimitHex,
      gasPrice: web3.utils.toHex(gasPrice),
    };

    showPendingModal();

    const hash = await ethereum.request({
      method: "eth_sendTransaction",
      params: [tx],
    });

    console.log(`Transaction hash: ${hash}`);

    try {
      const response = await axios.post(`/nft/payment`, {
        contractAddress: contractAddress,
        tokenId: tokenId,
        addressUser: accounts[0],
        txhash: hash,
      });

      if (response.status === 200) {
        alert("Payment NFT done");
        const nftContract = new web3.eth.Contract(
          [
            {
              constant: true,
              inputs: [{ name: "_tokenId", type: "uint256" }],
              name: "ownerOf",
              outputs: [{ name: "owner", type: "address" }],
              type: "function",
            },
          ],
          contractAddress
        );

        let ownershipVerified = false;
        const maxRetries = 60;
        const retryInterval = 1000;

        for (let i = 0; i < maxRetries; i++) {
          ownershipVerified = await checkNftOwnership(
            nftContract,
            accounts[0],
            tokenId
          );
          if (ownershipVerified) {
            console.log(`Ownership verified on retry ${i + 1}`);
            break;
          }
          console.log(`Retry ${i + 1}: Checking ownership...`);
          await new Promise((resolve) => setTimeout(resolve, retryInterval));
        }

        if (ownershipVerified) {
          console.log("Ownership verified, calling wallet_watchAsset");
          await window.ethereum.request({
            method: "wallet_watchAsset",
            params: {
              type: "ERC721",
              options: {
                address: response.data.contractAddress,
                tokenId: response.data.tokenId,
              },
            },
          });
        } else {
          alert("Ownership verification failed. Please try again later.");
        }
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
