const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(bodyParser.json());
app.use(cors());

const uri = "mongodb+srv://priyam356:Tomar9999@cluster0.cawjk02.mongodb.net/";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let collection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
    const database = client.db("MeetingRecords");
    collection = database.collection("Transcripts");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1);
  }
}
app.post("/saveTexts", async (req, res) => {
  try {
    const { id, texts, startTime, endTime } = req.body;
    if (!id || !Array.isArray(texts)) {
      return res.status(400).send("Invalid data format");
    }

    if (!collection) {
      return res.status(500).send("Database not initialized");
    }

    const multilineString = texts.join("\n");

    await collection.insertOne({
      id,
      startTime,
      endTime,
      text: multilineString,
    });
    console.log("Text Saved Successfully");
    res.status(200).send("Texts saved successfully");
  } catch (error) {
    console.error("Error saving texts:", error);
    res.status(500).send("Error saving texts");
  }
});

connectToDatabase().then(() => {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
});
