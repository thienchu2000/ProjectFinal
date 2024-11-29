const axios = require("axios").create({
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  },
});
const getTokenURIs = async (contract, tokenIds, contractAddress) => {
  return Promise.all(
    tokenIds.map(async (tokenId) => {
      const tokenURI = await contract.methods.tokenURI(tokenId).call();
      try {
        const response = await axios.get(tokenURI);

        if (response.data) {
          return { ...response.data, tokenId, contractAddress };
        }
      } catch (err) {
        console.error("Error:", err.message);
      }
    })
  );
};

module.exports = getTokenURIs;
