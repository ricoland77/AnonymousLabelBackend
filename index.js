require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cloudinary = require("cloudinary").v2;

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URI);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Déclaration des Routes
const userRoutes = require("./routes/user");
const storeRoutes = require("./routes/store");
const newsletterRoutes = require("./routes/newsletter");
const contactRoutes = require("./routes/contact");
const sessionRouter = require("./routes/sessionStudio");

app.use(userRoutes);
app.use(storeRoutes);
app.use(newsletterRoutes);
app.use(contactRoutes);
app.use(sessionRouter);

app.get("/", (req, res) => {
  res.json("Bienvenue sur l'API d’Anonymous Label");
});

app.all("*", function (req, res) {
  res.status(400).json({ message: "Page not found" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
