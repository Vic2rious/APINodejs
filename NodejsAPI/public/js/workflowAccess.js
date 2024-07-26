document.addEventListener("DOMContentLoaded", () => {
    const boardSelect = document.getElementById("board");
    const workflowSelect = document.getElementById("workflow");

    workflowSelect.disabled = true;

    boardSelect.addEventListener("change", async () => {
        const boardId = boardSelect.value;
        if (!boardId) {
            workflowSelect.innerHTML = "<option value=\"\">Select workflow...</option>";
            return;
        }

        try {
            // Fetch the workflows for the selected board
            const response = await fetch(`/api/boards/${boardId}/workflows`);
            const data = await response.json();

            if (data && data.data && Array.isArray(data.data)) {
                // Build options for the workflow select element
                workflowSelect.innerHTML += data.data.map(workflow => 
                    `<option value="${workflow.workflow_id}">${workflow.name}</option>`
                ).join("");

                workflowSelect.disabled = false;
            } else {
                workflowSelect.innerHTML = "<option value=\"\">No workflows available</option>";
            }
        } catch (error) {
            console.error("Failed to fetch workflows", error);
            workflowSelect.innerHTML = "<option value=\"\">Failed to load</option>";
        }
    });
});
