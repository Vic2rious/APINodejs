const express = require("express");
const axios = require("axios");

const router = express.Router();
const apiKeyValue = "blBKknnfhRx5nPghmv5orznIT9pwulvUGZmPDpiv";

// Endpoint to fetch dashboard pages
router.get("/api/dashboard-pages", async (req, res) => {
    try {
        const response = await axios.get("https://testfrog.kanbanize.com/api/v2/dashboardPages", {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch workspaces based on dashboard_page_id
router.get("/api/dashboard-pages/:dashboardId/workspaces", async (req, res) => {
    const dashboardId = req.params.dashboardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/dashboardPages/${dashboardId}/workspaces`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch workspace details
router.get("/api/workspaces/:workspaceId", async (req, res) => {
    const workspaceId = req.params.workspaceId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/workspaces/${workspaceId}`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch all boards
router.get("/api/boards", async (req, res) => {
    try {
        const response = await axios.get("https://testfrog.kanbanize.com/api/v2/boards", {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch workflows based on board_id
router.get("/api/boards/:boardId/workflows", async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/boards/${boardId}/workflows`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch columns based on board_id
router.get("/api/boards/:boardId/columns", async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/boards/${boardId}/columns`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Failed to fetch columns for board ${boardId}`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch data from the API" });
    }
});

// Endpoint to fetch swimlanes based on board_id
router.get("/api/boards/:boardId/lanes", async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/boards/${boardId}/lanes`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Failed to fetch swimlanes for board ${boardId}`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch data from the API" });
    }
});

// Endpoint to fetch cards based on board_id
router.get("/api/boards/:boardId/cards", async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/cards?board_ids=${boardId}`, {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + boardId + error});
    }
});


module.exports = router;
