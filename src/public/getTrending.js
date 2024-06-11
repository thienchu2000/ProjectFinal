const socket = io("http://localhost:3000");

socket.on("connect", () => {
  console.log("Socket.IO Connected On-Chain");
  socket.emit("onchain");
});

socket.on("onchain", (data) => {
  fetchAndUpdate(data);
});
socket.on("disconnect", () => {
  console.log("A user disconnected");
});
socket.on("error", (error) => {
  console.error("Socket.IO error:", error);
});
async function fetchAndUpdate(data) {
  try {
    const tableBody = document.querySelector(".contract-table tbody");

    if (!data || data.length === 0) {
      const loadingRow = document.createElement("tr");
      loadingRow.innerHTML = `
        <td colspan="4" style="text-align: center;">
          <div class="spinner"></div>
          <span>Loading...</span>
        </td>
      `;
      tableBody.appendChild(loadingRow);
      return;
    }
    var loadingRow = document.querySelector("#loading-row");
    if (loadingRow) {
      loadingRow.remove();
    }
    data.forEach((token) => {
      var key;
      if (token.SumTotalScammer === 0) {
        key = token.SumTotalScammer + "%" + "🔥";
      }
      if (token.SumTotalScammer === 15) {
        key = token.SumTotalScammer + "%" + "🔴";
      }
      if (token.SumTotalScammer === 30) {
        key = token.SumTotalScammer + "%" + "🔴" + "🔴";
      }
      if (token.SumTotalScammer === 45) {
        key = token.SumTotalScammer + "%" + "🔴" + "🔴" + "🔴";
      }
      if (token.SumTotalScammer === 60) {
        key = token.SumTotalScammer + "%" + "🔴" + "🔴" + "🔴" + "🔴";
      }
      const row = document.createElement("tr");
      row.innerHTML = `
              <td>
                        Smart Contract: ${token.SmartContract}<br />
                        NameToken: ${token.NameToken}<br />
                        SymbolToken: ${token.SymbolToken}<br />
                        TotalSupply: ${token.TotalSupply}<br />
                        Ownership: ${token.Ownership}<br />
                        Ownable: ${token.Ownable}<br />
                        FunctionMin: ${token.FunctionMin}<br />
                        SumTotalScammer: ${key}<br />
                    </td>`;
      tableBody.appendChild(row);
    });

    const scrollBox = document.getElementById("contract-table-wrapper");
    scrollBox.scrollTop = scrollBox.scrollHeight;
  } catch (error) {
    console.error("error:", error);
  }
}

// window.onload = fetchAndUpdate;
