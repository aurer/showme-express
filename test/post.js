const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const { getResponse, validateResponseValues } = require('../lib/testHelpers');

describe('POST', function() {
  this.timeout(10000);
  this.slow(10000);

  it('works with fieldnames with underscores', done => {
    validateResponseValues('post', {'field_one': 'value_one'}, done);
  });

  it('works with fieldnames with dots', done => {
    validateResponseValues('post', {'field.name': 'field.value'}, done);
  });

  it('works with fieldnames with dashes', done => {
    validateResponseValues('post', {'field-name': 'field-value'}, done);
  });

  it('works with fieldnames with numbers', done => {
    validateResponseValues('post', {'123': '123'}, done);
  });

  it('works with fieldnames with quotes', done => {
    validateResponseValues('post', {'1"3': '1"3'}, done);
  });

  it('works with fieldnames with ampersands', done => {
    validateResponseValues('post', {'1&3': '1&3'}, done);
  });

  it('works with fieldnames with questionmarks', done => {
    validateResponseValues('post', {'field?name': 'field?value'}, done);
  });

  it('works with fieldnames with special characters', done => {
    validateResponseValues('post', {'!@£$%^&*()': '!@£$%^&*()'}, done);
  });
});
