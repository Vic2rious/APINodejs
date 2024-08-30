// // Function to collect cardIds and customIds and send them in a POST request
// async function sendCardUpdates() {
//     const cardUpdates = [];
//     const textboxes = document.querySelectorAll(".edit-textbox");

//     textboxes.forEach(textbox => {
//         const cardId = textbox.id.replace("cardId-", "");
//         const customId = textbox.value;

//         if (customId) {
//             cardUpdates.push({
//                 card_id: parseInt(cardId),
//                 custom_id: parseInt(customId)
//             });
//         }
//     });

//     if (cardUpdates.length === 0) {
//         showPopup("No custom IDs to update", "error");
//         return;
//     }

//     showLoading();
//     try {
//         const response = await fetch("/api/cards/updateMany", {
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body: JSON.stringify({ cards: cardUpdates })
//         });

//         const result = await response.json();
//         if (result.success) {
//             showPopup("Cards updated successfully", "success");
//         } else {
//             showPopup("Failed to update cards: " + result.message, "error");
//         }
//     } catch (error) {
//         console.error("Error sending card updates:", error);
//         showPopup("An error occurred while updating the cards.", "error");
//     } finally {
//         hideLoading();
//     }
// }

// // Add event listener to the button
// document.getElementById("update-cards-button").addEventListener("click", async function(event) {
//     event.preventDefault();
//     sendCardUpdates();
// });