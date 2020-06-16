const express = require('express');
const multer = require('multer');
const path = require('path');
const Requestor = require('./lib/requestor');
const fs = require('fs');
const FileSaver = require('./lib/fileSaver');

const app = express();
const upload = multer();
const fileSaver = FileSaver(path.join(__dirname, 'cached'));

app.use(upload.any());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

function getScript(name) {
	const filePath = path.join(__dirname, 'public', 'bookmarklets', name);
	return new Promise((resolve, reject) => {
		fs.exists(filePath, (result) => {
			fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
				if (err) {
					reject(err);
				}
				resolve(data.toString());
			});
		});
	});
}

app.all('/', async (req, res, next) => {
	let requestor = new Requestor().fromRequest(req);

	if (!requestor.params.length) {
		let showmeGetScript = await getScript('ShowMeGet.js');
		let showmeFormsScript = await getScript('ShowMeForms.js');
		return res.render('index', { showmeGetScript, showmeFormsScript });
	}

	return res.render('results', { requestor });
});

app.post('/save', async (req, res, next) => {
	try {
		const serialised = req.body.serialised;
		const key = await fileSaver.save(serialised);
		res.redirect('/saved/' + key);
	} catch (err) {
		console.error(err);
		res.redirect('/');
	}
});

app.get('/saved/:hash', async (req, res, next) => {
	try {
		const saved = await fileSaver.load(req.params.hash);
		if (saved) {
			let requestor = new Requestor().fromSerialised(req, JSON.parse(saved));
			return res.render('results', { requestor, isSaved: true });
		}
		res.render('error', { title: 'Request expired', message: 'The saved request you are after has expired.' });
	} catch (err) {
		next(err);
	}
});

app.get('/test', (req, res) => {
	res.render('test');
});

// 404 error handler
app.use((req, res) => {
	res.render('error', { title: '404', message: 'Page not found' });
});

// Proper error handler
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.render('error', { title: '500', message: err });
});

module.exports = app;
