document.addEventListener("DOMContentLoaded", () => {
    const workflowSelect = document.getElementById("workflow");
    const swimlaneSelect = document.getElementById("swimlane");

    swimlaneSelect.disabled = true;

    workflowSelect.addEventListener("change", async () => {
        const workflowId = workflowSelect.value;
        const boardId = document.getElementById("board").value;
        
        if (!workflowId || !boardId) {
            swimlaneSelect.innerHTML = "<option value=\"\">Select swimlane...</option>";
            return;
        }

        try {
            const response = await fetch(`/api/boards/${boardId}/lanes`);
            const contentType = response.headers.get("content-type");

            if (contentType && contentType.includes("application/json")) {
                const data = await response.json();

                if (data && data.data && Array.isArray(data.data)) {
                    const filteredLanes = data.data.filter(lane => lane.workflow_id === parseInt(workflowId, 10));
                    if (filteredLanes.length > 0) {
                        swimlaneSelect.innerHTML = "<option value=\"\">Select swimlane...</option>";
                        swimlaneSelect.innerHTML += filteredLanes.map(lane =>
                            `<option value="${lane.lane_id}">${lane.name}</option>`
                        ).join("");

                        swimlaneSelect.disabled = false;
                    } else {
                        swimlaneSelect.innerHTML = "<option value=\"\">No swimlanes available(1)</option>";
                    }
                } else {
                    swimlaneSelect.innerHTML = "<option value=\"\">No swimlanes available(2)</option>";
                }
            } else {
                const text = await response.text();
                console.error("Expected JSON, received:", text);
                swimlaneSelect.innerHTML = "<option value=\"\">Failed to load (invalid JSON response)</option>";
            }
        } catch (error) {
            console.error("Failed to fetch swimlanes", error);
            swimlaneSelect.innerHTML = "<option value=\"\">Failed to load</option>";
        }
    });
});
