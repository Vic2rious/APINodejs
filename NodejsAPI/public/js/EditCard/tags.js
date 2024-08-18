//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchTagsForCard(cardId, currentTagsContainer) {
    let currentTags = [];

    const allTags = await fetchAllTags();

    const response = await fetch(`/api/cards/${cardId}/tags`);
    const data = await response.json();
    currentTags = data.data;
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

    return currentTags;
}

export async function updateAvailableTagsForBoard(boardId, currentTags, availableTagsContainer) {
    const allTags = await fetchAllTags();

    // Fetch tags specific to the board
    const boardTagsResponse = await fetch(`/api/boards/${boardId}/tags`);
    const boardTagsData = await boardTagsResponse.json();
    const boardTags = boardTagsData.data;

    // Filter out current tags from the board-specific tags
    const availableTags = boardTags
        .map(boardTag => allTags.find(tag => tag.tag_id === boardTag.tag_id))
        .filter(tag => tag && !currentTags.some(currentTag => currentTag.tag_id === tag.tag_id));

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

async function fetchAllTags() {
    let allTags = [];
    await fetch("/api/tags")
        .then(response => response.json())
        .then(data => {
            allTags = data.data;
        });
    return allTags;
}
