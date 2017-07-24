var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('#User.find', () => {
  it('should found 2 users that had seeded', done => {
    User.find().then(users => {
      let actual = 2;
      let expect = users.length;
      assert(actual, expect, 'OKOK');
    });
  });
});
