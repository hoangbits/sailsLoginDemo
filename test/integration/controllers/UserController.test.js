var request = require('supertest');
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// var assert = chai.assert;    // Using Assert style
// var expect = chai.expect;    // Using Expect style
// var should = chai.should();  // Using Should style

describe('UserController', () => {
  var authRequest;
  var account = {
    username: 'hoang',
    email: 'hoang@mail.com',
    password: 'hoang',
  };

  before(done => {
    authRequest = request.agent(sails.hooks.http.app);

    /*
     1./create account
     +/assign account to right account
     +/logged with rightaccount
     */
    User.create(account)
      .then(record => {
        authRequest
          .post('/login')
          .send({
            username: account.username,
            password: account.password,
          })
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      })
      .catch(err => {
        throw new Error(err);
      });
  });

  describe('#index', () => {
    it('should allow access to index when user logged in', done => {
      authRequest.get('/index').expect(200).end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it('should redirect to /login bcz user not yet logged in', done => {
      request(sails.hooks.http.app)
        .get('/index')
        .expect(302)
        .expect('location', '/login')
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe('GET #login()', () => {
    it('should redirect to /login (found)', done => {
      request(sails.hooks.http.app)
        .get('/login')
        .expect(200)
        .expect('location', '/login', done());
    });
  });

  describe('POST #login()', () => {
    it("should display 'Incorrect username' if username doesn't exist", done => {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ username: 'totallyWrong', password: 'hmmmm' })
        .expect(200)
        .expect(/Incorrect username/)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should display 'Invalid password' if user type wrong password", done => {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ username: account.username, password: 'wrong' })
        .expect(200)
        .expect(/Invalid password/)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should redirect to '/' if user logged successfully!", done => {
      request(sails.hooks.http.app)
        .post('/login')
        .send({ username: account.username, password: account.password })
        .expect(302)
        .expect('location', '/')
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  after(done => {
    User.destroy({ username: account.username })
      .then(res => {
        done();
      })
      .catch(err => {
        done(err);
      });
  });
});
