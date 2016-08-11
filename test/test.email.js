// test.email.js
// make test

'use strict';

var should = require("should");
var email = require('../server/util/email');



describe('email', function() {

  it('describe email', function(done) {
    console.log(email.config)
    var data = {};
    email.resetPaswordEmail(data);
    done();
  });

});