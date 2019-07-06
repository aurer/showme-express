const filesize = require('filesize');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const config = require('../config.json');

class Requestor {
	constructor() {
		this.params = [];
		this.referer = null;
		this.formAction = null;
	}

	fromRequest (req) {
		this.req = req;
		this.addRequestParams('get', req.query);
		this.addRequestParams('post', req.body);
		this.addFileParams(req.files);
		this.referer = req.get('Referer');
		this.params.sort((a,b) => a.name > b.name ? 1 : -1)
		return this;
	}

	fromSerialised (req, serialised) {
		this.req = req;
		this.params = serialised.params;
		this.referer = serialised.referer;
		this.formAction = serialised.formAction;
		return this;
	}

	addRequestParams (method, params) {
		for (let param in params) {
			if (param == 'formSubmitsTo') {
				this.formAction = params[param];
				continue;
			}

			this.params.push({
				method: method,
				name: param,
				value: params[param]
			})
		}
	}

	addFileParams (params) {
		for (let param in params) {
			this.params.push({
				method: 'post',
				name: params[param].fieldname,
				value: {
					filename: params[param].originalname,
					mimetype: params[param].mimetype,
					filesize: filesize(params[param].size)
				}
			})
		}
	}

	getSerialised() {
		const saved = {
			params: this.params,
			referer: this.referer,
			formAction: this.formAction
		}
		return JSON.stringify(saved);
	}

	getHash() {
		return crypto.createHash('md5').update(this.getSerialised() + config.salt).digest('hex');
	}

	isCache () {
		return this.req.path != '/';
	}

	static hashIsValid(hash, serialised) {
		return hash == crypto.createHash('md5').update(serialised + config.salt).digest('hex')
	}

	static saveRequest(dir, hash, serialised) {
		if (this.hashIsValid(hash, serialised)) {
			let filename = hash;
			let fileData = serialised;
			let filePath = path.join(dir, hash);
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			fs.writeFileSync(filePath, fileData, 'utf-8');
			return hash;
		} else {
			return false;
		}
	}
}

module.exports = Requestor;
