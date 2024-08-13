//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchStickersForCard(cardId, availableStickersContainer, currentStickersContainer) {
    let currentStickers = [];

    const allStickers = await fetchAllStickers();

    await fetch(`/api/cards/${cardId}/stickers`)
        .then(response => response.json())
        .then(data => {
            currentStickers = data.data;
            currentStickersContainer.innerHTML = ""; // Clear previous stickers
            state.originalStickers = currentStickers.map(sticker => sticker.sticker_id);

            currentStickers.forEach(currentSticker => {
                const filteredSticker = allStickers.find(sticker => sticker.sticker_id === currentSticker.sticker_id);
                const stickerButton = document.createElement("button");
                stickerButton.textContent = filteredSticker.label;
                stickerButton.style.backgroundColor = `#${filteredSticker.color}`;
                stickerButton.classList.add("sticker-badge");
                stickerButton.dataset.stickerId = filteredSticker.sticker_id;

                stickerButton.addEventListener("click", () => {
                    // Mark sticker for deletion (with appropriate id)
                    state.deletedStickersIds.push(currentSticker.id); 
                    availableStickersContainer.appendChild(stickerButton); // Move sticker to available container

                    // Remove old click event and add new one to move sticker back to current
                    stickerButton.removeEventListener("click", null);
                    stickerButton.addEventListener("click", () => {
                        state.deletedStickersIds = state.deletedStickersIds.filter(id => id !== currentSticker.id); // Unmark deletion
                        currentStickersContainer.appendChild(stickerButton); // Move sticker back to current container
                    });
                });
                

                currentStickersContainer.appendChild(stickerButton);
            });
        });

    return currentStickers;
}


export async function updateAvailableStickersForBoard(boardId, currentStickers, availableStickersContainer, currentStickersContainer) {
    const allStickers = await fetchAllStickers();

    // Fetch stickers specific to the board
    const boardStickersResponse = await fetch(`/api/${boardId}/stickers`);
    const boardStickersData = await boardStickersResponse.json();
    const boardStickers = boardStickersData.data;

    // Filter out current stickers from the board-specific stickers
    const availableStickers = boardStickers
        .map(boardSticker => {
            const matchedSticker = allStickers.find(sticker => sticker.sticker_id === boardSticker.sticker_id);
            const currentStickerMatch = currentStickers.find(currentSticker => currentSticker.sticker_id === boardSticker.sticker_id);
            if (matchedSticker && currentStickerMatch) {
                return {
                    ...matchedSticker,
                    id: currentStickerMatch.id // Add the id from currentStickers
                };
            }
            return matchedSticker;
        })

    // Clear previous stickers in the available container
    availableStickersContainer.innerHTML = "";

    // Populate the available stickers container
    availableStickers.forEach(sticker => {
        const stickerButton = document.createElement("button");
        stickerButton.textContent = sticker.label;
        stickerButton.style.backgroundColor = `#${sticker.color}`;
        stickerButton.dataset.stickerId = sticker.sticker_id;

        stickerButton.addEventListener("click", () => {
            // Move sticker from available to current
            state.deletedStickersIds = state.deletedStickersIds.filter(id => id !== sticker.id); // Ensure it's not marked for deletion
            currentStickersContainer.appendChild(stickerButton);

            // Remove old click event and add new one to move sticker back to available
            stickerButton.removeEventListener("click", null);
            stickerButton.addEventListener("click", () => {
                // Move sticker back to available
                state.deletedStickersIds.push(sticker.id);
                availableStickersContainer.appendChild(stickerButton);
            });
        });

        availableStickersContainer.appendChild(stickerButton);
    });
}



export async function fetchAllStickers() {
    let allStickers = [];
    await fetch("/api/stickers")
        .then(response => response.json())
        .then(data => {
            allStickers = data.data;
        });
    return allStickers;
}
