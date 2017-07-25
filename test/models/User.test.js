var chai = require('chai');
var assert = chai.assert;
var expect = chai.expect;
var should = chai.should();

describe('models/User', () => {
  describe('#User.find', () => {
    it('should found 2 users that had seeded', done => {
      User.find()
        .then(users => {
          let actualValue = 2;
          let expectValue = users.length;
          expect(actualValue).to.equal(expectValue);
          done();
        })
        .catch(done);
    });
  });

  describe('#User.tojson', () => {
    let user;
    before(done => {
      User.find()
        .then(users => {
          user = users.pop().toJSON();
          done();
        })
        .catch(done);
    });

    it('should remove password from user when convert to JSON', () => {
      expect(user).to.not.have.property('password');
      expect(user).to.not.have.property('createdAt');
      expect(user).to.not.have.property('updatedAt');
    });

    after(done => {
      done();
    });
  });

  describe('#User.beforeCreate ', () => {
    let account = {
      username: 'testuser',
      email: 'testemail@mail.com',
      password: 'testpassword',
    };
    let user = {};
    beforeEach(done => {
      User.create(account)
        .then(record => {
          user = record;
          done();
        })
        .catch(done);
    });

    it('should encrypt password before User object', done => {
      let passW = { password: 'password' };
      User.beforeCreate(passW, (err, values) => {
        expect(values.password).to.not.equal(account.password);
        if (err) return done(err);
        done();
      });
    });
    it('should save encrypted data into database', () => {
      assert.notEqual(user.password, account.password);
    });
    afterEach(done => {
      User.destroy({ username: user.username })
        .then(res => {
          done();
        })
        .catch(done);
    });
  });
  describe('#User.beforeUpdate ', () => {
    let account = {
      username: 'testuser',
      email: 'testemail@mail.com',
      password: 'testpassword',
    };
    let user = {};
    beforeEach(done => {
      User.create(account)
        .then(record => {
          user = record;
          done();
        })
        .catch(done);
    });

    it('should encrypt password before User object', done => {
      let passW = { password: 'password' };
      User.beforeUpdate(passW, (err, values) => {
        expect(values.password).to.not.equal(account.password);
        if (err) return done(err);
        done();
      });
    });
    it('should save encrypted data into database', () => {
      assert.notEqual(user.password, account.password);
    });
    afterEach(done => {
      User.destroy({ username: user.username })
        .then(res => {
          done();
        })
        .catch(done);
    });
  });
});
