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
        username: 'hoang',
        email: 'giahoangth@gmail.com',
        password: 'giahoang',
      },
      {
        username: 'giang',
        email: 'legiagiang@yahoo.com',
        password: 'giagiang',
      },
    ],
    overwrite: true,
    unique: ['username'],
  },
};
