import { fetchTagsForCard, updateAvailableTagsForBoard, fetchAllTags } from "./tags.js";
import { fetchStickersForCard, updateAvailableStickersForBoard, fetchAllStickers } from "./stickers.js";
import { showPopup, moveElement, showLoading, hideLoading } from "./common.js";
import { state } from "./globals.js";
import { populateOwnerAndCoOwners } from "./owners.js";

document.addEventListener("DOMContentLoaded", () => {
    const boardSelect = document.getElementById("board");
    const currentStickersContainer = document.getElementById("currentStickers");
    const availableStickersContainer = document.getElementById("availableStickers");
    const currentTagsContainer = document.getElementById("currentTags");
    const availableTagsContainer = document.getElementById("availableTags");
    const editClose = document.getElementById("editClose");
    const editPopup = document.getElementById("editPopup");
    const clearButton = document.getElementById("clear-btn");

    // Attach event listener to container 1 for cloning elements
    availableStickersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("box")) {
        const box = event.target;
        const clone = box.cloneNode(true); // Clone the clicked element
        
        currentStickersContainer.appendChild(clone);
        }
    });

    // Attach event listener to container 2 for removing elements
    currentStickersContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("box")) {

            event.target.remove(); // Remove the clicked box from container 2
        }
    });
    
    // Attach event listener to container 1 for cloning elements
    availableTagsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("box")) {
            moveElement(event, currentTagsContainer);
        }
    });

    // Attach event listener to container 2 for removing elements
    currentTagsContainer.addEventListener("click", function(event) {
        if (event.target.classList.contains("box")) {

            moveElement(event, availableTagsContainer);
        }
    });
    

    // Close the popup when the close icon is clicked
    editClose.addEventListener("click", () => {
        editPopup.style.display = "none";
    });

    clearButton.addEventListener("click", () =>{
        clearSearch();
    }); 

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
        const boardId = document.getElementById("board").value;
        if(boardId) {

            event.preventDefault(); // Prevent form from submitting normally
            fetchCards();
            //viewButton.style.display = "none";
        }
    });

    // Otherwise it calls multiple times
    const editButton = document.getElementById("editSubmit");
    editButton.addEventListener("click", handleEditSubmit);

    const searchInput = document.getElementById("search");
    searchInput.addEventListener("input", filterCardsByTitle);
});

async function fetchCards() {
    showLoading(); // Show loading screen before async operation

    const boardId = document.getElementById("board").value;
    const cardsTable = document.getElementById("cardsTable");
    const tbody = cardsTable.querySelector("tbody");
    tbody.innerHTML = ""; // Clear previous data

    if (!boardId) {
        hideLoading(); // Hide loading screen if no board is selected
        return; // Required attribute on select element will handle alerting user
    }

    // Fetch cards in the selected board
    await fetch(`/api/boards/${boardId}/cards`)
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
                cellTitle.classList.add("card-title");

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
                    // Show the confirmation modal
                    showDeleteConfirmation(card.card_id, row);
                });

                // Add buttons next to each other
                cellActions.classList.add("small-button-container");
                cellActions.appendChild(editButton);
                cellActions.appendChild(deleteButton);

                row.appendChild(cellId);
                row.appendChild(cellTitle);
                row.appendChild(cellActions);
                tbody.appendChild(row);
            });

            cardsTable.style.display = "table";
            filterCardsByTitle();  // Filter cards initially when they are loaded
        })
        .catch(error => console.error("Error fetching cards:", error));

    hideLoading();
}

function showDeleteConfirmation(cardId, row) {
    const confirmDeleteModal = document.getElementById("confirmDeleteModal");
    const confirmDeleteButton = document.getElementById("confirmDeleteButton");
    const cancelDeleteButton = document.getElementById("cancelDeleteButton");

    confirmDeleteModal.style.display = "block";

    confirmDeleteButton.onclick = async () => {
        await deleteCard(cardId, row);
        confirmDeleteModal.style.display = "none";
    };

    cancelDeleteButton.onclick = () => {
        confirmDeleteModal.style.display = "none";
    };

    window.onclick = (event) => {
        if (event.target === confirmDeleteModal) {
            confirmDeleteModal.style.display = "none";
        }
    };
}

