const filesize = require('filesize');

class Requestor {
	constructor() {
		this.params = [];
		this.referer = null;
		this.formAction = null;
	}

	fromRequest(req) {
		this.req = req;
		this.addRequestParams('get', req.query);
		this.addRequestParams('post', req.body);
		this.addFileParams(req.files);
		this.referer = req.get('Referer');
		this.params.sort((a, b) => (a.name > b.name ? 1 : -1));
		return this;
	}

	fromSerialised(req, serialised) {
		this.req = req;
		this.params = serialised.params;
		this.referer = serialised.referer;
		this.formAction = serialised.formAction;
		return this;
	}

	addRequestParams(method, params) {
		for (let param in params) {
			if (param == 'formSubmitsTo') {
				this.formAction = params[param];
				continue;
			}

			this.params.push({
				method: method,
				name: param,
				value: params[param],
			});
		}
	}

	addFileParams(params) {
		for (let param in params) {
			this.params.push({
				method: 'post',
				name: params[param].fieldname,
				value: {
					filename: params[param].originalname,
					mimetype: params[param].mimetype,
					filesize: filesize(params[param].size),
				},
			});
		}
	}

	getSerialised() {
		const result = {
			params: this.params,
			referer: this.referer,
			formAction: this.formAction,
		};
		return JSON.stringify(result);
	}
}

module.exports = Requestor;
