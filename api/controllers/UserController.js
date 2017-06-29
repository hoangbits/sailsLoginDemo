/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


  /**
   * `UserController.index()`
   */
  index: (req, res) => {
    return res.json({
      todo: 'index() is not implemented yet!',
    });
  },


  /**
   * `UserController.login()`
   */
  login: (req, res) => {
    return res.json({todo: 'login() is not implemented yet!',});
  },


  /**
   * `UserController.logout()`
   */
  logout: (req, res) => {
    return res.json({
      todo: 'logout() is not implemented yet!',
    });
  },

  /**
   * 'UserController.signup'
   */
  processSignup: (req, res) => {
    return null;
  },
};

