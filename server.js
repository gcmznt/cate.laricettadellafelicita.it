const express = require('express')
const fs = require('fs')
const app = express()
const exec = require('child_process').exec
const configuration = require('./configuration')

let endpoints = require('./endpoints.json')
let nata = false
let data
let kg
let cm

nata = true
data = '29/03/2017'
kg = 3.8
cm = 53

app.use(express.static('assets'))
app.set('view engine', 'pug')

app.get('/', homepage)
app.get('/new/:ep/', newEndpoint)
app.get('/nata/', nascita)
app.get('/nata/:data/', nascita)
app.get('/kg/:kg/', peso)
app.get('/cm/:cm/', lunghezza)
app.get('/send/', inviaNotifiche)

app.listen(4004, '127.0.0.1', function () {
  console.log('Listening on 🚪  4004!')
})

function homepage (req, res) {
  const answers = nata ? [
    'Yes! 🎀',
    'È nata! 🌈'
  ] : [
    'Non ancora... ⌛️',
    'Manca poco 🦄',
    "Ripassa tra un po' 👶🏻"
  ]

  res.render('index', {
    nata: nata,
    text: answers[Math.floor(Math.random() * answers.length)],
    kg,
    cm,
    data,
    titolo: nata ? data : 'È nata Caterina?'
  })
}

function newEndpoint (req, res) {
  endpoints.push(decodeURIComponent(req.params.ep))
  fs.writeFile('ep.json', JSON.stringify(endpoints))
  res.end()
}

function nascita (req, res) {
  nata = true
  if (!data || req.params.data) {
    let now = new Date()
    data = (req.params.data)
      ? `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
      : req.params.data
  }
  res.redirect('/')
}

function peso (req, res) {
  kg = req.params.kg
  res.redirect('/nata/')
}

function lunghezza (req, res) {
  cm = req.params.cm
  res.redirect('/nata/')
}

function inviaNotifiche (req, res) {
  sendNotificationsToFF(endpoints.filter(epIsFF))
  sendNotificationsToGC(endpoints.filter(epIsGC))
  res.end()
}

const epIsFF = ep => ep.startsWith('https://updates.push.services.mozilla.com')
const epIsGC = ep => ep.startsWith('https://android.googleapis.com/gcm/send')

function sendNotificationsToFF (endpoints) {
  endpoints.forEach(ep => exec(`curl -v -X POST ${ep} -H "TTL: 60"`))
}

function sendNotificationsToGC (endpoints) {
  exec(`curl -v https://gcm-http.googleapis.com/gcm/send -H Content-Type:"application/json" -H Authorization:"key= ${configuration.googleapiKey}" -d '${JSON.stringify({registration_ids: endpoints.map(ep => ep.substr(40))})}'`)
}