async function deleteCard(cardId, row) {
    showLoading();

    await fetch(`/api/cards/${cardId}/delete`, {
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

    hideLoading();
}

async function editCard(cardId) {
    showLoading();

    const editPopup = document.getElementById("editPopup");
    const descriptionTextbox = document.getElementById("getDescription");
    const titleText = document.getElementById("getTitle");
    const currentTagsContainer = document.getElementById("currentTags");
    const availableTagsContainer = document.getElementById("availableTags");
    const currentStickersContainer = document.getElementById("currentStickers");
    const availableStickersContainer = document.getElementById("availableStickers");
    const ownerSelect = document.getElementById("owner");
    const coOwnersSelect = document.getElementById("coOwners");

    let card;

    state.currentEditingCardId = cardId; // Set the current editing card ID

    // Fetch card details
    await fetch(`/api/cards/${cardId}`)
        .then(response => response.json())
        .then(data => {
            card = data.data;
            descriptionTextbox.value = card.description.replaceAll("<p>", "").replaceAll("</p>", "\n");
            descriptionTextbox.value = descriptionTextbox.value.replaceAll("<br>", "\n");
            titleText.value = card.title;
        });

            await populateOwnerAndCoOwners(card, ownerSelect, coOwnersSelect);
            //fetch all tags and stickers
            const allTags = await fetchAllTags();
            const allStickers = await fetchAllStickers();
            
            // Fetch and display tags
            await fetchTagsForCard(card, currentTagsContainer, allTags);
            await updateAvailableTagsForBoard(card, availableTagsContainer, allTags);
            
            // Fetch and display stickers
            await fetchStickersForCard(card, currentStickersContainer, allStickers);
            await updateAvailableStickersForBoard(card, availableStickersContainer, allStickers);
            

    // Show the popup
    editPopup.style.display = "block";

    hideLoading();
}

async function handleEditSubmit() {
    showLoading();

    const cardId = state.currentEditingCardId; // Use the globally set cardId
    if (!cardId) return; // No card is being edited

    const editPopup = document.getElementById("editPopup");
    const descriptionTextbox = document.getElementById("getDescription");
    const titleText = document.getElementById("getTitle");
    const currentTagsContainer = document.getElementById("currentTags");
    const currentStickersContainer = document.getElementById("currentStickers");
    const ownerSelect = document.getElementById("owner");
    const coOwnersSelect = document.getElementById("coOwners");

    const updatedTitle = titleText.value;
    const updatedDescription = descriptionTextbox.value.replace(/\n/g, "<br>");
    
    const tagIdsToAdd = Array.from(currentTagsContainer.children)
        .map(tag => tag.dataset.tagId)

    const stickerIdsToAdd = Array.from(currentStickersContainer.children)
        .map(sticker => sticker.dataset.stickerId)

    const tagIdsToRemove = state.deletedTagsIds;
    const stickerIdsToRemove = state.deletedStickersIds;
    const coOwnerIdsToRemove = state.deletedCoOwnerIds;

    const owner = ownerSelect.value;
    const coOwners = Array.from(coOwnersSelect.options)
                      .filter(option => option.selected)
                      .map(option => option.value);

    const FixedOwner = owner === "0" ? null : parseInt(owner);
    const FixedCoOwners = (Array.isArray(coOwners) ? 
    coOwners.filter(item => item !== "0").map(item => parseInt(item, 10)) 
    : coOwners === "0" ? [] : [parseInt(coOwners, 10)]);

    await fetch(`/api/cards/${cardId}`, {
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
            sticker_ids_to_remove: stickerIdsToRemove, 
            owner_user_id: FixedOwner,
            co_owner_ids_to_remove: coOwnerIdsToRemove,
            co_owner_ids_to_add: FixedCoOwners
        })
    })
    .then(() => {
        state.deletedTagsIds = [];
        state.deletedStickersIds = [];
        state.deletedCoOwnerIds = [];
        showPopup(`Card with ID ${cardId} was updated`, "success");
        // Refresh the card menu
        editPopup.style.display = "none";
        fetchCards();
    })
    .catch(error => {
        console.error("Failed to update card: ", error.message);
        showPopup("Failed to update card", "error");
    });

    hideLoading();
}

function filterCardsByTitle() {
    const searchInput = document.getElementById("search");
    const searchQuery = searchInput.value;
    const regex = new RegExp(searchQuery, "i");  // Create regex from search input, case-insensitive
    const cardRows = document.querySelectorAll("#cardsTable tbody tr");

    cardRows.forEach(row => {
        const titleCell = row.querySelector(".card-title");
        const titleText = titleCell.textContent;

        if (regex.test(titleText)) {
            row.style.display = "";  // Show the row if it matches the regex
        } else {
            row.style.display = "none";  // Hide the row if it doesn't match
        }
    });
}

function clearSearch() {
    document.getElementById("search").value = "";
}




