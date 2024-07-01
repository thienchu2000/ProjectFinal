function updateNFT(id, index) {
  var Price = document.getElementById("aaanft-price-" + index).value;
  axios
    .put(`/admin/createNft/${id}`, { Price })
    .then((response) => {
      console.log(response.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error("Error updating NFT:", error);
      alert("Failed to update NFT price.");
    });
}
