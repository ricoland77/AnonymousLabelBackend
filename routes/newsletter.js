const express = require("express");
const router = express.Router();

// import modèle
const Newsletter = require("../models/Newsletter");

router.post("/", async (req, res) => {
  try {
    const newNewsletter = new Newsletter({
      email: req.body.email,
    });

    await newNewsletter.save();
    res.json({ message: "Inscription à la newsletter validée !" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
