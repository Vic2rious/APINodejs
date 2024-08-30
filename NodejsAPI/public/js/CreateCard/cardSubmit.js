import { showPopup, showLoading, hideLoading } from "../EditCard/common.js";

document.getElementById("cardForm").addEventListener("submit", async function(event) {
    event.preventDefault();
    showLoading();


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
            hideLoading();
        } else {
            showPopup(result.message || "Failed to create card", "error");
        }
    } catch (error) {
        console.error("Error submitting form:", error);
        showPopup("An error occurred while creating the card", "error");
    }
});