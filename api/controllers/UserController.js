/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var passport = require('passport');

module.exports = {
  /**
   * `UserController.index()`
   */
  index: (req, res) => {
    return res.view('user/index', {
      layout: 'template'
    });
  },

  /**
   * `UserController.login()`
   */
  login: (req, res) => {
    passport.authenticate('local', (err, user, info) => { //failure redirect
      if (err) {
        return res.negotiate(err);
      }
      if (!user) {
        return res.view('user/login', {
          error_msg: info.message,
          layout: 'template'
        });
      }
      req.login(user, (err) => {
        if (err) return res.negotiate(err);
        //remembering user in session
        req.session.me = user.id;
        return res.redirect('/');
      });
    })(req, res);
  },

  /**
   * `UserController.logout()`
   */
  logout: (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    //forget user
    req.session.me = null;
    res.redirect('/');
  },

  /**
   * 'UserController.signup'
   */
  processSignup: (req, res) => {

    let newUser = {
      username: req.param('username'),
      email: req.param('email'),
      password: req.param('password'),
    };

    req.checkBody('username', 'UserName is required').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not Valid').isEmail();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Password does not match').equals(req.body.password);
    let errors = req.validationErrors();
    if (errors) {//try to remove 'return' in 'return res.view'
      return res.view('user/signup', {
        errors: errors,
        layout: 'template',
      })
    } else {
      User.create(newUser)
        .exec((err, records) => {
          if (err) {
            // return res.negotiate(err);
            return res.view('user/signup', {
              errors: err.details,
              layout: 'template'
            });
          }
        })
      req.flash('success_msg', 'You are registered and can now login');
      res.redirect('/login');
    }
  },
};
