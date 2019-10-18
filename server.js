const express = require('express')
const Datastore = require('nedb')
const fetch = require('node-fetch')
const app = express()
require('dotenv').config()
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`app is listening at port:${port}`)
})

app.use(express.static('public'))
app.use(express.json({
  limit: '1mb'
}))

const database = new Datastore('database/database.db')
database.loadDatabase()

app.get('/api', (req, res) => {
  database.find({}, (err, data) => {
    if(err){
      console.error(err)
      res.end()
      return
    }
    res.json(data)
  })
  
})

app.post('/api', (req, res) => {
  console.log('got a request')
  const data = req.body
  const timestamp = Date.now()
  data.timestamp = timestamp
  database.insert(data)
  res.json(data)
 
})

app.get('/weather/:latlon', async (req, res) => {
  const latlon = req.params.latlon.split(',')
  const lat = latlon[0]
  const lon = latlon[1]
  const apiKey = process.env.API_KEY
  const apiKey2 = process.env.API_KEY2
  //Once we have latitude and longitude set, we can get weather information with API
  const aqUrl = `https://api.waqi.info/feed/geo:${lat};${lon}/?token=${apiKey2}`
  const weatherUrl = `https://api.darksky.net/forecast/${apiKey}/${lat},${lon}`
  const weatherResponse = await fetch(weatherUrl)
  const weatherJson = await weatherResponse.json()

  //const aqUrl = `https://api.openaq.org/v1/latest?coordinates=${lat},${lon}&radius=10000`
  const aqResponse = await fetch(aqUrl)
  const aqJson = await aqResponse.json()

  const data = {
    weather: weatherJson,
    air_quality: aqJson
  }
  res.json(data)
})