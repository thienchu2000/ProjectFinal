const WordBestNFT_two2 = artifacts.require("WordBestNFT_two2");

module.exports = async function (deployer, network, accounts) {
  const initialOwner = accounts[0];
  const ipfsCIDs = [
    "https://ipfs.io/ipfs/QmWN3kAhbDwtjad7TxEJ3LvQg71cG73J1y6TDgGB9WT59H",
    "https://ipfs.io/ipfs/QmQcFBxm5L4chRMxpDA2y1sT5PQ4WaF1jiuAhhLy5rKXAc",
    "https://ipfs.io/ipfs/QmPa9VgBzLNkruoGxqPRWvetqMQnTTbVj2CT6BYV4htzs6",
    "https://ipfs.io/ipfs/QmfHHTrZ2mnqLCJP7UNqtACXdzuoP2yUxYKkgksq4eTT6v",
    "https://ipfs.io/ipfs/Qma2guyqqMgGDwz92jphbd4y7Aefbc9edkfUv4f5dbXGsc",
    "https://ipfs.io/ipfs/QmTcz4QhWWYo9Yus5eHy94Ug3zFVnVtb4UCzioupseXuj3",
    "https://ipfs.io/ipfs/Qmbmw9vut6m3mFWhUqBcytoyrZ5jAAFEQy2zJufmPfH9TJ",
    "https://ipfs.io/ipfs/QmVzQSkyLk55BMuZWEH9Y6vyJHqWk6ZdAcnZt2ersxuhpd",
    "https://ipfs.io/ipfs/QmdyoJMcdPKVYnaFbyeuD3TjAWkKxKYbXQ5nye4qmsZYU6",
    "https://ipfs.io/ipfs/QmUrhJw5r1fuy8frsKM3o7278XhC1ttjeME3C1eSnSdNq5",
  ];

  await deployer.deploy(WordBestNFT_two2, initialOwner);

  const WordBestNFT_two2Instance = await WordBestNFT_two2.deployed();
  for (const cid of ipfsCIDs) {
    await WordBestNFT_two2Instance.awardItem(initialOwner, cid);
  }
};

// const WordBestNFT_one1 = artifacts.require("WordBestNFT_one1");

// module.exports = async function (deployer, network, accounts) {
//   const initialOwner = accounts[0];
//   const ipfsCIDs = [
//     "https://ipfs.io/ipfs/QmWW7ELxC5yqbNWVYYum6d5dwmb39dis3u7oDayoLnraq2",
//     "https://ipfs.io/ipfs/QmXi4wzYjGfqzi5AJWaD8sts2SejdBVT6o8a5MrR4D3Y3y",
//     "https://ipfs.io/ipfs/QmenjW7gkwCKVUkzCes8Wdm76Wb9WtXmc8nt3M8nYdRZyj",
//     "https://ipfs.io/ipfs/QmdcGfCLgfLCxow2aBBPh9RaAmcJXmXxY8xrXfz2DQ7Zyz",
//     "https://ipfs.io/ipfs/QmeHdjAMwpdjTcuZZJfivHPLbsVmYoBHfbzxBgAVp3jZAL",
//     "https://ipfs.io/ipfs/QmbUFmpnLAojVc7PBBEdc7NzgkMLCHhxSbBgATUzoLL9DJ",
//     "https://ipfs.io/ipfs/QmTMvTND9DoeweYbukHk7oibRw5tWRnqwXrfrtpPi5rioS",
//     "https://ipfs.io/ipfs/QmVuevp7EuiEYrfDhwGA97ZvDbrFgYmP9pzFuY41Uo854R",
//     "https://ipfs.io/ipfs/QmNpZb8VaUovFvaTup8cqBd5mbBL7Wr9NxiXabASAA76FV",
//     "https://ipfs.io/ipfs/QmYa3eQf3dLFiHKEcCucWbWt8ECK6Y9uCERCmWWGZEhvaz",
//   ];

//   await deployer.deploy(WordBestNFT_one1, initialOwner);

//   const WordBestNFT_one1nstance = await WordBestNFT_one1.deployed();
//   for (const cid of ipfsCIDs) {
//     await WordBestNFT_one1nstance.awardItem(initialOwner, cid);
//   }
// };
