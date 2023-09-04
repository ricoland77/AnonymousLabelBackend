const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
router.use(jsonParser);

// imports de mon modèle
const Session = require("../models/Session");

// Soumettre une date
// router.post("/booking/enregistrement", async (req, res) => {
//   try {
//     const sessionDate = await Session.findOne({ date: req.body.date });
//     if (sessionDate) {
//       res.status(409).json({ message: "Cet horaire n'est pas disponible" });
//     }
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// Soumettre un projet
router.post("/booking/enregistrement/formulaire", async (req, res) => {
  try {
    if (req.body.name && req.body.email) {
      const newSession = new Session({
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        sms: req.body.sms,
        message: req.body.message,
        session: req.body.session,
        date: req.body.date,
      });
      await newSession.save();
      res.status(201).json({
        message: "Ton rendez-vous pour une session a bien été enregistré !",
      });
    } else {
      res
        .status(400)
        .json({ message: "Veuillez renseigner un nom et un e-mail" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
