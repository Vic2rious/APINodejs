document.addEventListener("DOMContentLoaded", () => {
    const boardSelect = document.getElementById("board");

    // Fetch all boards
    fetch("/api/boards")
        .then(response => response.json())
        .then(data => {
            const boards = data.data;
            boards.forEach(board => {
                const option = document.createElement("option");
                option.value = board.board_id;
                option.textContent = board.name;
                boardSelect.appendChild(option);
            });
        })
        .catch(error => console.error("Error fetching boards:", error));

    const viewButton = document.getElementById("viewButton");
    viewButton.addEventListener("click", event => {
        event.preventDefault(); // Prevent form from submitting normally
        fetchCards();
    });
});

function fetchCards() {
    const boardId = document.getElementById("board").value;
    const cardsTable = document.getElementById("cardsTable");
    const tbody = cardsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear previous data

    if (!boardId) {
        return;
    }

    // Fetch cards in the selected board
    fetch(`/api/boards/${boardId}/cards`)
        .then(response => response.json())
        .then(data => {
            // data[] --> pagination, data
            const cards = data.data.data;
            cards.forEach(card => {
                const row = document.createElement("tr");
                const cellId = document.createElement("td");
                const cellTitle = document.createElement("td");
                const cellActions = document.createElement("td");

                cellId.textContent = card.card_id;
                cellTitle.textContent = card.title;

                cellId.style.color = `#${card.color}`;
                cellId.style.fontWeight = "bold";
                
                // Create edit and delete buttons
                const editButton = document.createElement("button");
                editButton.textContent = "Edit";
                editButton.classList.add("small-button", "edit-button");
                editButton.addEventListener("click", event => {
                    event.preventDefault();
                    editCard(card.card_id);
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("small-button", "delete-button");
                deleteButton.addEventListener("click", event => {
                    event.preventDefault();
                    deleteCard(card.card_id, row);
                });
                
                cellActions.appendChild(editButton);
                cellActions.appendChild(deleteButton);

                row.appendChild(cellId);
                row.appendChild(cellTitle);
                row.appendChild(cellActions);
                tbody.appendChild(row);
            });

            cardsTable.style.display = "table";
        })
        .catch(error => console.error("Error fetching cards:", error));
}

function deleteCard(cardId, row) {
    fetch(`/api/cards/${cardId}/delete`, {
        method: "DELETE"
    })
    .then(response => {
        if (response.ok) {
            showPopup(`Card with ID ${cardId} was deleted`, "success");
            row.remove(); // Remove the row from the table
        } else {
            showPopup("Failed to delete card", "error");
        }
    })
    .catch(error => {
        console.error("Failed to delete card: ", error.message);
        showPopup("Failed to delete card", "error");
    });
}

async function editCard(cardId) {
    const editPopup = document.getElementById("editPopup");
    const descriptionTextbox = document.getElementById("getDescription");
    const titleTextbox = document.getElementById("getTitle");
    const editClose = document.getElementById("editClose");
    const editButton = document.getElementById("editSubmit");

    await fetch(`/api/cards/${cardId}`)
        .then(response => response.json())
        .then(data => {
            const card = data.data;
            descriptionTextbox.value = card.description.replaceAll("<p>", "").replaceAll("</p>", "\n");
            titleTextbox.value = card.title;
        });

    // Show the popup
    editPopup.style.display = "block";

    // Close the popup when the close icon is clicked
    editClose.addEventListener("click", () => {
        editPopup.style.display = "none";
    });

    // Handle the submit button click event
    editButton.addEventListener("click", event => {
        event.preventDefault();
        
        const updatedTitle = titleTextbox.value;
        const updatedDescription = descriptionTextbox.value.replace(/\n/g,"<br>");

        fetch(`/api/cards/${cardId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: updatedTitle,
                description: updatedDescription
            })
        })
        .then(response => {
            if (response.ok) {
                showPopup(`Card with ID ${cardId} was updated`, "success");
                editPopup.style.display = "none";
                fetchCards(); // Refresh the cards
            } else {
                showPopup("Failed to update card", "error");
            }
        })
        .catch(error => {
            console.error("Failed to update card: ", error.message);
            showPopup("Failed to update card", "error");
        });
    });
}

function showPopup(message, type) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}
