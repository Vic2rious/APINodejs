export function showPopup(message, type) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}
