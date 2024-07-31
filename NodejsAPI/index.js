const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const https = require("https");
const fs = require("fs");

const app = express();
const port = 5500;
const apiKeyValue = "blBKknnfhRx5nPghmv5orznIT9pwulvUGZmPDpiv";

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Read the SSL certificate files
const options = {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem")
};

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

// Endpoint to fetch columns based on board_id
app.get("/api/boards/:boardId/columns", async (req, res) => {
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
app.get("/api/boards/:boardId/lanes", async (req, res) => {
    const boardId = req.params.boardId;
    try {
        const response = await axios.get(`https://testfrog.kanbanize.com/api/v2/boards/${boardId}/lanes`, {
            headers: {
                "apikey": apiKeyValue // Replace with your actual API token
            }
        });
        res.json(response.data);
    } catch (error) {
        console.error(`Failed to fetch swimlanes for board ${boardId}`, error.response ? error.response.data : error.message);
        res.status(500).json({ error: "Failed to fetch data from the API" });
    }
});


// Handle GET requests
app.get("/get", (req, res) => {
    
    const Workflow = req.query.Workflow;
    const Swimlane = req.query.Swimlane;
    const Column = req.query.Column;

    const Title = req.query.Title;
    const Description = req.query.Description;
    const postData = {

        "title": Title,
        "description": Description,
        "workflow_id": parseInt(Workflow, 10),
        "column_id": parseInt(Column, 10),
        "lane_id": parseInt(Swimlane, 10),
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
        console.log(Column + "asdf");
        console.error("Error posting data:", error);
        res.status(500).send("Error posting data");
    });
});

// Create HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log("HTTPS Server running on https://localhost:" + port);
});
