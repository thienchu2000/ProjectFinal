// function updateNew(id) {
//   var Description = document.getElementById("Description");
//   var NameNew = document.getElementById("NameNew");
//   var Image = document.getElementById("file");
//   console.log(id);
//   axios
//     .put(`/manager/updateNew/${id}`, { Description, NameNew, Image })
//     .then((data) => {
//       console.log(data);
//       return window.location.reload();
//     })
//     .catch((error) => {
//       console.log(error);
//       return alert("failed");
//     });
// }
function updateNew(id) {
  var form = document.getElementById(`updateForm-${id}`);
  var formData = new FormData(form);
  var fileInput = document.getElementById(`file-${id}`); // Thêm dòng này để lấy giá trị của input file

  // Thêm tệp tin vào FormData nếu có
  if (fileInput.files.length > 0) {
    formData.append("file", fileInput.files[0]);
  }

  axios
    .post(`/manager/updateNew/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      console.log(response.data);
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
      alert("Update failed");
    });
}
