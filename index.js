const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");
const { default: fetch } = require("node-fetch");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`starting server at ${port}`));
app.use(
  cors({
    origin: "https://whereyouat.brianguterl.com",
    // origin: "http://localhost:3000",
  })
);

app.use(express.static("public"));
app.use(
  express.json({
    limit: "1mb",
  })
);

const database = new Datastore("database.db");
database.loadDatabase();

app.post("/api", (req, res) => {
  console.log("I got a request!");
  const data = req.body;
  const timeStamp = Date.now();
  data.timeStamp = timeStamp;
  database.insert(data);
  res.json(data);
});

app.get("/api", (req, res) => {
  // empty object because I want to list everything
  database.find({}, (err, data) => {
    if (err) {
      console.error(err);
    }
    console.log(data);
    res.json(data);
  });
});

app.get("/weather/:latlon", async (req, res) => {
  try {
    const latlon = req.params.latlon.split(",");
    const lat = latlon[0];
    const lon = latlon[1];
    const API_key = process.env.API_KEY;
    const weather_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;
    const airQuality_url = `https://api.openaq.org/v2/latest?coordinates=${lat},${lon}&radius=2500`;
    const weather_res = await fetch(weather_url);
    const air_res = await fetch(airQuality_url);
    const weatherData = await weather_res.json();
    const airData = await air_res.json();
    res.json({ weather: weatherData, air: airData });
  } catch (error) {
    console.error(error);
  }
});
