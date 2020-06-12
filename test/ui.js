const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const {
	request,
	elementText,
	elementExists,
	element,
	getResponse,
	validateResponseValues,
} = require('../lib/testHelpers');

describe('Integration', function () {
	this.timeout(10000);
	this.slow(10000);

	it('shows referer with GET', (done) => {
		request()
			.get('/')
			.field('field1', 'field1')
			.set('Referer', 'http://test.js')
			.end((err, res) => {
				expect(elementText(res.text, '.referer b')).to.equal('Referer:');
				expect(elementText(res.text, '.referer span')).to.equal('http://test.js');
				done(err);
			});
	});

	it('shows referer with POST', (done) => {
		request()
			.post('/')
			.field('field1', 'field1')
			.set('Referer', 'http://test.js')
			.end((err, res) => {
				expect(elementText(res.text, '.referer b')).to.equal('Referer:');
				expect(elementText(res.text, '.referer span')).to.equal('http://test.js');
				done(err);
			});
	});

	it('does not show when no referer is set', (done) => {
		request()
			.post('/')
			.field('field1', 'field1')
			.end((err, res) => {
				expect(elementExists(res.text, '.referer b')).to.be.false;
				done(err);
			});
	});

	it('exists', (done) => {
		request()
			.get('/')
			.field('field1', 'field1')
			.end((err, res) => {
				expect(elementText(res.text, 'footer button')).to.equal('Save');
				done(err);
			});
	});

	it('Share link has a value', (done) => {
		request()
			.get('/')
			.field('field1', 'field1')
			.end((err, res) => {
				expect(element(res.text, 'footer [name=serialised]').value).to.not.be.empty;
				done(err);
			});
	});

	it('shows form action', (done) => {
		request()
			.get('/')
			.field('field1', 'field1')
			.field('formSubmitsTo', 'formSubmitsTo')
			.end((err, res) => {
				expect(elementText(res.text, 'tfoot .action td:first-child')).to.equal('Form action');
				expect(elementText(res.text, 'tfoot .action td:last-child')).to.equal('formSubmitsTo');
				done(err);
			});
	});

	it('saves a form correctly', (done) => {
		request()
			.post('/save')
			.field(
				'serialised',
				'{"params":[{"method":"get","name":"field1","value":"value1"},{"method":"get","name":"field2","value":"value2"}],"formAction":null}'
			)
			.end((err, res) => {
				expect(elementText(res.text, 'tbody > tr:nth-child(1) > th')).to.equal('field1:');
				expect(elementText(res.text, 'tbody > tr:nth-child(1) > td')).to.equal('value1');
				expect(elementText(res.text, 'tbody > tr:nth-child(2) > th')).to.equal('field2:');
				expect(elementText(res.text, 'tbody > tr:nth-child(2) > td')).to.equal('value2');
				expect(elementText(res.text, '.notice')).to.equal('Saved request');
				done(err);
			});
	});
});
