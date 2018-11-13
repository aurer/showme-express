const express = require('express');
const multer = require('multer');
const path = require('path');
const requests = require('./lib/requests');
const fs = require('fs');

const app = express();
const upload = multer({dest: 'uploads', fileFilter: (req, file, cb) => cb(null, false)});

app.use(upload.any());
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

app.all('/', (req, res) => {
	let request = new requests(req);
	req.is('json') ? res.send({request}) : res.render('index', {request});
})

app.post('/save', (req, res) => {
	let hash = req.body.hash;
	let data = req.body.serialised;
	requests.saveRequest('./cached', hash, data)
	res.redirect('/' + hash);
})

app.get('/:hash', (req, res, next) => {
	let file = fs.readFileSync('./cached/' + req.params.hash);
	let request = JSON.parse(file);
	req.is('json') ? res.send({request}) : res.render('index', {request});
})

module.exports = app;
