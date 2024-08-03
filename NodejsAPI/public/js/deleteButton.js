document.addEventListener("DOMContentLoaded", () => {
    // Get the button element by its ID
    const button = document.getElementById("deleteButton");

    // Add an event listener to the button that listens for the 'click' event
    button.addEventListener("click", async () => {
        const selectedRow = document.querySelector(".selected");

        if (selectedRow) {
            try {
                const cardId = selectedRow.querySelector("td").textContent;
                const response = await fetch(`/api/cards/${cardId}/delete`, {
                    method: "DELETE"
                });

                if (response.ok) {
                    alert(`Card with ID ${cardId} was deleted`);
                    // Optionally, refresh or update the UI
                } else {
                    alert("Failed to delete card");
                }
            } catch (error) {
                console.error("Failed to delete card: ", error.message);
            }
        } else {
            alert("Please select a card to delete.");
        }
    });
});
