import { showPopup, showLoading, hideLoading } from "../EditCard/common.js";

document.getElementById("upload-form").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent form submission to reload the page

    const formData = new FormData(this);

    fetch("/upload", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            populateTable(data.data);
        } else {
            showPopup("Error uploading file: " + data.message, "error");
        }
    })
    .catch(error => {
        console.error("Error:", error);
        showPopup("An error occurred while uploading the file.", "error");
    });
});

async function populateTable(data) {
    const csvTable = document.getElementById("csv-table");
    csvTable.innerHTML = ""; // Clear any previous table

    if (data.length === 0) {
        csvTable.innerHTML = "<p>No data found in the CSV file.</p>";
        return;
    }

    // Fetch card data from the API
    const cards = await fetchCards();

    // Create table header
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    Object.keys(data[0]).forEach(key => {
        const th = document.createElement("th");
        th.textContent = key.replaceAll(";", "").trim();
        headerRow.appendChild(th);
    });

    // Add a new header for Card Title
    const titleTh = document.createElement("th");
    titleTh.textContent = "Card Title";
    headerRow.appendChild(titleTh);

    // Add "Actions" header
    const customIdTh = document.createElement("th");
    customIdTh.textContent = "Custom Id";
    headerRow.appendChild(customIdTh);

    thead.appendChild(headerRow);
    csvTable.appendChild(thead);

    // Create table body
    const tbody = document.createElement("tbody");

    data.forEach(row => {
        const tr = document.createElement("tr");

        // Create a cleaned-up version of the row object with semicolons removed
        const cleanedRow = {};
        Object.keys(row).forEach(key => {
            const cleanKey = key.replaceAll(";", "").trim();
            const cleanValue = row[key].replaceAll(";", "").trim();
            cleanedRow[cleanKey] = cleanValue;
        });

        // Extract the CardId after cleaning
        const cardId = cleanedRow["Card Id"];

        // Find the matching card by parsing the cardId as an integer
        const matchingCard = cards.find(card => card.card_id === parseInt(cardId));

        // Add each cleaned value to the table row
        Object.values(cleanedRow).forEach(value => {
            const td = document.createElement("td");
            td.textContent = value;
            td.style.color = `#${matchingCard.color}`;
            tr.appendChild(td);
        });

        // Add the matching card title to the row
        const titleTd = document.createElement("td");
        titleTd.textContent = matchingCard ? matchingCard.title : "Title not found";
        tr.appendChild(titleTd);

        // Add textbox in the Actions column
        const actionsTd = document.createElement("td");
        const editTextbox = document.createElement("input");
        editTextbox.type = "text";
        editTextbox.value = matchingCard?.custom_id ?? "";
        editTextbox.placeholder = "No ID";
        editTextbox.id = `cardId-${cardId}`; // Set the ID as cardId-{cardId}
        editTextbox.classList.add("edit-textbox");

        // Store the original value to check if it has changed
        let originalValue = editTextbox.value;

        // Add an event listener to update the custom ID on blur, only if the value has changed
        editTextbox.addEventListener("blur", async function() {
            const updatedValue = editTextbox.value.trim();
        
            // Use a regular expression to check if the entire input is a valid integer
            if (!/^\d*$/.test(updatedValue)) {
                showPopup("Custom ID must be a valid number", "error");
                return;
            }
        
            // Convert the valid string to an integer if it's not empty
        const validNumber = updatedValue !== "" ? parseInt(updatedValue, 10) : null;

        if (validNumber !== (originalValue !== "" ? parseInt(originalValue, 10) : null)) {

                showLoading();
                try {
                    await fetch(`/api/cards/${cardId}`, {
                        method: "PATCH",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            custom_id: validNumber
                        })
                    });
                    showPopup(`Card with ID ${cardId} was updated`, "success");
                } catch (error) {
                    console.error("Failed to update card: ", error.message);
                    showPopup("Failed to update card", "error");
                } finally {
                    originalValue = updatedValue;
                    hideLoading();
                }
            }
        });

        actionsTd.appendChild(editTextbox);
        tr.appendChild(actionsTd);

        tbody.appendChild(tr);
    });

    csvTable.appendChild(tbody);
    csvTable.style.display = "table";
}

// Function to fetch cards from the API
async function fetchCards() {
    try {
        const response = await fetch("/api/cards");
        const data = await response.json();
        return data.data.data;
    } catch (error) {
        console.error("Error fetching cards:", error);
        return [];
    }
}
