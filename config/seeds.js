/**
 * Sails Seed Settings
 * (sails.config.seeds)
 *
 * Configuration for the data seeding in Sails.
 *
 * For more information on configuration, check out:
 * http://github.com/frostme/sails-seed
 */
module.exports.seeds = {
  user: {
    data: [
      {
        username: 'seedhoang',
        email: 'seedhoang@gmail.com',
        password: 'seedhoang',
      },
      {
        username: 'seedgiang',
        email: 'seedgiang@yahoo.com',
        password: 'seedgiang',
      },
    ],
    overwrite: true,
    unique: ['username'],
  },
};
