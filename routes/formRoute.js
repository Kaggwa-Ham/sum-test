// const express = require("express");
// const router = express.Router();
// const multer = require("multer");

// const Registration = require("../models/Registration");


// //Image upload configurations
// let storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'public/uploads')
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })
// let upload = multer({ storage: storage })


// //The routes
// router.get("/", (req, res) => {
//     res.render("index")
// })

// router.get("/form", async (req, res) => {
//     try {
//         res.render("form")
//     } catch (error) {
//         console.error(error)
//     }
// })

// router.post("/form", upload.fields([{ name: "video" }, { name: "image" }]), async (req, res) => {
//     try {

//         const newRegistration = new Registration({
//             title: req.body.title,
//             description: req.body.description,
//             quality: req.body.quality,
//             date: req.body.date,
//             video: req.files["video"][0].path,
//             image: req.files["image"][0].path
//         })
//         await newRegistration.save()
//         res.redirect("/form")
//     } catch (error) {
//         console.error(error)
//     }
// })

// router.get("/videos", async (req, res) => {
//     const registered = await Registration.find().sort({ $natural: -1 })
//     res.render("videos", { registered })
// })
// module.exports = router;


const express = require("express");
const router = express.Router();
const multer = require("multer");
const Registration = require("../models/Registration");

// 1. Import Cloudinary dependencies
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// 2. Configure Cloudinary Credentials (Put these in your .env file)
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// 3. Set Up Cloudinary Remote Storage Settings
const cloudStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        // Automatically determine if asset is a video or image based on upload type
        const isVideo = file.mimetype.startsWith("video");
        return {
            folder: "parkease_media", 
            resource_type: isVideo ? "video" : "image",
            allowed_formats: isVideo ? ["mp4", "mov", "mkv"] : ["jpg", "jpeg", "png"]
        };
    },
});

// 4. Pass the new cloud engine into Multer
const upload = multer({ storage: cloudStorage });

// --- The Routes ---
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
        // When using cloud storage, multer automatically populates req.files[...].path 
        // with the secure live internet URL string (e.g., https://res.cloudinary.com/...)
        const newRegistration = new Registration({
            title: req.body.title,
            description: req.body.description,
            quality: req.body.quality,
            date: req.body.date,
            video: req.files["video"][0].path, // Saved as raw web URL in MongoDB
            image: req.files["image"][0].path  // Saved as raw web URL in MongoDB
        });
        
        await newRegistration.save();
        res.redirect("/form");
    } catch (error) {
        console.error(error);
        res.status(500).send("Upload failed.");
    }
});

router.get("/videos", async (req, res) => {
    const registered = await Registration.find().sort({ $natural: -1 });
    res.render("videos", { registered });
});

module.exports = router;