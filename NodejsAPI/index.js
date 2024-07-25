const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");

const app = express();
const port = 5500;
const apiKeyValue = "EpMTRhMVkgwk2EldA3QbSUIH3mrTBhvZvXhfd6pe";

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for the card create page
app.get("/cardcreate", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cardcreate.html"));
});
// Endpoint to fetch dashboard pages
app.get("/api/dashboard-pages", async (req, res) => {
    try {
        const response = await axios.get("https://testfrog.kanbanize.com/api/v2/dashboardPages", {
            headers: {
                "apikey": apiKeyValue
            }
        });
        res.json(response.data);
        //console.log(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch workspaces based on dashboard_page_id
app.get("/api/dashboard-pages/:dashboardId/workspaces", async (req, res) => {
    const dashboardId = req.params.dashboardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/dashboardPages/${dashboardId}/workspaces`, {
            headers: {
                "apikey": apiKeyValue             }
        });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch data from the API: " + error });
    }
});

// Endpoint to fetch workspace details
app.get("/api/workspaces/:workspaceId", async (req, res) => {
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
app.get("/api/boards", async (req, res) => {
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
app.get("/api/boards/:boardId/workflows", async (req, res) => {
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

// Handle GET requests
app.get("/get", (req, res) => {
    const Title = req.query.Title;
    const Description = req.query.Description;
    const Status = req.query.Status;
    const postData = {
        "card_id": 82,
        "custom_id": null,
        "board_id": 4,
        "workflow_id": 7,
        "title": Title,
        "description" : Description,
        "owner_user_id": 2,
        "type_id": null,
        "color": "ef24f2",
        "section": 2,
        "column_id": Status,
        "lane_id": 6,
        "position": 0
    };

    axios.post("https://testfrog.kanbanize.com/api/v2/cards", postData, {
        headers: {
            apikey: apiKeyValue
        }
    })
    .then(response => {
        console.log(response.data);
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Response</title>
                <link rel="stylesheet" href="css/styles.css">
            </head>
            <body>
                <h1>POST Request Successful</h1>
                <div class="response-container">
                    <h2>Response Data:</h2>
                    <pre>${JSON.stringify(response.data, null, 2)}</pre>
                    <a href="/cardcreate" class="button">Back to Create Card</a>
                </div>
            </body>
            </html>
        `);
    })
    .catch(error => {
        console.error("Error posting data:", error);
        res.status(500).send("Error posting data");
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
