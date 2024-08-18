export function showPopup(message, type) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}

// Function to move an element from one container to another
export function moveElement(event, targetContainer) {
    const box = event.target;
    targetContainer.appendChild(box);
}

export function showLoading() {
    const loadingModal = document.getElementById("loadingModal");
    if (loadingModal) {
        loadingModal.style.display = "flex";
    }
}

export function hideLoading() {
    const loadingModal = document.getElementById("loadingModal");
    if (loadingModal) {
        loadingModal.style.display = "none";
    }
}
