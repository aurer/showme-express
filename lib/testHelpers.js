const app = require('../app');
const chai = require('chai');
const expect = chai.expect;
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
chai.use(require('chai-http'));

const Module = {
	document: function(html) {
	  return new JSDOM(html).window.document;
	},

	element: function(html, selector) {
	  const element = Module.document(html).querySelector(selector);
	  if (!element) {
	    throw new Error(`Could not find the specified element "${selector}" in content:\n${html}`);
	  }
	  return element;
	},

	elementText: function(html, selector) {
	  return Module.element(html, selector).textContent;
	},

	request: function() {
		return chai.request(app);
	},

	getResponse: function(method, query, done) {
	  switch(method) {
	    case 'get':
	      return this.request().get('/').query(query);
	    case 'post':
	      return this.request().post('/').send(query);
	  }
	},

	validateResponseValues: function(method, query, cb) {
	  Module.getResponse(method, query).end((err, res) => {
	    expect(res).to.have.status(200);
	    expect(res).to.be.html;
	    for (let key in query) {
				expect(Module.elementText(res.text, "th.name")).to.equal(key + method);
	      expect(Module.elementText(res.text, "td.value")).to.equal(query[key]);
	    }
	    cb(err);
	  });
	}
}

module.exports = Module;
