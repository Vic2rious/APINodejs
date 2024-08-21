//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchStickersForCard(card, currentStickersContainer, allStickers) {

    const currentStickers = card.stickers;

    currentStickersContainer.innerHTML = ""; // Clear previous stickers
    state.deletedStickersIds = currentStickers.map(sticker => sticker.id);


    currentStickers.forEach(currentSticker => {
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
}



export async function updateAvailableStickersForBoard(card, availableStickersContainer, allStickers) {

    const availableStickers = allStickers.filter(sticker => 
        sticker.board_ids.some(board => board.board_id === card.board_id)
    );


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
