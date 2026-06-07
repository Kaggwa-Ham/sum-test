const express = require("express");
const router = express.Router();
const multer = require("multer");

const Registration = require("../models/Registration");


//Image upload configurations
let storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads')
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname)
    }
})
let upload = multer({ storage: storage })


//The routes
router.get("/", (req, res) => {
    res.render("index")
})

router.get("/form", async (req, res) => {
    try {
        res.render("form")
    } catch (error) {
        console.error(error)
    }
})

router.post("/form", upload.fields([{ name: "video" }, { name: "image" }]), async (req, res) => {
    try {

        const newRegistration = new Registration({
            title: req.body.title,
            description: req.body.description,
            quality: req.body.quality,
            date: req.body.date,
            video: req.files["video"][0].path,
            image: req.files["image"][0].path
        })
        await newRegistration.save()
        res.redirect("/form")
    } catch (error) {
        console.error(error)
    }
})

router.get("/videos", async (req, res) => {
    const registered = await Registration.find().sort({ $natural: -1 })
    res.render("videos", { registered })
})
module.exports = router;