// function deleteSelectedCard() {
//     document.addEventListener("DOMContentLoaded", () => {
//         const deleteButton = document.getElementById("deleteButton");
    
//         deleteButton.addEventListener("click", async () => {
//             const selectedRow = document.querySelector(".selected");
    
//             if (selectedRow) {
//                 try {
//                     const cardId = selectedRow.querySelector("td").textContent;
//                     const response = await fetch(`/api/cards/${cardId}/delete`, {
//                         method: "DELETE"
//                     });
    
//                     if (response.ok) {
//                         selectedRow.remove();
//                         showPopup(`Card with ID ${cardId} was deleted successfully`);
//                     } else {
//                         showPopup("Failed to delete card", true);
//                     }
//                 } catch (error) {
//                     console.error("Failed to delete card: ", error.message);
//                     showPopup("An error occurred while deleting the card", true);
//                 }
//             } else {
//                 showPopup("Please select a card to delete.", true);
//             }
//         });
    
//         function showPopup(message, isError = false) {
//             const popup = document.createElement("div");
//             popup.className = `popup ${isError ? "error" : "success"}`;
//             popup.textContent = message;
    
//             document.body.appendChild(popup);
    
//             setTimeout(() => {
//                 popup.remove();
//             }, 3000);
//         }
//     });
// }


