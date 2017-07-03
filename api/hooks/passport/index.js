var Passport = require('passport').constructor;

/*
 Passport hook
 */
module.exports = function(sails) {
  return {
    default: {
      passport: {
        userModelIdentity: 'user',
      },
    },

    initialize: callback => {
      var err;
      // Validate 'UserModelIdentity' config
      if (typeof sails.config.password.userModelIdentity !== 'string') {
        sails.config.passport.userModelIdentity = 'user';
      }
      sails.config.passport.userModelIdentity = sails.config.passport.userModelIdentity.toLowerCase();
      //wait for orm hook
      if (!sails.hooks.orm) {
        err = new Error();
        err.code = 'ERROR_HOOK_INITIALIZE';
        err.name = 'Passport hook Error';
        err.message = 'The passport hook depends on orm hook';
        return callback(err);
      }
      sails.after('hook:orm:loaded', function() {
        //look up configured user model
        var UserModel = sails.models[sails.config.passport.userModelIdentity];

        if (!UserModel) {
          err = new Error();
          err.code = 'ERROR_HOOK_INITIALIZE';
          err.name = 'Passport hook Error';
          err.message =
            'Could not load passport hook bcz `sails.config.passport.userModelIdentity` ' +
            'refers to an unknown model: ' +
            sails.config.passport.userModelIdentity;
          if (sails.config.passport.userModelIdentity === 'user') {
            err.message += '\n default to `user`,you need to set or correct it';
          }
          return callback(err);
        }
        //create passport instance
        sails.passport = new Passport();
        //serialize user object ot id
        sails.passport.serializeUser((user, done) => {
          console.log(
            'Using primary key',
            UserModel.primaryKey,
            'with record:',
            user,
          );
          done(null, user[UserModel.primaryKey]);
        });
        //deserialize an id back into a user object
        sails.passport.deserializeUser((id, done) => {
          UserModel.findone(id, (err, user) => {
            done(err, user);
          });
        });
        callback();
      });
    },
    routes: {
      before: {
        '/*': function configurePassport(req, res, next) {
          req = _extendReq(req);
          sails.passport.initialize()(req, res, err => {
            if (err) return res.negotiate(err);
            sails.passport.session()(req, res, err => {
              if (err) return res.negotiate(err);
              next();
            });
          });
        },
      },
    },
  };
};


/**
 * Normally these methods are added to the global HTTP IncomingMessage
 * prototype, which breaks encapsulation of Passport core.
 * This function is a patch to override this and also attach them to the local req/res.
 * This allows these methods to work for incoming socket requests.
 * @param  {[type]} req [description]
 * @return {[type]}     [description]
 */
function _extendReq(req) {

  /**
   * Intiate a login session for `user`.
   *
   * Options:
   *   - `session`  Save login state in session, defaults to _true_
   *
   * Examples:
   *
   *     req.logIn(user, { session: false });
   *
   *     req.logIn(user, function(err) {
   *       if (err) { throw err; }
   *       // session saved
   *     });
   *
   * @param {User} user
   * @param {Object} options
   * @param {Function} done
   * @api public
   */
  req.login =
    req.logIn = function(user, options, done) {
      if (typeof options == 'function') {
        done = options;
        options = {};
      }
      options = options || {};

      var property = 'user';
      if (req._passport && req._passport.instance) {
        property = req._passport.instance._userProperty || 'user';
      }
      var session = (options.session === undefined) ? true : options.session;

      req[property] = user;
      if (!session) return done&&done();
      if (!req._passport) { throw new Error('passport.initialize() middleware not in use'); }
      if (typeof done != 'function') { throw new Error('req#login requires a callback function'); }

      req._passport.instance.serializeUser(user, req, function(err, obj) {
        if (err) {
          req[property] = null;
          return done(err);
        }
        req._passport.session.user = obj;
        done();
      });
    };

  /**
   * Terminate an existing login session.
   *
   * @api public
   */
  req.logout =
    req.logOut = function() {
      var property = 'user';
      if (req._passport && req._passport.instance) {
        property = req._passport.instance._userProperty || 'user';
      }

      req[property] = null;
      if (req._passport && req._passport.session) {
        delete req._passport.session.user;
      }
    };

  /**
   * Test if request is authenticated.
   *
   * @return {Boolean}
   * @api public
   */
  req.isAuthenticated = function() {
    var property = 'user';
    if (req._passport && req._passport.instance) {
      property = req._passport.instance._userProperty || 'user';
    }

    return (req[property]) ? true : false;
  };

  /**
   * Test if request is unauthenticated.
   *
   * @return {Boolean}
   * @api public
   */
  req.isUnauthenticated = function() {
    return !req.isAuthenticated();
  };

  return req;
}
