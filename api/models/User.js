/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {
  attributes: {
    username: { type: 'string', required: true, unique: true },

    email: { type: 'string', required: true, unique: true },

    password: { type: 'string' },
  },
};

var bcrypt = require('bcrypt');
hashPassword: password => {
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

beforeCreate: (values, next) => {
  hashPassword(values.password)
    .then(hash => {
      //next time remove hash
      values.password = hash;
      next(null,values);
    })
    .catch(err => {
      next(err);
    });
};

beforeUpdate: (values, next) => {
  if(values.password) {
    hashPassword(values.password).then(hash => {
      values.password = hash;
      next(null, values);
    });
  }else {
    next();
  }
}
