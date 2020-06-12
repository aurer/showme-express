const chai = require('chai');
const path = require('path');
const fs = require('fs');
const rimraf = require('rimraf');

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

	it('can save values', (done) => {
		const serialisedFormValues = "light=the+walls+on+fire&we'vegot=a+lot+to+say&we+don't+need=words";
		const hash = '2369092ee4cb289ab46c18156a9377f3';
		const fileSaver = FileSaver(savePath);

		const saved = fileSaver.save(serialisedFormValues);
		expect(saved).to.equal(hash);

		const savedFileContent = fs.readFileSync(path.join(savePath, saved));
		expect(savedFileContent.toString()).to.equal(serialisedFormValues);

		done();
	});

	it('can return correct value for a key', async function () {
		const serialisedFormValues = "light=the+walls+on+fire&we'vegot=a+lot+to+say&we+don't+need=words";
		const key = '2369092ee4cb289ab46c18156a9377f3';
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
