const { expect, assert } = require('chai');
const dateString = require('../lib/dateString');

describe('DateString', () => {
	it('can create a date', () => {
		expect(dateString.get().length).to.equal(8);
	});

	it('can parse a date string', () => {
		expect(dateString.parse('20200612')).to.deep.equal(new Date(2020, 5, 12));
	});
});
