// server.js
const express = require("express");
const cors = require("cors");
const mongoose = require('mongoose');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// --- MongoDB Connection ---
// We will create a new database named 'travelDB'
mongoose.connect("mongodb://127.0.0.1:27017/travelDB")
    .then(() => console.log("MongoDB connected to travelDB"))
    .catch(err => console.log("MongoDB connection error:", err));

// --- Mongoose Schema and Model (for Travel Packages) ---
const packageSchema = new mongoose.Schema({
    packageName: { type: String, required: true },
    packageCode: { type: String, required: true, unique: true }, // Unique code like 'regno'
    destination: { type: String, required: true },
    duration: { type: Number, required: true },
    price: { type: Number, required: true }
});

// Create the model, linking it to the 'packages' collection in the DB
const Package = mongoose.model("Package", packageSchema, 'packages');


// --- API Endpoints (CRUD Operations) ---

// 1. READ (Fetch) all packages
app.get("/api/packages", async (req, res) => {
    try {
        const packages = await Package.find();
        res.send(packages); // Send the array of packages
    } catch (err) {
        res.json({ message: "Error fetching packages" });
    }
});

// 2. CREATE (Insert) a new package
app.post("/api/addPackage", async (req, res) => {
    try {
        // Get data from request body
        const { packageName, packageCode, destination, duration, price } = req.body;

        const newPackage = new Package({
            packageName: packageName,
            packageCode: packageCode,
            destination: destination,
            duration: Number(duration),
            price: Number(price)
        });

        await newPackage.save(); // Save to database
        
        // Send a 'message' response, as expected by the client
        res.json({ message: "Package Saved Successfully" });
    } catch (err) {
        // Handle duplicate 'packageCode' error
        if (err.code == 11000) {
            res.json({ message: `Package with code ${req.body.packageCode} already exists` });
        } else {
            res.json({ message: err.message });
        }
    }
});

// 3. DELETE a package
app.post("/api/deletePackage", async (req, res) => {
    const { id } = req.body; // Get the _id from the request body
    try {
        await Package.findByIdAndDelete(id);
        res.json({ message: "Package deleted successfully" });
    } catch (err) {
        res.json({ message: "Error deleting package" });
    }
});


// --- Start Server ---
const PORT = 7000; // Using port 7000 as in the example
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
