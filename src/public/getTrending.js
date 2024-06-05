async function fetchAndUpdate() {
  try {
    const response = await axios.get("/botTrending/get");
    const data = response.data;
    const tableBody = document.querySelector(".contract-table tbody");
    data.clearToken.forEach((token) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>Smart Contract: ${token.SmartContract}<br />
              NameToken: ${token.NameToken}<br />
              SymbolToken: ${token.SymbolToken}<br />
              TotalSupply: ${token.TotalSupply}
          </td>`;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.onload = fetchAndUpdate;

setInterval(fetchAndUpdate, 1000);
