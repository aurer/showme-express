const chai = require('chai');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');
const dateString = require('../lib/dateString');

const expect = chai.expect;
const FileSaver = require('../lib/fileSaver');
const savePath = path.join(__dirname, 'saved');

describe('Filesaver', () => {
	afterEach(clearSavedFiles);

	it('can set the save directory', (done) => {
		const fileSaver = FileSaver(savePath);
		expect(fileSaver.saveDirectory).to.equal(savePath);
		done();
	});

	it('can save values', async function () {
		const serialisedFormValues = "light=the+walls+on+fire&we'vegot=a+lot+to+say&we+don't+need=words";
		const date = dateString.get();
		const hash = `${date}-2369092e`;
		const fileSaver = FileSaver(savePath);

		const saved = await fileSaver.save(serialisedFormValues);
		expect(saved).to.equal(hash);

		const savedFileContent = fs.readFileSync(path.join(savePath, saved));
		expect(savedFileContent.toString()).to.equal(serialisedFormValues);
	});

	it('can return correct value for a key', async function () {
		const serialisedFormValues = "light=the+walls+on+fire&we'vegot=a+lot+to+say&we+don't+need=words";
		const date = dateString.get();
		const key = `${date}-2369092e`;
		const fileSaver = FileSaver(savePath);

		const saved = await fileSaver.save(serialisedFormValues, key);
		const loaded = await fileSaver.load(key);

		expect(loaded).to.equal(serialisedFormValues);
	});

	it('can returns null for an invalid key', async function () {
		const key = '000';
		const fileSaver = FileSaver(savePath);
		const loaded = await fileSaver.load(key);

		expect(loaded).to.equal(null);
	});
});

function clearSavedFiles() {
	if (fs.existsSync(savePath)) {
		rimraf.sync(savePath);
	}
}
