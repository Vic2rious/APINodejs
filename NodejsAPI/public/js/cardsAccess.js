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

    const form = document.getElementById("boardForm");
    form.addEventListener("submit", event => {
        event.preventDefault(); // Prevent form from submitting normally
        fetchCards();
    });
});

function fetchCards() {
    const boardId = document.getElementById("board").value;
    const cardsTable = document.getElementById("cardsTable");
    const editButton = document.getElementById("editButton");
    const deleteButton = document.getElementById("deleteButton");
    const tbody = cardsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear previous data

    if (!boardId) {
        return; // Required attribute on select element will handle alerting user
    }

    // Fetch cards in the selected board
    fetch(`/api/boards/${boardId}/cards`)
        .then(response => response.json())
        .then(data => {
            const cards = data.data.data;
            cards.forEach(card => {
                const row = document.createElement("tr");
                const cellId = document.createElement("td");
                const cellTitle = document.createElement("td");

                cellId.textContent = card.card_id;
                cellTitle.textContent = card.title;

                cellId.style.color = `#${card.color}`;
                cellId.style.fontWeight = "bold";
                //cellTitle.style.backgroundColor= `#${card.color}`;

                row.appendChild(cellId);
                row.appendChild(cellTitle);
                tbody.appendChild(row);

                // Add event listener to the row for selection
                row.addEventListener("click", () => {
                    // Remove highlight from all rows
                    Array.from(tbody.children).forEach(r => r.classList.remove("selected"));
                    // Highlight the selected row
                    row.classList.add("selected");
                    
                });
            });

            cardsTable.style.display = "table";
            editButton.style.display = "inline-block"
            deleteButton.style.display = "inline-block"

        })
        .catch(error => console.error("Error fetching cards:", error));
}
