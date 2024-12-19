// Function to collect specific column data (e.g., "Name", "Age") from all tables
function getTableData() {
  const tables = document.querySelectorAll("table");
  const allTablesData = [];

  tables.forEach((table) => {
    const headers = table.querySelectorAll("th");

    // Find column indexes for "Name" and "Age"
    const nameIndex = Array.from(headers).findIndex(
      (header) => header.textContent.trim().toLowerCase() === "name"
    );
    const ageIndex = Array.from(headers).findIndex(
      (header) => header.textContent.trim().toLowerCase() === "age"
    );

    if (nameIndex !== -1 || ageIndex !== -1) {
      const tableData = [];
      const rows = table.querySelectorAll("tr");

      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length > 0) {
          const name = nameIndex !== -1 ? cells[nameIndex]?.textContent.trim() : "";
          const age = ageIndex !== -1 ? cells[ageIndex]?.textContent.trim() : "";
          tableData.push({ name, age });
        }
      });

      allTablesData.push(tableData);
    }
  });

  return allTablesData;
}

// Function to find rows matching in all tables
function getMatchingData(tablesData) {
  if (tablesData.length < 2) return []; // Ensure there are at least two tables

  // Start with rows from the first table
  const [firstTable, ...restTables] = tablesData;

  // Filter rows in the first table that match in all other tables
  const matches = firstTable.filter((row1) =>
    restTables.every((table) =>
      table.some((row2) => row1.name === row2.name && row1.age === row2.age)
    )
  );

  // Remove duplicate rows (if any)
  const uniqueMatches = matches.filter(
    (row, index, self) =>
      index ===
      self.findIndex((r) => r.name === row.name && r.age === row.age)
  );

  return uniqueMatches;
}

// Listen for messages from popup.js
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getTableData") {
    const tablesData = getTableData();
    const matchingData = getMatchingData(tablesData);
    sendResponse({ data: matchingData });
  }
});
