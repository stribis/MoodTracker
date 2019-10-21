// Get packages: 
const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
require('dotenv').config()
// Initialize express in app
const app = express()
// set the port to the enviroment port or to 3000 if there isn't one
const port = process.env.PORT || 3000

// Set the server to listen on the specified port
app.listen(port, () => {
  console.log(`app is listening at port:${port}`)
})

// Lets set public as our static directory 
app.use(express.static('public'))
// Make sure we can handle json res &  req with express.json
  // => set the data limit to 1mb
app.use(express.json({
  limit: '1mb'
}))

// We only need one database, lets called it 'database' and load it from database/database.db
// Using NeDB's Datastore
const database = new Datastore('database/database.db')
// Make sure the database is loaded
database.loadDatabase()

// We can start making our api endpoints
  // GET /api
app.get('/api', (req, res) => {
  // send the information from the database to the client
  database.find({}, (err, data) => {
    if(err){
      console.error(err)
      res.end()
      return
    }
    res.json(data)
  })
})

  // POST /api
app.post('/api', (req, res) => {
  // create new database entries
  console.log('got a request')
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  res.json(data)
})

// Create a different endpoint for the weather and aq apis
app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  // Get API keys from env
  const apiKey = process.env.API_KEY
  const apiKey2 = process.env.API_KEY2
  //Once we have latitude and longitude set, we can get weather information with API
  const aqUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey2}`
  const weatherUrl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherJson = await weatherResponse.json()
  const aqResponse = await fetch(aqUrl)
  const aqJson = await aqResponse.json()

  const data = {
    weather: weatherJson,
    air_quality: aqJson
  }
  res.json(data)
})