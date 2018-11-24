const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const { validateResponseValues } = require('../lib/testHelpers');

describe('GET', function() {
  this.timeout(10000);
  this.slow(10000);

  it('works with fieldnames with underscores', done => {
    validateResponseValues('get', {'field_one': 'value_one'}, done);
  });

  it('works with fieldnames with dots', done => {
    validateResponseValues('get', {'field.name': 'field.value'}, done);
  });

  it('works with fieldnames with dashes', done => {
    validateResponseValues('get', {'field-name': 'field-value'}, done);
  });

  it('works with fieldnames with numbers', done => {
    validateResponseValues('get', {'123': '123'}, done);
  });

  it('works with fieldnames with quotes', done => {
    validateResponseValues('get', {'1"3': '1"3'}, done);
  });

  it('works with fieldnames with ampersands', done => {
    validateResponseValues('get', {'1&3': '1&3'}, done);
  });

  it('works with fieldnames with questionmarks', done => {
    validateResponseValues('get', {'field?name': 'field?value'}, done);
  });

  it('works with fieldnames with special characters', done => {
    validateResponseValues('get', {'!@£$%^&*()': '!@£$%^&*()'}, done);
  });
});