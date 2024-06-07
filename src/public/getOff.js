// async function fetchOff() {
//   try {
//     const response = await axios.get("/botTrending/topPump");
//     const data = response.data;
//     if (data && Array.isArray(data.topPump)) {
//       const tableBodya = document.querySelector("#tokenListBody");

//       tableBodya.innerHTML = "";

//       data.topPump.forEach((item) => {
//         const row = document.createElement("tr");
//         row.innerHTML = `
//             <td>${item.db.market_cap_rank}</td>
//             <td><img
//                 src="${item.db.image}"
//                 alt="Token Image"
//                 class="token-image"
//             /></td>
//             <td>${item.db.name}</td>
//             <td>${item.db.symbol}</td>
//             <td>${item.db.current_price}$</td>
//             <td>${item.tinhieu}</td>
//           `;
//         tableBodya.appendChild(row);
//       });
//     } else {
//       console.error("Invalid data structure:", data);
//     }
//   } catch (error) {
//     console.error("Error fetching data:", error);
//   }
// }

// window.onload = fetchOff;
// setInterval(fetchOff, 60000);

// Tạo một kết nối WebSocket tới máy chủ
// const ws = new WebSocket("ws://localhost:3000/");

// ws.onopen = () => {
//   console.log("WebSocket connected");
//   fetchAndUpdateTokenList();
// };

// ws.onmessage = (event) => {
//   const data = JSON.parse(event.data);
//   fetchOff(data);
// };

// ws.onerror = (error) => {
//   console.error("WebSocket error:", error);
// };

// function fetchAndUpdateTokenList() {
//   ws.send(JSON.stringify({ action: "doneCall" }));
// }

// function fetchOff(data) {
//   const tableBody = document.querySelector("#tokenListBody");
//   tableBody.innerHTML = "";

//   if (data && Array.isArray(data.topPump)) {
//     data.topPump.forEach((item) => {
//       const row = document.createElement("tr");
//       row.innerHTML = `
//           <td>${item.db.market_cap_rank}</td>
//           <td><img src="${item.db.image}" alt="Token Image" class="token-image" /></td>
//           <td>${item.db.name}</td>
//           <td>${item.db.symbol}</td>
//           <td>${item.db.current_price}$</td>
//           <td>${item.tinhieu}</td>
//         `;
//       tableBody.appendChild(row);
//     });
//   } else {
//     console.error("Invalid data structure:", data);
//   }
// }

const ws = new WebSocket("ws://localhost:3000/");

ws.onopen = () => {
  console.log("WebSocket connected");
  fetchAndUpdateTokenList();
};

ws.onmessage = (event) => {
  try {
    const data = JSON.parse(event.data);
    fetchOff(data);
  } catch (error) {
    console.error("Error parsing JSON data:", error);
  }
};

ws.onerror = (error) => {
  console.error("WebSocket error:", error);
};

ws.onclose = () => {
  console.log("WebSocket connection closed");
};

function fetchAndUpdateTokenList() {
  try {
    ws.send(JSON.stringify({ action: "doneCall" }));
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

function fetchOff(data) {
  console.log("Received data:", data);
  const tableBody = document.querySelector("#tokenListBody");
  tableBody.innerHTML = "";

  if (data && Array.isArray(data.topPump)) {
    data.topPump.forEach((item) => {
      const row = document.createElement("tr");
      row.innerHTML = `
          <td>${item.db.market_cap_rank}</td>
          <td><img src="${item.db.image}" alt="Token Image" class="token-image" /></td>
          <td>${item.db.name}</td>
          <td>${item.db.symbol}</td>
          <td>${item.db.current_price}$</td>
          <td>${item.tinhieu}</td>
        `;
      tableBody.appendChild(row);
    });
  } else {
    console.error("Invalid data structure:", data);
  }
}
