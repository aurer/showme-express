const chai = require('chai');
const assert = require('assert');
const app = require('../app');

let server = null;
const port = 8765;

describe('Array', function() {
	before(function(){
		server = app.listen(port);
	})

	after(function(){
		server.close();
	})

  it('/', () => {

  })
})
