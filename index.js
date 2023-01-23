const express = require("express");
const cors = require("cors");
const Datastore = require("nedb");

const app = express();

app.listen(4000, () => console.log("listening at port 4000"));
app.use(
  cors({
    origin: "http://localhost:3000",
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

    res.json(data);
  });
});
