//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchTagsForCard(card, currentTagsContainer, allTags) {
    let currentTags = [];
    
    currentTags = card.tag_ids.map(cardTag => allTags.find(tag => tag.tag_id === cardTag))
    currentTagsContainer.innerHTML = ""; // Clear previous tags
    state.deletedTagsIds = currentTags.map(tag => tag.tag_id);

    currentTags.forEach(currentTag => {
        const filteredTag = allTags.find(tag => tag.tag_id === currentTag.tag_id);
        const tagDiv = document.createElement("div");
        tagDiv.textContent = filteredTag.label;
        tagDiv.style.backgroundColor = `#${filteredTag.color}`;
        tagDiv.classList.add("box");
        tagDiv.classList.add("tag");
        tagDiv.dataset.tagId = filteredTag.tag_id;

        currentTagsContainer.appendChild(tagDiv);
    });
}

export async function updateAvailableTagsForBoard(card, availableTagsContainer, allTags) {

    const availableTags = allTags.filter(tag => 
        tag.board_ids.some(board => board.board_id === card.board_id) && 
        !card.tag_ids.includes(tag.tag_id)
    );
    // Clear previous tags in the available container
    availableTagsContainer.innerHTML = "";

    // Populate the available tags container
    availableTags.forEach(tag => {
        const tagDiv = document.createElement("div");
        tagDiv.classList.add("box");
        tagDiv.classList.add("tag");
        tagDiv.textContent = tag.label;
        tagDiv.style.backgroundColor = `#${tag.color}`;
        tagDiv.dataset.tagId = tag.tag_id;

        availableTagsContainer.appendChild(tagDiv);
    });
}

export async function fetchAllTags() {
    let allTags = [];
    await fetch("/api/tags")
        .then(response => response.json())
        .then(data => {
            allTags = data.data;
        });
    return allTags;
}
