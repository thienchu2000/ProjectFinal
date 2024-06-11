function coverData(data) {
  return data.map((data) => {
    return JSON.stringify(data);
  });
}
module.exports = coverData;
