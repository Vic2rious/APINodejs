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
});

function fetchCards() {
    const boardId = document.getElementById("board").value;
    const cardsTable = document.getElementById("cardsTable");
    const tbody = cardsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear previous data

    // if (!boardId) {
    //     alert("Please select a board");
    //     return;
    // }

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

                row.appendChild(cellId);
                row.appendChild(cellTitle);
                tbody.appendChild(row);
            });

            cardsTable.style.display = "table";
        })
        .catch(error => console.error("Error fetching cards:", error));
}
