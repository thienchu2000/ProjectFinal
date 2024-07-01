async function sleep(ms, unpause) {
  return new Promise((resolve, reject) => setTimeout(resolve, ms));
}

module.exports = sleep;
