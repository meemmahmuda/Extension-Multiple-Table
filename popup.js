document.addEventListener("DOMContentLoaded", function () {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(
      tabs[0].id,
      { action: "getTableData" }
      function (response) {
        const matchingData = response.data;
        const tbody = document.querySelector("#table-data tbody");

        // Clear any existing table data
        tbody.innerHTML = "";

        // Display matching rows
        matchingData.forEach((row) => {
          const tr = document.createElement("tr");

          // Add Name column
          const nameCell = document.createElement("td");
          nameCell.textContent = row.name;
          tr.appendChild(nameCell);

          // Add Age column
          const ageCell = document.createElement("td");
          ageCell.textContent = row.age;
          tr.appendChild(ageCell);

          tbody.appendChild(tr);
        });

        if (matchingData.length === 0) {
          // Show a message if no matches are found
          const noMatchRow = document.createElement("tr");
          const noMatchCell = document.createElement("td");
          noMatchCell.textContent = "No matching data found.";
          noMatchCell.colSpan = 2; // Span across both columns
          noMatchCell.style.textAlign = "center";
          noMatchRow.appendChild(noMatchCell);
          tbody.appendChild(noMatchRow);
        }
      }
    );
  });
});
