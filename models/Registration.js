const mongoose = require("mongoose");
const RegistrationSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    }, 
    quality: {
        type: String 
    }, 
    date: {
        type: String 
    },
    video: {
        type: String 
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model("Products", RegistrationSchema)