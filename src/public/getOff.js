socket.on("connect", () => {
  console.log("Socket.IO connected Off-Chian");
  socket.emit("callback");
});

socket.on("callback", (data) => {
  fetchOff(data);
});

socket.on("disconnect", () => {
  console.log("user disconnected");
});

socket.on("error", (error) => {
  console.error("Socket.IO error:", error);
});

function fetchOff(data) {
  const tableBody = document.querySelector("#tokenListBody");
  if (tableBody) {
    tableBody.innerHTML = "";
  }
  data.forEach((item) => {
    var priceColor;
    var b;

    const high24h = item.db.high_24h;
    const low24h = item.db.low_24h;
    const currentPrice = item.db.current_price;
    const priceChange24h = item.db.price_change_24h;
    const priceChangePercentage24h = item.db.price_change_percentage_24h;

    if (priceChange24h < 0) {
      b = "red";
      priceColor = `<span style="color:red;">${priceChangePercentage24h.toFixed(
        2
      )}%  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-down-fill" viewBox="0 0 16 16">
      <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z"/>
    </svg></span>`;
    } else if (priceChange24h > 0) {
      b = "green";
      priceColor = `<span style="color:green;">${priceChangePercentage24h.toFixed(
        2
      )}%  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-caret-up-fill" viewBox="0 0 16 16">
      <path d="m7.247 4.86-4.796 5.481c-.566.647-.106 1.659.753 1.659h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z"/>
    </svg> </span>`;
    } else {
      b = "black";
      priceColor = `<span style="color:black;">${priceChangePercentage24h.toFixed(
        2
      )}%</span>`;
    }

    const row = document.createElement("tr");
    row.innerHTML = `
        <td>${item.db.market_cap_rank}</td>
        <td><img src="${
          item.db.image
        }" alt="Token Image" class="token-image" /></td>
        <td>${item.db.name}</td>
        <td>${item.db.symbol}</td>
        <td>${currentPrice}$</td> 
        <td style="color:${b}">${priceColor}</td>
        <td>${item.db.price_change_24h.toFixed(2)} $</td> 
        <td>${item.db.total_volume}$</td>
        <td>${item.tinhieu}</td>
        <td> <canvas id="priceChart_${item.db.id}"></canvas></td>
        <td>
        <button class="btn btn-dark rounded-pill" onclick="swap('${
          item.db.symbol
        }')">Swap</button>
      </td>
      `;

    tableBody.appendChild(row);

    createChart(item);
  });
}

function createChart(item) {
  const ctx = document
    .getElementById(`priceChart_${item.db.id}`)
    .getContext("2d");

  const labels = ["Low 24h", "High 24h", "Current Price"];
  const prices = [item.db.low_24h, item.db.high_24h, item.db.current_price];

  new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: `${item.db.symbol} Price`,
          data: prices,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 99, 132, 0.2)",
            "rgba(0, 128, 0, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(0, 128, 0, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

window.addEventListener("beforeunload", () => {
  socket.disconnect();
});
