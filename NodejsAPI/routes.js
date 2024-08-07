const express = require("express");
const axios = require("axios");

const router = express.Router();
const apiKeyValue = "blBKknnfhRx5nPghmv5orznIT9pwulvUGZmPDpiv";

// Function to create a new endpoint
const createEndpoint = (method, url, axiosConfig) => {
    router[method](url, async (req, res) => {
        const params = req.params;
        const query = req.query;
        const data = req.body;
        
        try {
            const axiosOptions = {
                ...axiosConfig,
                url: typeof axiosConfig.url === "function" ? axiosConfig.url(params, query) : axiosConfig.url,
                headers: {
                    "apikey": apiKeyValue,
                    ...axiosConfig.headers
                },
                params: axiosConfig.params ? axiosConfig.params(params, query) : {},
                data: axiosConfig.data ? axiosConfig.data(data, params, query) : {}
            };
            const response = await axios(axiosOptions);
            res.json(response.data);
        } catch (error) {
            console.error(`Failed to ${method} data for ${url}`, error.response ? error.response.data : error.message);
            res.status(500).json({ error: `Failed to ${method} data from the API` });
        }
    });
};

// Create endpoints
createEndpoint("get", "/api/dashboard-pages", {
    method: "get",
    url: "https://testfrog.kanbanize.com/api/v2/dashboardPages"
});

createEndpoint("get", "/api/dashboard-pages/:dashboardId/workspaces", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/dashboardPages/${params.dashboardId}/workspaces`
});

createEndpoint("get", "/api/workspaces/:workspaceId", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/workspaces/${params.workspaceId}`
});

createEndpoint("get", "/api/boards", {
    method: "get",
    url: "https://testfrog.kanbanize.com/api/v2/boards"
});

createEndpoint("get", "/api/boards/:boardId/workflows", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/boards/${params.boardId}/workflows`
});

createEndpoint("get", "/api/boards/:boardId/columns", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/boards/${params.boardId}/columns`
});

createEndpoint("get", "/api/boards/:boardId/lanes", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/boards/${params.boardId}/lanes`
});

createEndpoint("get", "/api/boards/:boardId/cards", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards?board_ids=${params.boardId}`
});

createEndpoint("delete", "/api/cards/:cardId/delete", {
    method: "delete",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}`
});

createEndpoint("get", "/api/cards/:cardId", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}`
});

// Add PATCH endpoint for updating cards
createEndpoint("patch", "/api/cards/:cardId", {
    method: "patch",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}`,
    data: (data) => ({
        title: data.title,
        description: data.description
    })
});

module.exports = router;
