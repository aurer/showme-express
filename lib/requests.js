const filesize = require('filesize');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

class Requests {
	constructor(req) {
		this.params = [];
		this.req = req;
		this.parseParams('get', req.query);
		this.parseParams('post', req.body);
		this.parseFileParams(req.files);
		return this;
	}

	getParams() {
		return this.params;
	}

	getReferer() {
		return this.req.get('Referer');
	}

	isCache() {
		return false;
	}

	getSerlialised() {
		return JSON.stringify(this.params);
	}

	getHash(serialised) {
		return crypto.createHash('md5').update(serialised + config.salt).digest('hex');
	}

	static verifyHash(hash, serialised) {
		return hash == crypto.createHash('md5').update(serialised + config.salt).digest('hex')
	}

	static saveRequest(dir, hash, data) {
		let filename = hash;
		let fileData = data;
		let filePath = path.join(dir, hash);
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir);
		}
		fs.writeFileSync(filePath, fileData, 'utf-8');
	}

	parseParams(type, params) {
		for (let param in params) {
			if (param == 'formSubmitsTo') {
				this.action = params[param];
				continue;
			}

			this.params.push({
				type: type,
				name: param,
				value: params[param]
			})
		}
	}

	parseFileParams(params) {
		for (let param in params) {
			this.params.push({
				type: 'file',
				name: params[param].fieldname,
				value: {
					filename: params[param].originalname,
					mimetype: params[param].mimetype,
					filesize: filesize(params[param].size)
				}
			})
		}
	}
}

module.exports = Requests
