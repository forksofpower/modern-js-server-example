const bcrypt = require('bcryptjs');

exports.seed = function(knex, Promise) {
  const salt = bcrypt.genSaltSync();
  const hash = bcrypt.hashSync('something', salt);
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return Promise.join(
        knex('users').insert({
          username: 'patrick',
          password: hash,
        })
      );
    })
    .then(() => {
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync('87239487234', salt);
      return Promise.join(
        knex('users').insert({
          username: 'admin',
          password: hash,
          admin: true
        })
      )
    });
};
