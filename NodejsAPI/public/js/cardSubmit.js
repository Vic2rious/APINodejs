document.getElementById("cardForm").addEventListener("submit", async function(event) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();
    const title = document.getElementById("getTitle");
    const description = document.getElementById("getDescription");

    try {
        const response = await fetch(`/post?${queryString}`);
        const result = await response.json();
        
        if (result.success) {
            showPopup("Card created successfully", "success");

            title.value = "";   
            description.value = "";   
        } else {
            showPopup(result.message || "Failed to create card", "error");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        showPopup("An error occurred while creating the card", "error");
    }
});

function showPopup(message, type) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.className = `popup ${type}`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
    }, 3000);
}