async function handlePurchase(event) {
  const productId = event.target.dataset.productId;

  if (typeof window.ethereum === "undefined") {
    alert("Please install MetaMask to proceed.");
    return;
  }

  try {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    const userAddress = accounts[0];

    const transactionStatus = await sendTokenPayment(productId, userAddress);

    if (transactionStatus === "success") {
      alert("Payment successful! You can now use the bot.");
    } else {
      alert("Payment failed. Please try again later.");
    }
  } catch (error) {
    console.error("Error connecting with MetaMask:", error);
    alert("Failed to connect with MetaMask. Please try again.");
  }
}

async function sendTokenPayment(productId, userAddress) {
  try {
    const response = await axios.post("/order/payment", {
      productId,
      userAddress,
    });
    return response.data.status;
  } catch (error) {
    console.error("Error sending token payment:", error);
    throw error;
  }
}

const purchaseButtons = document.querySelectorAll(".purchase-button");
purchaseButtons.forEach((button) => {
  button.addEventListener("click", handlePurchase);
});
