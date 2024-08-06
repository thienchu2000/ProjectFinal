const axios = require("axios").create({
  timeout: 20000,
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
        console.error(err);
      }
    })
  );
};

module.exports = getTokenURIs;
