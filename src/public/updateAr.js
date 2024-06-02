function updateAr(id) {
  var statusInput = document.querySelector(
    'input[name="Status_' + id + '" ]:checked'
  );
  var Status = statusInput ? statusInput.value : "";
  console.log(Status);
  axios
    .put(`/admin/updateNews/${id}`, { Status })
    .then((data) => {
      console.log(data);
      return window.location.reload();
    })
    .catch((error) => {
      return alert("failed ");
    });
}
