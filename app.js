const express = require("express");
const app = express();

const bodyparser = require("body-parser");
const { MongoClient, ObjectId } = require("mongodb");

app.use(bodyparser.json());

require('dotenv').config();

const url = process.env.MONGODB_URL;

const dbName = 'kirjarekisteri';
const bookCollection = 'kirja';

const portti = 3000;

const connectToMongo = async () => {

  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {

    await client.connect();
    
    console.log("Yhteys tietokantaan muodostettu");

    const db = client.db(dbName);
    const kirjaKokoelma = db.collection(bookCollection);

    app.get("/kirjat", async (req, res) => {
        try {
          const kirjat = await kirjaKokoelma.find().toArray();
          res.json(kirjat);
        } catch (err) {
          console.error("Tietojen hakeminen epäonnistui", err);
          res.status(500).json({ error: "Tietojen hakeminen epäonnistui" });
        }
      });

    app.get("/kirja/:id", async (req, res) => {

      try {

        const kirja = await kirjaKokoelma.find({ _id: new ObjectId(req.params.id) }).toArray();
        res.json(kirja);
      
      } catch (err) {
      
        console.error("Tietojen hakeminen epäonnistui", err);
        res.status(500).json({ error: "Tietojen hakeminen epäonnistui" });
      
      }
    });

    //GET polkua käytetään hakemaan kirjat, jotka ovat status: "want to read" ja rating >= parametrin rating ja genre = parametrin genre
    app.get("/seuraavaksi-luettavaksi/:rating/:genre", async (req, res) => {
      try {
        const suositukset = await kirjaKokoelma.find({ 
          status: "want to read", 
          rating : { $gte: parseFloat(req.params.rating) },
          genre: req.params.genre
        }).sort({rating: -1}).toArray();

        res.json(suositukset);
        
      } catch (err) {
        console.error("Tietojen hakeminen epäonnistui", err);
        res.status(500).json({ error: "Tietojen hakeminen epäonnistui" });
      }
    });

    //POST-polkua käytetään uuden kirjan lisäämiseen

    app.post("/lisaa-kirja", async (req, res) => {

      try {
        const uusiKirja = await kirjaKokoelma.insertOne(req.body);
      
        res.json({ message: "Kirjan lisääminen onnistui", newDocument: uusiKirja});

      } catch (err) {
        console.error("Kirjan lisääminen epäonnistui", err);
        res.status(500).json({ error: "Kirjan lisääminen epäonnistui" });
      }
    });

    //PUT-polku - Arvostelun lisäämiseksi: status: "read", my_review: "teksti", my_rating: 1-5, read: aikaleima
    app.put("/arvostele/:id", async (req, res) => {

      try { 
        const arvostelu = await kirjaKokoelma.findOneAndUpdate(
          { _id: new ObjectId(req.params.id) },
          { 
            $set: {
              status: "read", 
              my_review: req.body.my_review,
              my_rating: req.body.my_rating
            },
            $currentDate: { 
              read: true 
            } 
          },
          { returnDocument: "after" }
        );

        res.json({ message: "Kirjan arvostelu onnistui", updatedDocument: arvostelu});

      } catch (err) {
        console.error("Kirjan arvostelu epäonnistui", err);
        res.status(500).json({ error: "Kirjan arvostelu epäonnistui" });
      }

    });

    //DELETE-polkua käytetään kirjan poistamiseen
    app.delete("/poista/:id", async (req, res) => {

      try {
        const poistettuKirja = await kirjaKokoelma.findOneAndDelete({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Kirjan poistaminen onnistui", deletedDocument: poistettuKirja});

      } catch (err) {
        console.error("Kirjan poistaminen epäonnistui", err);
        res.status(500).json({ error: "Kirjan poistaminen epäonnistui" });
      }

    });

    app.listen(portti, () => {
      console.log(`Palvelin käynnistyi porttiin ${portti}`);
    });

  } catch (err) {
    console.error("Yhteys tietokantaan epäonnistui", err);
  }
};


connectToMongo();
