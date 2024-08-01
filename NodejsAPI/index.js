const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const axios = require("axios");
const https = require("https");
const fs = require("fs");

const routes = require("./routes");

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

// Route for the view cards page
app.get("/cards", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cardselect.html"));
});

// Use the routes defined in routes.js
app.use(routes);

// Handle GET requests
app.get("/get", (req, res) => {
    
    const {Workflow, Column, Swimlane, Title, Description, Colour } = req.query;

    const FixedDescription = Description.replace(/\n/g,"<br>");
    const FixedColour = Colour.replace("#","");
    const postData = {

        "title": Title,
        "description": FixedDescription,
        "workflow_id": parseInt(Workflow, 10),
        "column_id": parseInt(Column, 10),
        "lane_id": parseInt(Swimlane, 10),
        "color": FixedColour,
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
