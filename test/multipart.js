const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const { request, getResponse, validateResponseValues, elementText} = require('../lib/testHelpers');

describe('Mutipart', function() {
  this.timeout(10000);
  this.slow(10000);

  it('reads multipart requests', done => {
    request().get('/').field('field1', 'field1').end((err, res) => {
      expect(elementText(res.text, "th.name")).to.equal('field1:');
      expect(elementText(res.text, "td.value")).to.equal('field1');
      done(err);
    });
  });
});
