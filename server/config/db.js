// const { Pool } = require('pg');
// require('dotenv').config();

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,

// });

// pool.on('error', (err, client) => {
//   console.error('Unexpected error on idle client', err);
//   process.exit(-1);
// });

// module.exports = {
//   query: (text, params) => pool.query(text, params),
// };

require('dotenv').config();

const { Pool } = require('pg');

console.log("DB FILE LOADED");
console.log("DATABASE_URL:", process.env.DATABASE_URL);

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(client => {
    console.log("Connected to PostgreSQL");
    client.release();
  })
  .catch(err => {
    console.error("DB Connection Error:", err.message);
  });

pool.on('error', (err) => {
  console.error('Unexpected DB error', err);
  process.exit(-1);
});

// ✅ IMPORTANT FIX
module.exports = {
  query: (text, params) => pool.query(text, params),
};