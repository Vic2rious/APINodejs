//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchStickersForCard(cardId, currentStickersContainer) {
    const response = await fetch(`/api/cards/${cardId}/stickers`);
    const data = await response.json();
    const stickers = data.data;

    const allStickers = await fetchAllStickers();

    currentStickersContainer.innerHTML = ""; // Clear previous stickers
    state.deletedStickersIds = stickers.map(sticker => sticker.id);


    stickers.forEach(currentSticker => {
        const filteredSticker = allStickers.find(sticker => sticker.sticker_id === currentSticker.sticker_id);
        const stickerDiv = document.createElement("div");
        stickerDiv.textContent = filteredSticker.label; // Assuming label is the text content for stickers
        stickerDiv.classList.add("sticker");
        stickerDiv.classList.add("box");
        stickerDiv.dataset.stickerId = filteredSticker.sticker_id;
        stickerDiv.dataset.id = currentSticker.id; // Include the id
        stickerDiv.style.backgroundColor = `#${filteredSticker.color}`;

        currentStickersContainer.appendChild(stickerDiv);
    });

    return stickers;
}



export async function updateAvailableStickersForBoard(boardId, currentStickers, availableStickersContainer) {
    const allStickers = await fetchAllStickers();

    const boardStickersResponse = await fetch(`/api/boards/${boardId}/stickers`);
    const boardStickersData = await boardStickersResponse.json();
    const boardStickers = boardStickersData.data;

    const availableStickers = boardStickers
        .map(boardSticker => {
            const sticker = allStickers.find(sticker => sticker.sticker_id === boardSticker.sticker_id);
            return {
                ...sticker,
                id: null
            };
        })
        //.filter(sticker => sticker && !currentStickers.some(currentSticker => currentSticker.sticker_id === sticker.sticker_id));

    availableStickersContainer.innerHTML = "";

    availableStickers.forEach(sticker => {
        const stickerDiv = document.createElement("div");
        stickerDiv.textContent = sticker.label; // Assuming label is the text content for stickers
        stickerDiv.classList.add("sticker");
        stickerDiv.classList.add("box");
        stickerDiv.dataset.stickerId = sticker.sticker_id;
        if (sticker.id) stickerDiv.dataset.id = sticker.id;

        stickerDiv.style.backgroundColor = `#${sticker.color}`;

        availableStickersContainer.appendChild(stickerDiv);
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
