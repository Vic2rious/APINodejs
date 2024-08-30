import express from "express";
import bodyParser from "body-parser";
import path from "path";
import axios from "axios";
import https from "https";
import fs from "fs";
import { fileURLToPath } from "url";

// Import the routes
import routes from "./routes.js"; // Update the path as needed
import uploadRoutes from "./upload.js"; // New upload routes

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 5500;
const apiKeyValue = "blBKknnfhRx5nPghmv5orznIT9pwulvUGZmPDpiv";

// Middleware to parse URL-encoded bodies (for POST requests)
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Read the SSL certificate files
const options = {
    key: fs.readFileSync(path.join(__dirname, "key.pem")),
    cert: fs.readFileSync(path.join(__dirname, "cert.pem"))
};

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Route for the main page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Route for the card create page
app.get("/fileupload", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "fileupload.html"));
});

// Route for the view cards page
app.get("/cards", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "cardselect.html"));
});

// Use the routes defined in routes.js
app.use(routes);

// Use the routes defined in upload.js
app.use(uploadRoutes);

app.get("/post", (req, res) => {
    const { Workflow, Column, Swimlane, Title, Description, Colour, Owner, CoOwners } = req.query;

    const FixedDescription = Description.replace(/\n/g,"<br>");
    const FixedColour = Colour.replace("#","");
    const FixedOwner = Owner === "0" ? null : Owner;
    const FixedCoOwners = (Array.isArray(CoOwners) ? 
    CoOwners.filter(item => item !== "0").map(item => parseInt(item, 10)) 
    : CoOwners === "0" ? [] : [parseInt(CoOwners, 10)]);
    const postData = {
        "title": Title,
        "owner_user_id": FixedOwner,
        "description": FixedDescription,
        "workflow_id": parseInt(Workflow, 10),
        "column_id": parseInt(Column, 10),
        "lane_id": parseInt(Swimlane, 10),
        "color": FixedColour,
        "co_owner_ids_to_add" : FixedCoOwners,
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
    console.log(`HTTPS Server running on https://localhost:${port}`);
});
