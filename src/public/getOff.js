async function fetchOff() {
  try {
    const response = await axios.get("/botTrending/topPump");
    const data = response.data;
    if (data && Array.isArray(data.topPump)) {
      const tableBodya = document.querySelector("#tokenListBody");

      tableBodya.innerHTML = "";

      data.topPump.forEach((item) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.db.market_cap_rank}</td>
            <td><img
                src="${item.db.image}"
                alt="Token Image"
                class="token-image"
            /></td>
            <td>${item.db.name}</td>
            <td>${item.db.symbol}</td>
            <td>${item.db.current_price}$</td>
            <td>${item.tinhieu}</td>
          `;
        tableBodya.appendChild(row);
      });
    } else {
      console.error("Invalid data structure:", data);
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

window.onload = fetchOff;
setInterval(fetchOff, 60000);
