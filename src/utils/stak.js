function laikep(amount, percent, days) {
  let dailyRate = percent / 100;
  let compoundedAmount = amount * Math.pow(1 + dailyRate, days);
  return Math.round(compoundedAmount);
}

module.exports = laikep;
