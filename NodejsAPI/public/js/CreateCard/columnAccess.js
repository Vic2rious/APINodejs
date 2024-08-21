document.addEventListener("DOMContentLoaded", () => {
    const workflowSelect = document.getElementById("workflow");
    const columnSelect = document.getElementById("column");

    columnSelect.disabled = true;

    workflowSelect.addEventListener("change", async () => {
        const workflowId = workflowSelect.value;
        const boardId = document.getElementById("board").value;
        
        if (!workflowId || !boardId) {
            columnSelect.innerHTML = "<option value=\"\">Select column...</option>";
            return;
        }

        try {
            const response = await fetch(`/api/boards/${boardId}/columns`);
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const filteredColumns = data.data.filter(column => column.workflow_id === parseInt(workflowId, 10));
                    if (filteredColumns.length > 0) {
                        columnSelect.innerHTML = "<option value=\"\">Select column...</option>";
                        columnSelect.innerHTML += filteredColumns.map(column =>
                            `<option value="${column.column_id}">${column.name}</option>`
                        ).join("");

                        columnSelect.disabled = false;
                    } else {
                        columnSelect.innerHTML = "<option value=\"\">No columns available(1)</option>";
                    }
                } else {
                    columnSelect.innerHTML = "<option value=\"\">No columns available(2)</option>";
                }
            } else {
                const text = await response.text();
                console.error("Expected JSON, received:", text);
                columnSelect.innerHTML = "<option value=\"\">Failed to load (invalid JSON response)</option>";
            }
        } catch (error) {
            console.error("Failed to fetch columns", error);
            columnSelect.innerHTML = "<option value=\"\">Failed to load</option>";
        }
    });
});
