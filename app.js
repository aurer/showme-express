const express = require('express');
const multer = require('multer');
const path = require('path');
const requests = require('./lib/requests');
const fs = require('fs');

const app = express();
const upload = multer();

app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', (req, res) => {
	let request = new requests(req);
	res.render('index', {request});
});

app.post('/save', (req, res) => {
	let hash = req.body.hash;
	let data = req.body.serialised;
	requests.saveRequest('./cached', hash, data);
	res.redirect('/saved/' + hash);
});

app.get('/saved/:hash', (req, res, next) => {
	let file = fs.readFileSync('./cached/' + req.params.hash);
	let request = JSON.parse(file);
	res.render('index', {request});
});

app.get('/test', (req, res) => {
  res.render('test');
});

module.exports = app;
