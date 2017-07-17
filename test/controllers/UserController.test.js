var request = require("supertest");
// var chai = require('chai');
// var chaiHttp = require('chai-http');
// chai.use(chaiHttp);
// var assert = chai.assert;    // Using Assert style
// var expect = chai.expect;    // Using Expect style
// var should = chai.should();  // Using Should style

describe("UserController", () => {
  let authRequest;
  let account = {
    username: "hoang",
    email: "hoang@mail.com",
    password: "hoang"
  };

  let accountSignup = {
    username: "giang",
    email: "giang@mail.com",
    password: "giang",
    password2: "giang"
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
          .post("/login")
          .send({
            username: account.username,
            password: account.password
          })
          .end((err, res) => {
            if (err) return done(err);
            done();
          });
      })
      .catch(err => {
        done(err);
      });
  });

  describe("#index()", () => {
    it("should allow access to index when user logged in", done => {
      authRequest.get("/index").expect(200).end((err, res) => {
        if (err) return done(err);
        done();
      });
    });

    it("should redirect to /login bcz user not yet logged in", done => {
      request(sails.hooks.http.app)
        .get("/index")
        .expect(302)
        .expect("location", "/login")
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe(" #login()", () => {
    it("should redirect to /login (found)", done => {
      request(sails.hooks.http.app)
        .get("/login")
        .expect(200)
        .expect("location", "/login", done());
    });

    it("should display 'Incorrect username' if username doesn't exist", done => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ username: "totallyWrong", password: "hmmmm" })
        .expect(200)
        .expect(/Incorrect username/)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should display 'Invalid password' if user type wrong password", done => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ username: account.username, password: "wrong" })
        .expect(200)
        .expect(/Invalid password/)
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });

    it("should redirect to / if user logged in success", done => {
      request(sails.hooks.http.app)
        .post("/login")
        .send({ username: account.username, password: account.password })
        .expect(302)
        .expect("location", "/")
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("#logout()", () => {
    it("should redirect to / if user logged out success", done => {
      authRequest
        .post("/logout")
        .expect(302)
        .expect("location", "/")
        .end((err, res) => {
          if (err) return done(err);
          done();
        });
    });
  });

  describe("#processSignUp", () => {
    it("should warning 'UserName is required' username if guest isn't input username", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: "",
          email: accountSignup.email,
          password: accountSignup.password,
          password2: accountSignup.password2
        })
        .expect(200)
        .expect(/UserName is required/)
        .end((err, res) => {
          if (err) done(err);
          done(err);
        });
    });

    it("should warning 'Email is required' if guest isn't input email", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: accountSignup.username,
          email: "",
          password: accountSignup.password,
          password2: accountSignup.password2
        })
        .expect(200)
        .expect(/Email is required/)
        .end((err, res) => {
          if (err) done(err);
          done(err);
        });
    });

    it("should notify 'email is not valid' if guest isn't input email", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: accountSignup.username,
          email: "email_without_at_sign",
          password: accountSignup.password,
          password2: accountSignup.password2
        })
        .expect(200)
        .expect(/Email is not Valid/)
        .end((err, res) => {
          if (err) done(err);
          done(err);
        });
    });
    it("should notify 'Password is required' if guest isn't input password", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: accountSignup.username,
          email: accountSignup.email,
          password: "",
          password2: accountSignup.password2
        })
        .expect(200)
        .expect(/Password is required/)
        .end((err, res) => {
          if (err) done(err);
          done(err);
        });
    });
    it("should notify 'Password does not match' if guest make typo mistake", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: accountSignup.username,
          email: accountSignup.email,
          password: accountSignup.password,
          password2: ""
        })
        .expect(200)
        .expect(/Password does not match/)
        .end((err, res) => {
          if (err) done(err);
          done(err);
        });
    });
    it("should redirect to login page", done => {
      request(sails.hooks.http.app)
        .post("/signup")
        .send({
          username: accountSignup.username,
          email: accountSignup.email,
          password: accountSignup.password,
          password2: accountSignup.password2
        })
        .expect(302)
        .expect("location", "/login")
        .end((err, res) => {
          if (err) return done(err);
          done(err);
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
