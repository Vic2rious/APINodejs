//import { showPopup } from './common.js';
import { state } from "./globals.js";

export async function fetchTagsForCard(cardId, availableTagsContainer, currentTagsContainer) {
    let currentTags = [];

    const allTags = await fetchAllTags();

    await fetch(`/api/cards/${cardId}/tags`)
        .then(response => response.json())
        .then(data => {
            currentTags = data.data;
            currentTagsContainer.innerHTML = ""; // Clear previous tags
            state.originalTags = currentTags.map(tag => tag.tag_id);

            currentTags.forEach(currentTag => {
                const filteredTag = allTags.find(tag => tag.tag_id === currentTag.tag_id);
                const tagButton = document.createElement("button");
                tagButton.textContent = filteredTag.label;
                tagButton.style.backgroundColor = `#${filteredTag.color}`;
                tagButton.classList.add("tag-badge");
                tagButton.dataset.tagId = filteredTag.tag_id;

                // Add an event listener to move the tag back to available tags
                tagButton.addEventListener("click", () => {
                    state.deletedTagsIds.push(filteredTag.tag_id); // Mark tag for deletion
                    availableTagsContainer.appendChild(tagButton); // Move tag to available container

                    // Remove old click event and add new one to move tag back to current
                    tagButton.removeEventListener("click", null);
                    tagButton.addEventListener("click", () => {
                        state.deletedTagsIds = state.deletedTagsIds.filter(id => id !== filteredTag.tag_id); // Unmark deletion
                        currentTagsContainer.appendChild(tagButton); // Move tag back to current container
                    });
                });

                currentTagsContainer.appendChild(tagButton);
            });
        });

    return currentTags;
}


export async function updateAvailableTagsForBoard(boardId, currentTags, availableTagsContainer, currentTagsContainer) {
    const allTags = await fetchAllTags();

    // Fetch tags specific to the board
    const boardTagsResponse = await fetch(`/api/${boardId}/tags`);
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
        const tagButton = document.createElement("button");
        tagButton.textContent = tag.label;
        tagButton.style.backgroundColor = `#${tag.color}`;
        tagButton.dataset.tagId = tag.tag_id;

        tagButton.addEventListener("click", () => {
            // Move tag from available to current
            state.deletedTagsIds = state.deletedTagsIds.filter(id => id !== tag.tag_id); // Ensure it's not marked for deletion
            currentTagsContainer.appendChild(tagButton);

            // Remove old click event and add new one to move tag back to available
            tagButton.removeEventListener("click", null); 
            tagButton.addEventListener("click", () => {
                // Move tag back to available
                state.deletedTagsIds.push(tag.tag_id);
                availableTagsContainer.appendChild(tagButton);
            });
        });

        availableTagsContainer.appendChild(tagButton);
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
