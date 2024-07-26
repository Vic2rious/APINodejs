document.addEventListener("DOMContentLoaded", async () => {
    const dashboardSelect = document.getElementById("dashboard");
    try {
        const response = await fetch("/api/dashboard-pages");
        const data = await response.json(); // await???
        
        if (Array.isArray(data.data)) {
            dashboardSelect.innerHTML += data.data.map(dashboard => 
                `<option value="${dashboard.dashboard_page_id}">${dashboard.name}</option>`
            ).join("");
        } else {
            dashboardSelect.innerHTML = "<option value=\"\">No dashboards available</option>";
        }
    } catch (error) {
        console.error("Failed to fetch dashboard pages", error);
        dashboardSelect.innerHTML = "<option value=\"\">Failed to load</option>";
    }
});