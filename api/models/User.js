/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
var bcrypt = require('bcrypt');
var hashPassword = password => {
  return new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        reject(err);
      } else {
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) {
            reject(err);
          } else {
            resolve(hash);
          }
        });
      }
    });
  });
};

module.exports = {
  attributes: {
    username: { type: 'string', required: true, unique: true },

    email: { type: 'string', required: true, unique: true },

    password: { type: 'string' },
    toJSON: function() {
      var user = this.toObject();
      delete user.password;
      delete user.createdAt;
      delete user.updatedAt;
      return user;
    },
  },

  beforeCreate: (values, callback) => {
    hashPassword(values.password)
      .then(hash => {
        values.password = hash;
        callback(null, values);
      })
      .catch(err => {
        callback(err);
      });
  },

  beforeUpdate: (values, callback) => {
    hashPassword(values.password)
      .then(hash => {
        values.password = hash;
        callback(null, values);
      })
      .catch(err => {
        callback(err);
      });
  },
};
