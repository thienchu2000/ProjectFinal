function coverData(data) {
  return data.map((data) => {
    return data.toJSON();
  });
}
module.exports = coverData;
