import express from "express";
import axios from "axios";

const router = express.Router();
const apiKeyValue = process.env.KANBANIZE_API_KEY || "blBKknnfhRx5nPghmv5orznIT9pwulvUGZmPDpiv";

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
                method: axiosConfig.method || method,
                headers: {
                    "apikey": apiKeyValue,
                    ...axiosConfig.headers
                },
                params: axiosConfig.params ? axiosConfig.params(params, query) : query,
                data: axiosConfig.data ? axiosConfig.data(data, params, query) : data
            };

            const response = await axios(axiosOptions);
            res.status(response.status).json(response.data);
            //console.log(response);
        } catch (error) {
            console.error(`Failed to ${method} data for ${url}`, error.response ? error.response.data : error.message);
            const statusCode = error.response ? error.response.status : 500;
            res.status(statusCode).json({ error: error.message });
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
        description: data.description,
        tag_ids_to_add: data.tag_ids_to_add,
        tag_ids_to_remove: data.tag_ids_to_remove,
        stickers_to_add: data.stickers_to_add,
        sticker_ids_to_remove: data.sticker_ids_to_remove
    })
});

// Tag operations
createEndpoint("put", "/api/cards/:cardId/tags/:tagId", {
    method: "put",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/tags/${params.tagId}`
});

createEndpoint("delete", "/api/cards/:cardId/tags/:tagId", {
    method: "delete",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/tags/${params.tagId}`
});

createEndpoint("get", "/api/:boardId/tags", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/boards/${params.boardId}/tags`
});

createEndpoint("get", "/api/tags", {
    method: "get",
    url: "https://testfrog.kanbanize.com/api/v2/tags"
});

createEndpoint("get", "/api/cards/:cardId/tags", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/tags`
});

// Sticker operations (similar to tags)
createEndpoint("put", "/api/cards/:cardId/stickers/:stickerId", {
    method: "put",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/stickers/${params.stickerId}`
});

createEndpoint("delete", "/api/cards/:cardId/stickers/:stickerId", {
    method: "delete",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/stickers/${params.stickerId}`
});

createEndpoint("get", "/api/:boardId/stickers", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/boards/${params.boardId}/stickers`
});

createEndpoint("get", "/api/stickers", {
    method: "get",
    url: "https://testfrog.kanbanize.com/api/v2/stickers"
});

createEndpoint("get", "/api/cards/:cardId/stickers", {
    method: "get",
    url: params => `https://testfrog.kanbanize.com/api/v2/cards/${params.cardId}/stickers`
});

export default router;
