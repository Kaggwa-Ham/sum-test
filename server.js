//1. Dependencies
const express = require("express");
const path = require("path");
const mongoose = require("mongoose")
const form = require("./routes/formRoute")
require("dotenv").config();


//2. Instantiations
const app = express();
const PORT = 3005;

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));


//3. Configurations
mongoose.connect(process.env.DATABASE);
mongoose.connection
  .once("open", () => {
    console.log("mongoose connection open");
  })
  .on("error", (err) => {
    console.error(`Connection error:${err.message}`);
  });


//4. Middleware
// app.use(express.static('public'));
// app.use('/public/uploads', express.static(__dirname + '/public/uploads'))
app.use(express.urlencoded({ extended: false }));


//5. Routes
app.use("/", form)

app.use((req, res) => {
  res.status(404).send("Oops! Route not found.");
});
// Modified bottom of your server.js
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

// Crucial step for Vercel serverless handling
module.exports = app;