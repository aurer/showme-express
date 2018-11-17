const chai = require('chai');
const app = require('../app');
const expect = chai.expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

chai.use(require('chai-http'));

let server;

function document(html) {
  return new JSDOM(html).window.document;
}

function find(html, selector) {
  return document(html).querySelector(selector);
}

function elementText(html, selector, text) {
  return document(html).querySelector(selector).textContent;
}

describe('Array', function() {
  this.timeout(10000);
  this.slow(10000);

	it('responds to get', done => {
    chai.request(app)
      .get('/')
      .end((err, res) => {
        expect(elementText(res.text, "h1")).to.equal('Showme');
        expect(res).to.have.status(200);
        expect(res).to.be.html;
        done(err);
      })
  })

  it('responds to get with params', done => {
    chai.request(app)
        .get('/')
        .send({field: 'value'})
        .end((err, res) => {
          expect(elementText(res.text, "th.name")).to.equal('fieldpost');
          expect(elementText(res.text, "th.value")).to.equal('value');
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done(err);
        })
  })

  it('responds to post', done => {
    chai.request(app)
        .post('/')
        .send({'field.one': "1", 'field.2': "2"})
        .end((err, res) => {
          console.log(res.text);
          expect(elementText(res.text, "th.name")).to.equal('field.onepost');
          expect(elementText(res.text, "th.value")).to.equal('1');
          expect(res).to.have.status(200);
          expect(res).to.be.html;
          done(err);
        })
  })

  // it('get', () => {
  //   return new Promise(async (resolve, reject) => {
  //     const puppet = require('puppeteer');
  //     try {
  //       const browser = await puppet.launch();
  //       const page = await browser.newPage();
  //       await page.goto('http://localhost:2345/test');
  //       await page.waitForSelector('form [type=submit]');
  //       await page.click('form [type=submit]');
  //       await browser.close();
  //       resolve();
  //     } catch (err) {
  //       reject(err)
  //     }
  //   })
  // })
});
