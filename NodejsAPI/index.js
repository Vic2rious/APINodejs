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

app.get("/post", (req, res) => {
    const { Workflow, Column, Swimlane, Title, Description, Colour } = req.query;

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
    // eslint-disable-next-line no-unused-vars
    .then(response => {
        res.json({ success: true });
    })
    .catch(error => {
        console.error("Error posting data:", error);
        res.status(500).json({ success: false, message: "Error posting data" });
    });
});


// Create HTTPS server
https.createServer(options, app).listen(port, () => {
    console.log("HTTPS Server running on https://localhost:" + port);
});
