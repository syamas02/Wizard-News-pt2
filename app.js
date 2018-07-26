const express = require('express');
const morgan = require('morgan');
//const postBank = require("./postBank");
const postList = require('./views/postList');
const postDetails = require('./views/postDetails');
const db = require('./db');
const { client } = db;
const app = express();

module.exports = app;
app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));

const sql =
  // 'SELECT posts.*, counting.upvotes FROM posts INNER JOIN (SELECT postId, COUNT(*) as upvotes FROM upvotes GROUP BY postId) AS counting ON posts.id = counting.postId';
  `SELECT posts.*, users.name, upvotes.total as upvotes
  FROM posts
  JOIN users
  ON users.id = posts.userid
  LEFT OUTER JOIN (
    SELECT postid, count(*) as total
    FROM upvotes
    GROUP BY postid
  ) upvotes
  ON upvotes.postid = posts.id
`;
app.get('/', async (req, res, next) => {
  try {
    const data = await client.query(sql);
    res.send(postList(data.rows));
    console.log('data');
  } catch (ex) {
    next(ex);
  }
});

app.get('/posts/:id', async (req, res, next) => {
  try {
    const sql2 = `SELECT posts.*, users.name, upvotes.total as upvotes
    FROM posts
    JOIN users
    ON users.id = posts.userid
    LEFT OUTER JOIN (
      SELECT postid, count(*) as total
      FROM upvotes
      GROUP BY postid
    ) upvotes
    ON upvotes.postid = posts.id
    WHERE posts.id = $1
  `;
    const post = await client.query(sql2, [req.params.id]);
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
