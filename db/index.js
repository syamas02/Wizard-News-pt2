const pg = require('pg');
const { Client } = pg;
const postgresUrl = 'postgres://localhost/wnews';
//const client = pg.Client(postgresUrl);

const client = new Client(postgresUrl);
client.connect();

module.exports = { client };

// const { Client } = require('pg')
// const client = new Client()

// await client.connect()

// const res = await client.query('SELECT $1::text as message', ['Hello world!'])
// console.log(res.rows[0].message) // Hello world!
// await client.end()
