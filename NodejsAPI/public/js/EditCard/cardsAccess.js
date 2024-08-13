import { fetchTagsForCard, updateAvailableTagsForBoard } from "./tags.js";
import { fetchStickersForCard, updateAvailableStickersForBoard } from "./stickers.js";
import { showPopup } from "./common.js";
import { state } from "./globals.js";

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

    // Otherwise it calls multiple times
    const editButton = document.getElementById("editSubmit");
    editButton.addEventListener("click", handleEditSubmit);
});

function fetchCards() {
    const boardId = document.getElementById("board").value;
    const cardsTable = document.getElementById("cardsTable");
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
                    editCard(card.card_id, boardId);
                });

                const deleteButton = document.createElement("button");
                deleteButton.textContent = "Delete";
                deleteButton.classList.add("small-button", "delete-button");
                deleteButton.addEventListener("click", event => {
                    event.preventDefault();
                    deleteCard(card.card_id, row);
                });

                // Add buttons next to each other
                cellActions.classList.add("button-container");
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

async function editCard(cardId, boardId) {
    const editPopup = document.getElementById("editPopup");
    const descriptionTextbox = document.getElementById("getDescription");
    const titleText = document.getElementById("getTitle");
    const currentTagsContainer = document.getElementById("currentTags");
    const availableTagsContainer = document.getElementById("availableTags");
    const currentStickersContainer = document.getElementById("currentStickers");
    const availableStickersContainer = document.getElementById("availableStickers");
    const editClose = document.getElementById("editClose");

    let currentTags = [];
    let currentStickers = [];

    state.currentEditingCardId = cardId; // Set the current editing card ID

    // Fetch card details
    await fetch(`/api/cards/${cardId}`)
        .then(response => response.json())
        .then(data => {
            const card = data.data;
            descriptionTextbox.value = card.description.replaceAll("<p>", "").replaceAll("</p>", "\n");
            descriptionTextbox.value = descriptionTextbox.value.replaceAll("<br>", "\n");
            titleText.value = card.title;
        });

    // Fetch and display tags
    currentTags = await fetchTagsForCard(cardId, availableTagsContainer, currentTagsContainer);
    await updateAvailableTagsForBoard(boardId, currentTags, availableTagsContainer, currentTagsContainer);

    // Fetch and display stickers
    currentStickers = await fetchStickersForCard(cardId, availableStickersContainer, currentStickersContainer);
    await updateAvailableStickersForBoard(boardId, currentStickers, availableStickersContainer, currentStickersContainer);

    // Show the popup
    editPopup.style.display = "block";

    // Close the popup when the close icon is clicked
    editClose.addEventListener("click", () => {
        editPopup.style.display = "none";
    });
}

function handleEditSubmit() {
    const cardId = state.currentEditingCardId; // Use the globally set cardId
    if (!cardId) return; // No card is being edited

    const editPopup = document.getElementById("editPopup");
    const descriptionTextbox = document.getElementById("getDescription");
    const titleText = document.getElementById("getTitle");
    const currentTagsContainer = document.getElementById("currentTags");
    const currentStickersContainer = document.getElementById("currentStickers");

    const updatedTitle = titleText.value;
    const updatedDescription = descriptionTextbox.value.replace(/\n/g, "<br>");
    
    const tagIdsToAdd = Array.from(currentTagsContainer.children)
        .map(tag => tag.dataset.tagId)
        .filter(tagId => tagId && !state.originalTags.includes(parseInt(tagId))); // Only include new tags

    const stickerIdsToAdd = Array.from(currentStickersContainer.children)
        .map(sticker => sticker.dataset.stickerId)
        .filter(stickerId => stickerId && !state.originalStickers.includes(parseInt(stickerId))); // Only include new stickers

    const tagIdsToRemove = state.deletedTagsIds;
    const stickerIdsToRemove = state.deletedStickersIds;

    fetch(`/api/cards/${cardId}`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            title: updatedTitle,
            description: updatedDescription,
            tag_ids_to_add: tagIdsToAdd,
            tag_ids_to_remove: tagIdsToRemove,
            stickers_to_add: stickerIdsToAdd.map(stickerId => ({ sticker_id: stickerId })),
            sticker_ids_to_remove: stickerIdsToRemove
        })
    })
    .then(() => {
        state.deletedTagsIds = [];
        state.deletedStickersIds = [];
        showPopup(`Card with ID ${cardId} was updated`, "success");
        // Refresh the card menu
        editPopup.style.display = "none";
        fetchCards();
    })
    .catch(error => {
        console.error("Failed to update card: ", error.message);
        showPopup("Failed to update card", "error");
    });
}






