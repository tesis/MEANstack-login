// angualar tests
// node_modules/karma/bin/karma start

'use strict';

// run first test to check karma
describe('Simple test', function(){
  it("a is in fact 'hello world'", function(){
    var a = "Hello world";
    expect(a).toBe('Hello world');

  });
});
