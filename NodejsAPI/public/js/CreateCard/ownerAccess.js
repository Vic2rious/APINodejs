document.addEventListener("DOMContentLoaded", () => {
    const boardSelect = document.getElementById("board");
    const ownerSelect = document.getElementById("owner");
    const coOwnersSelect = document.getElementById("coOwners");

    ownerSelect.disabled = true;
    coOwnersSelect.disabled = true;

    boardSelect.addEventListener("change", async () => {
        const boardId = boardSelect.value;
        if (!boardId) {
            ownerSelect.innerHTML = "<option value=\"\">Select owner...</option>";
            coOwnersSelect.innerHTML = "<option value=\"\">Select co-owners...</option>";
            return;
        }

        try {
            // Fetch the users for the selected board
            const response = await fetch("/api/users");
            const data = await response.json();

            if (data && data.data && Array.isArray(data.data)) {
                // Filter users by board roles
                const filteredUsers = data.data.filter(user => 
                    user.board_roles.some(role => role.board_id === parseInt(boardId, 10))
                );

                ownerSelect.innerHTML = "";
                coOwnersSelect.innerHTML = "";

                // Populate the Owner dropdown
                ownerSelect.innerHTML = "<option value=\"0\" selected>None</option>";
                coOwnersSelect.innerHTML = "<option value=\"0\" selected>None</option>";



                if (filteredUsers.length > 0) {
                    const optionsHtml = filteredUsers.map(user =>
                        `<option value="${user.user_id}">${user.realname || user.username}</option>`
                    ).join("");

                    ownerSelect.innerHTML += optionsHtml;
                    coOwnersSelect.innerHTML += optionsHtml;

                    ownerSelect.disabled = false;
                    coOwnersSelect.disabled = false;
                } else {
                    ownerSelect.innerHTML += "<option value=\"\">No owners available</option>";
                    coOwnersSelect.innerHTML += "<option value=\"\">No co-owners available</option>";

                    ownerSelect.disabled = true;
                    coOwnersSelect.disabled = true;
                }
            } else {
                ownerSelect.innerHTML = "<option value=\"\">No owners available</option>";
                coOwnersSelect.innerHTML = "<option value=\"\">No co-owners available</option>";

                ownerSelect.disabled = true;
                coOwnersSelect.disabled = true;
            }
        } catch (error) {
            console.error("Failed to fetch owners and co-owners", error);
            ownerSelect.innerHTML = "<option value=\"\">Failed to load</option>";
            coOwnersSelect.innerHTML = "<option value=\"\">Failed to load</option>";

            ownerSelect.disabled = true;
            coOwnersSelect.disabled = true;
        }
    });
});
