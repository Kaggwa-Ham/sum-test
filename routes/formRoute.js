const express = require("express");
const router = express.Router();
const Registration = require("../models/Registration");

// 1. Home and Form View Routes
router.get("/", (req, res) => {
    res.render("index");
});

router.get("/form", async (req, res) => {
    try {
        res.render("form");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading form.");
    }
});

// 2. Upgraded POST route: Receives standard string URLs directly inside req.body
router.post("/form", async (req, res) => {
    try {
        const newRegistration = new Registration({
            title: req.body.title,
            description: req.body.description,
            quality: req.body.quality,
            date: req.body.date,
            video: req.body.video, // Already a secure URL link string from frontend fetch
            image: req.body.image  // Already a secure URL link string from frontend fetch
        });
        
        await newRegistration.save();
        
        // CRUCIAL: Send status 200 OK back to your frontend fetch script
        res.sendStatus(200); 
    } catch (error) {
        console.error("Database save failed:", error);
        res.status(500).send("Database processing error.");
    }
});

// 3. Videos Gallery Route
router.get("/videos", async (req, res) => {
    try {
        const registered = await Registration.find().sort({ $natural: -1 });
        res.render("videos", { registered });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading videos.");
    }
});

module.exports = router;