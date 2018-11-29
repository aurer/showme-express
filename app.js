const express = require('express');
const multer = require('multer');
const path = require('path');
const Requestor = require('./lib/requestor');
const fs = require('fs');

const app = express();
const upload = multer();

app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded());

app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'public')));

function getScript(name) {
	const filePath = path.join(__dirname, 'public', 'bookmarklets', name);
	return new Promise((resolve, reject) =>{
		fs.exists(filePath, (result) => {
			fs.readFile(filePath, {encoding: 'utf-8'}, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data.toString());
			})
		})
	})
}

app.all('/', async (req, res, next) => {
	try {
		let requestor = new Requestor().fromRequest(req);
		if (requestor.params.length) {
			res.render('index', {requestor});
		} else {
			let showmeGetScript = await getScript('ShowMeGet.js')
			let showmeFormsScript = await getScript('ShowMeForms.js')
			res.render('index', {requestor, showmeGetScript, showmeFormsScript});
		}
	} catch(err) {
		next(err);
	}
});

app.post('/save', (req, res, next) => {
	try {
		let hash = req.body.hash;
		let serialised = req.body.serialised;
		let resultingHash = Requestor.saveRequest('./cached', hash, serialised);
		if (resultingHash) {
			return res.redirect('/saved/' + resultingHash)
		}
		res.redirect('/');
	} catch(err) {
		next(err);
	}
});

app.get('/saved/:hash', (req, res, next) => {
	try {
		if (fs.existsSync('./cached/' + req.params.hash)) {
			let file = fs.readFileSync('./cached/' + req.params.hash);
			let serialised = JSON.parse(file);
			let requestor = new Requestor().fromSerialised(req, serialised);
			res.render('index', {requestor});
		} else {
			res.render('error', {title:'Request expired', message: 'The saved request you are after has expired.'});
		}
	} catch(err) {
		next(err);
	}
});

app.get('/test', (req, res) => {
  res.render('test');
});

// 404 error handler
app.use((req, res) => {
	res.render('error', {title: '404', message: 'Page not found'})
});

// Proper error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
	res.status(500)
	res.render('error', {title: '500', message: err})
})

module.exports = app;
