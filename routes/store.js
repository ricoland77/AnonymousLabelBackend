const express = require("express");
const router = express.Router();
const mg = require("mailgun-js");

const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
  });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const store = require("../data/store.json");

const Store = require("../models/Store");

router.get("/store/projects/", async (req, res) => {
  try {
    res.status(200).json(store);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/payment", async (req, res) => {
  try {
    const {
      email,
      firstname,
      name,
      phone,
      selectedCountry,
      adress,
      postalCode,
      city,
      regionSelect,
      total,
      stripeToken,
      orderSummaryCart,
    } = req.body;

    // Fonction pour envoyer l'e-mail avec le résumé de la commande
    const sendOrderSummaryEmail = async (email, orderSummaryCart) => {
      console.log(email);
      try {
        const mailOptions = {
          from: "anonymous.label.am@gmail.com",
          to: email,
          subject: "Résumé de votre commande",
          html: `<h1>Résumé de votre commande</h1>
            <p>Merci d'avoir passé votre commande. Voici le résumé :</p>
            <ul>
              ${orderSummaryCart.map(
                (album) =>
                  `<li>${album.name} - Quantité : ${album.quantity}</li>`
              )}
            </ul>
            <p>Total : ${total} €</p>
            <p>Nous vous remercions pour votre achat.</p>`,
        };
        mailgun()
          .messages()
          .send(mailOptions, (error, body) => {
            if (error) {
              console.log(error);
              // res.status(500).send({ message: "Error in sending email" });
            } else {
              console.log("E-mail envoyé avec succès !");
            }
          });
      } catch (error) {
        console.error("Erreur lors de l'envoi de l'e-mail :", error);
      }
    };

    if (
      email &&
      firstname &&
      name &&
      phone &&
      selectedCountry &&
      adress &&
      postalCode &&
      city &&
      regionSelect &&
      total &&
      stripeToken &&
      orderSummaryCart
    ) {
      // Créer un tableau pour stocker les objets description
      const descriptionArray = [];
      // console.log(orderSummaryCart);

      // Parcourir orderSummaryCart et ajouter les objets name et quantity à descriptionArray
      orderSummaryCart.forEach((album) => {
        // Ajouter l'objet name et quantity à descriptionArray
        descriptionArray.push({
          artist: album.artist,
          name: album.name,
          quantity: album.quantity,
        });
      });

      const response = await stripe.charges.create({
        amount: total * 100,
        currency: "eur",
        description: JSON.stringify(descriptionArray),
        source: stripeToken,
      });

      const newStore = new Store({
        email: email,
        firstname: firstname,
        name: name,
        phone: phone,
        selectedCountry: selectedCountry,
        adress: adress,
        postalCode: postalCode,
        city: city,
        regionSelect: regionSelect,
        total: total,
        description: descriptionArray,
      });
      await newStore.save();

      // console.log("ok=>", response);
      res.json(response.status);
      sendOrderSummaryEmail(email, orderSummaryCart, total);
    } else {
      res
        .status(400)
        .json({ message: "Veuillez renseigner un nom et un e-mail" });
    }
  } catch (error) {
    res.status(400).json({ message: error.mesage });
  }
});

module.exports = router;
