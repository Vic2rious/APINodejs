document.addEventListener("DOMContentLoaded", () => {
    const dashboardSelect = document.getElementById("dashboard");
    const workspaceSelect = document.getElementById("workspace");

    workspaceSelect.disabled = true;

    dashboardSelect.addEventListener("change", async () => {
        const dashboardId = dashboardSelect.value;
        if (!dashboardId) {
            workspaceSelect.innerHTML = "<option value=\"\">Select workspace...</option>";
            return;
        }

        try {
            // Fetch the workspaces for the selected dashboard
            const response = await fetch(`/api/dashboard-pages/${dashboardId}/workspaces`);
            const data = await response.json();

            if (Array.isArray(data.data)) {
                // Extract workspace IDs
                const workspaceIds = data.data.map(workspace => workspace.workspace_id);
                // Fetch names for all workspaces
                const workspacePromises = workspaceIds.map(id => 
                    fetch(`/api/workspaces/${id}`).then(response => response.json())
                );
                
                // Wait for all workspace details to be fetched
                const workspacesData = await Promise.all(workspacePromises);
                
                // Build options for the workspace select element
                workspaceSelect.innerHTML = "<option value=\"\">Select workspace...</option>";  
                workspaceSelect.innerHTML += workspacesData.map((workspaceData, index) => 
                    `<option value="${workspaceIds[index]}">${workspaceData.data.name}</option>`
                ).join("");

                workspaceSelect.disabled = false;
            } else {
                workspaceSelect.innerHTML = "<option value=\"\">No workspaces available</option>";
            }
        } catch (error) {
            console.error("Failed to fetch workspaces", error);
            workspaceSelect.innerHTML = "<option value=\"\">Failed to load</option>";
        }
    });
});
