const express = require('express');
const Datastore = require('nedb');

const app = express();

app.listen(4000, () => console.log('listening at port 4000'))
app.use(express.static('public'))
app.use(express.json({
  limit: '1mb',
}))

const database = new Datastore('database.db')
database.loadDatabase();

app.post('/api', (req, res) => {
  console.log('I got a request!')
  const data = req.body;
  const timeStamp = Date.now();
  data.timeStamp = timeStamp;
  database.insert(data);
  res.json(data)
})