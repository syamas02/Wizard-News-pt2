const express = require('express');
const morgan = require('morgan');
//const postBank = require("./postBank");
const postList = require('./views/postList');
const postDetails = require('./views/postDetails');
const db = require('./db');
const { client } = db;
const app = express();

module.exports = app;
// app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

const sql = 'SELECT * FROM posts';
app.get('/', async (req, res, next) => {
  try {
    const data = await client.query(sql);
    res.send(postList(data.rows));
  } catch (ex) {
    next(ex);
  }
});

app.get('/posts/:id', async (req, res, next) => {
  try {
    const post = await client.query('SELECT * FROM posts WHERE id = $1', [
      req.params.id,
    ]);
    if (!post.rows.length) {
      throw new Error('User with that id does not exist');
    }
    res.send(postDetails(post.rows[0]));
  } catch (ex) {
    next(ex);
  }
});

const PORT = process.env.PORT || 1337;

app.listen(PORT, () => {
  console.log(`Apps listening in port ${PORT}`);
});
