function deleteNew(id) {
  axios
    .delete(`/admin/deleteNew/${id}`)
    .then((result) => {
      window.location.reload();
    })
    .catch((error) => {
      alert("that bai");
    });
}
