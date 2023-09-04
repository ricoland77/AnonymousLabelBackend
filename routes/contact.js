const express = require("express");
const router = express.Router();
const axios = require("axios");
const mg = require("mailgun-js");

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

// imports de mon modèle
const ContactProject = require("../models/ContactProject");

// Soumettre un projet
router.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    mailgun()
      .messages()
      .send(
        {
          from: email,
          to: "anonymous.label.am@gmail.com",
          subject: subject,
          html: message,
        },
        (error, body) => {
          if (error) {
            // console.log(error);
            res.status(500).send({ message: "Error in sending email" });
          }
        }
      );

    if (name && email) {
      const newContactProject = new ContactProject({
        name,
        email,
        subject,
        message,
      });
      await newContactProject.save();
      res.status(201).json({ message: "Formulaire envoyé !" });
    } else {
      res
        .status(400)
        .json({ message: "Veuillez renseigner un nom et un e-mail" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// recaptcha
router.post("/verify-token", async (req, res) => {
  const { reCAPTCHA_TOKEN, Secret_Key } = req.body;

  try {
    let response = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=${Secret_Key}&response=${reCAPTCHA_TOKEN}`
    );
    console.log("ok", response.data);

    return res.status(200).json({
      success: true,
      message: "Token successfully verified",
      verification_info: response.data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error verifying token",
    });
  }
});

module.exports = router;
