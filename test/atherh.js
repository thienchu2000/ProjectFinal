// const atherh = artifacts.require("atherh");

// contract("AtherH", () => {
//   it("should put 10000 AtherH in the first account", async () => {
//     const AtherHInstance = await atherh.deployed();
//     const balance = await AtherHInstance.getBalance.call(accounts[0]);

//     assert.equal(balance.valueOf(), 10000, "10000 wasn't in the first account");
//   });
//   it("should call a function that depends on a linked library", async () => {
//     const AtherHInstance = await atherh.deployed();
//     const AtherHBalance = (
//       await AtherHInstance.getBalance.call(accounts[0])
//     ).toNumber();
//     const AtherHEthBalance = (
//       await AtherHInstance.getBalanceInEth.call(accounts[0])
//     ).toNumber();

//     assert.equal(
//       AtherHEthBalance,
//       2 * AtherHBalance,
//       "Library function returned unexpected function, linkage may be broken"
//     );
//   });
//   it("should send coin correctly", async () => {
//     const AtherHInstance = await AtherH.deployed();
//     const accountOne = accounts[0];
//     const accountTwo = accounts[1];
//     const accountOneStartingBalance = (
//       await AtherHInstance.getBalance.call(accountOne)
//     ).toNumber();
//     const accountTwoStartingBalance = (
//       await AtherHInstance.getBalance.call(accountTwo)
//     ).toNumber();
//     const amount = 10;
//     await AtherHInstance.sendCoin(accountTwo, amount, { from: accountOne });
//     const accountOneEndingBalance = (
//       await AtherHInstance.getBalance.call(accountOne)
//     ).toNumber();
//     const accountTwoEndingBalance = (
//       await AtherHInstance.getBalance.call(accountTwo)
//     ).toNumber();

//     assert.equal(
//       accountOneEndingBalance,
//       accountOneStartingBalance - amount,
//       "Amount wasn't correctly taken from the sender"
//     );
//     assert.equal(
//       accountTwoEndingBalance,
//       accountTwoStartingBalance + amount,
//       "Amount wasn't correctly sent to the receiver"
//     );
//   });
// });
