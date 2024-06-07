// async function fetchAndUpdate() {
//   try {
//     const response = await axios.get("/botTrending/get");
//     const data = response.data;
//     const tableBody = document.querySelector(".contract-table tbody");
//     data.clearToken.forEach((token) => {
//       var key;
//       if (token.SumTotalScammer === 15) {
//         key = token.SumTotalScammer + "%" + "🔴";
//       }
//       if (token.SumTotalScammer === 30) {
//         key = token.SumTotalScammer + "%" + "🔴" + "🔴";
//       }
//       if (token.SumTotalScammer === 45) {
//         key = token.SumTotalScammer + "%" + "🔴" + "🔴" + "🔴";
//       }
//       if (token.SumTotalScammer === 60) {
//         key = token.SumTotalScammer + "%" + "🔴" + "🔴" + "🔴" + "🔴";
//       }
//       const row = document.createElement("tr");
//       row.innerHTML = `
//           <td>Smart Contract: ${token.SmartContract}<br />
//               NameToken: ${token.NameToken}<br />
//               SymbolToken: ${token.SymbolToken}<br />
//               TotalSupply: ${token.TotalSupply}<br />
//               Ownership: ${token.Ownership}<br />
//               Ownable: ${token.Ownable}<br />
//               FunctionMin: ${token.FunctionMin}<br />
//               SumTotalScammer: ${key}<br />
//           </td>`;
//       tableBody.appendChild(row);
//     });
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// window.onload = fetchAndUpdate;

// setInterval(fetchAndUpdate, 10000000);

async function fetchAndUpdate() {
  try {
    const response = await axios.get("/botTrending/get");
    const data = response.data;
    const tableBody = document.querySelector(".contract-table tbody");
    data.clearToken.forEach((token) => {
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
    console.error("Error fetching data:", error);
  }
}

window.onload = fetchAndUpdate;
// setInterval(fetchAndUpdate, 1000);
