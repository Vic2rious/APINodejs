import { state } from "./globals.js";


export async function populateOwnerAndCoOwners(card, ownerSelect, coOwnersSelect) {

    try {
        // Fetch the users
        const response = await fetch("/api/users");
        const data = await response.json();

        

        if (data && data.data && Array.isArray(data.data)) {
            // Filter users by board roles
            const filteredUsers = data.data.filter(user => 
                user.board_roles.some(role => role.board_id === parseInt(card.board_id, 10))
            );

            ownerSelect.innerHTML = "<option value=\"0\">None</option>";
            coOwnersSelect.innerHTML = "<option value=\"0\">None</option>";

            if (filteredUsers.length > 0) {
                const optionsHtml = filteredUsers.map(user =>
                    `<option value="${user.user_id}">${user.realname || user.username}</option>`
                ).join("");

                ownerSelect.innerHTML += optionsHtml;
                coOwnersSelect.innerHTML += optionsHtml;

                // Set the selected owner
                if (card.owner_user_id) {
                    ownerSelect.value = card.owner_user_id;
                }

                // Set the selected co-owners (multi-select)
                // Convert co_owner_ids to an array of strings
                const coOwnerIds = card.co_owner_ids.map(id => id.toString());
                for (const option of coOwnersSelect.options) {
                    option.selected = coOwnerIds.includes(option.value);
                    if(option.selected) {
                        state.deletedCoOwnerIds.push(parseInt(option.value, 10));
                    }
                }
            

                
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
}
