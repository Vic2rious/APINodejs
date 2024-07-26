document.addEventListener("DOMContentLoaded", () => {
    const workspaceSelect = document.getElementById("workspace");
    const boardSelect = document.getElementById("board");

    boardSelect.disabled = true;

    // Fetch all boards once and store them
    let allBoards = [];

    async function fetchBoards() {
        try {
            const response = await fetch("/api/boards");
            const data = await response.json();
            
            if (Array.isArray(data.data)) {
                allBoards = data.data;
                //console.log("Data Fetched");
            } else {
                console.error("No boards available");
                allBoards = [];
            }
        } catch (error) {
            console.error("Failed to fetch boards", error);
            allBoards = [];
        }
    }

    async function updateBoardOptions() {
        const workspaceId = workspaceSelect.value;
        if (!workspaceId || workspaceId === "undefined") {
            boardSelect.innerHTML = "<option value=\"\">Select board...</option>";
            return;
        }

        // Filter boards by the selected workspace
        const filteredBoards = allBoards.filter(board => board.workspace_id === parseInt(workspaceId, 10));

        // Build options for the board select element
        boardSelect.innerHTML += filteredBoards.map(board => 
            `<option value="${board.board_id}">${board.name}</option>`
        ).join("");
        
        boardSelect.disabled = false;
    }

    // Fetch boards when the script is loaded
    fetchBoards();

    // Update board options when workspace changes
    workspaceSelect.addEventListener("change", updateBoardOptions);
});
