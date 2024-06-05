function updateBot(id, index) {
  var Description = document.getElementById(
    "aaabot-description-" + index
  ).value;
  var Price = document.getElementById("aaabot-price-" + index).value;
  axios
    .put(`/admin/createInforBot/${id}`, { Description, Price })
    .then((data) => {
      console.log(data);
      return window.location.reload();
    })
    .catch((error) => {
      return alert("failed ");
    });
}
