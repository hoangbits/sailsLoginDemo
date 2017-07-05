var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  bcrypt = require('bcrypt');
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findOne({id: id}, (err, user) => {
    done(err, user);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    (username, password, done) => {
      User.findOne({username: username}, (err, user) => {
        if (err) {
          return done(err);
        }
        if (!user) {
          return done(null, false, {message: 'Incorrect username'});
        }
        bcrypt.compare(password, user.password, (err, res) => {
          if (!res) {
            return done(null, false, {message: 'Invalid password'})
          }
          return done(null, user, {message: 'Logged In Successfully'});
        })
      })
    }
  ));
