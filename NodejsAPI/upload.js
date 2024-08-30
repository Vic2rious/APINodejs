import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import csv from "csv-parser";
import { fileURLToPath } from "url";

// Determine the directory name for ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up Multer for file uploads
const storage = multer.diskStorage({
    destination: path.join(__dirname, "uploads"), // Directory to save uploaded files
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Ensure the uploads directory exists
if (!fs.existsSync(path.join(__dirname, "uploads"))) {
    fs.mkdirSync(path.join(__dirname, "uploads"));
}

// Route to handle file uploads
router.post("/upload", upload.single("csvFile"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const results = [];
    const filePath = path.join(__dirname, "uploads", req.file.filename);

    fs.createReadStream(filePath)
        .pipe(csv())
        .on("data", (data) => results.push(data))
        .on("end", () => {
            // Process the results or save to the database
            //console.log(results);
            res.json({ success: true, data: results });
        })
        .on("error", (error) => {
            console.error("Error processing CSV file:", error);
            res.status(500).json({ success: false, message: "Error processing CSV file" });
        });
});

export default router;
