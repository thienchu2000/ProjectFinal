const WordLegendNFT_two = artifacts.require("WordLegendNFT_two");

module.exports = async function (deployer, network, accounts) {
  const initialOwner = accounts[0];
  const ipfsCIDs = [
    // "https://ipfs.io/ipfs/QmU2JJNVqUEi8TQM7Xruo1Lw9zezLRsKeLb94T7xczcw9N",
    // "https://ipfs.io/ipfs/QmVLRHJnyLLN7VKjkot2ihdgZVdo3iBemLW1XGZZS8uH7Z",
    // "https://ipfs.io/ipfs/QmViqf5Fuf6f7rbobpseXG7ocStymya2puA9s7bTRQRmRR",
    // "https://ipfs.io/ipfs/QmcfAcofiNE1d3wxiWDbGkX8Nshsu7i6LvRJXC14TVykCj",
    // "https://ipfs.io/ipfs/QmWEDPvWEow3FEmJsgRRipbmqCeCVMtP6mnVDQwDdZGeR5",
    // "https://ipfs.io/ipfs/QmTQrdReQHAJDggtYjpwLcB5MY2Cg1hddxQC3wy4CW3zj4",
    // "https://ipfs.io/ipfs/QmXY2akezJ6QsVqfqbyXzhgaobkw2cShfD4HfRmHcXtDAG",
    // "https://ipfs.io/ipfs/QmXdvywRjzEYWgpbaQGznRPtTmgpSTQH8pafuHs2JoSDpy",
    // "https://ipfs.io/ipfs/QmUEEWz69Un4JwDnmb4xntQXmYRVPhS1q3LcvaswYjPrLf",

    "https://ipfs.io/ipfs/QmZwn4E1wrmCgkvxLfWSLyV8yhckRW2GJf4w79JY9JnNy2",
    "https://ipfs.io/ipfs/QmbA2TrBfDZGfvHJBy9p5D2znLfXrPyncktjykgjYQff9n",
    "https://ipfs.io/ipfs/QmeLjnmwhZhpRkwdAuA95NUiZPsoKcFULNTtiMArifRRsr",
    "https://ipfs.io/ipfs/QmPuMaqEnZJcszXsAJDckMB17nerKvLnk8t5zNRDEUyvFs",
    "https://ipfs.io/ipfs/QmZPcboRpJwDLA8Jm1yT2CDohaR63jH7sX4uuiJXbu32kX",
    "https://ipfs.io/ipfs/QmPWiZUqnsAgtmTR1KVjmfiGGxqQXRTXkkPCtKb5r5VYzp",
    "https://ipfs.io/ipfs/QmSexTqm2NRF6Y3iUPnRztTNRU67KNM9cjNkK6BgqU8rRK",
    "https://ipfs.io/ipfs/QmaqqkwCMFgjziKyWtrocCFKXwFoCuVd1izx2LkiCHYdBW",
    "https://ipfs.io/ipfs/QmVyHQhgypw9t4AXFmZQroZYKa4RvQ5fcMYMTETv6m5dj3",
  ];

  await deployer.deploy(WordLegendNFT_two);

  const WordLegendNFT_twoInstance = await WordLegendNFT_two.deployed();
  for (const cid of ipfsCIDs) {
    await WordLegendNFT_twoInstance.awardItem(initialOwner, cid);
  }
};
