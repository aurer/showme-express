const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const util = require('util');
const dateString = require('./dateString');

const exists = util.promisify(fs.exists);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const makeDir = util.promisify(fs.mkdir);

module.exports = function FileSaver(saveDirectory) {
	let instance = {};

	instance.saveDirectory = saveDirectory;

	instance.save = function (serialisedFormValues) {
		const fileData = serialisedFormValues;
		const dir = instance.saveDirectory;
		const key = generateId(serialisedFormValues);
		const filePath = path.join(dir, key);

		try {
			if (!fs.existsSync(dir)) {
				fs.mkdirSync(dir);
			}
			fs.writeFileSync(filePath, fileData, 'utf-8');
			return key;
		} catch (error) {
			throw new Error(error);
		}
	};

	instance.load = async function (key) {
		const dir = instance.saveDirectory;
		const filePath = path.join(dir, key);
		const fileExists = await exists(filePath);

		if (fileExists) {
			let fileBuffer = await readFile(filePath);
			return fileBuffer.toString();
		}

		return null;
	};

	function generateId(serialisedFormValues) {
		let date = dateString.get();
		let hash = crypto.createHash('md5').update(serialisedFormValues).digest('hex').toLowerCase().substr(0, 8);
		return `${date}-${hash}`;
	}

	return instance;
};
