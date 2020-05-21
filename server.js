const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const bodyParser = require('body-parser');
const cors = require('cors');
const bcrypt = require('bcrypt');
const knex = require('knex');
const db = knex({
  client: 'pg',
  connection: {
    host: '127.0.0.1',
    user: 'postgres',
    password: 'M@nchester13',
    database: 'jobdb',
  },
});
const register = require('./controllers/register');
const getList = require('./controllers/getList');
const signin = require('./controllers/signin');

const app = express();
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema: schema,
//     graphiql: true,
//   })
// );

app.use(bodyParser.json());
app.use(cors());

app.post('/register', (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});
app.post('/signin', (req, res) => {
  signin.handleSignIn(req, res, db, bcrypt);
});

app.post('/getList', (req, res) => {
  getList.handleGetList(req, res, db);
});

app.post('/addList', (req, res) => {
  db('list')
    .insert({
      name: req.body.listName,
      date_created: new Date(),
      id: req.body.id,
    })
    .returning('list_id')
    .then((list_id) => {
      res.json(list_id);
    })
    .catch((err) => console.log(err));
});

app.post('/getRecords', (req, res) => {
  db.from('list')
    .select('list_id')
    .where('name', '=', req.body.listToDisplay)
    .then((row) => {
      db.from('application')
        .select('*')
        .where('list_id', '=', row[0].list_id)
        .then((rows) => {
          res.json(rows);
        });
    })
    .catch((err) => console.log(err));
});

app.post('/addRecords', (req, res) => {
  const { row, listToDisplay } = req.body;
  db.from('list')
    .select('list_id')
    .where('name', '=', listToDisplay)
    .then((list_obj) => {
      db('application')
        .insert({
          companyname: row.companyname,
          dateapplied: new Date(),
          location: row.location,
          jobdescription: row.jobdescription,
          joburl: row.joburl,
          specificrequirements: row.specificrequirements,
          comments: row.comments,
          accepted: row.accepted,
          pending: row.pending,
          rejected: row.rejected,
          list_id: list_obj[0].list_id,
        })
        .returning('app_id')
        .then((app_id) => {
          res.json(app_id[0]);
        });
    })
    .catch((err) => console.log(err));
});

app.put('/updateRecords', (req, res) => {
  const { row, index, listToDisplay } = req.body;
  db.from('list')
    .select('list_id')
    .where('name', '=', listToDisplay)
    .then((list_obj) => {
      db('application')
        .update({
          companyname: row.companyname,
          dateapplied: new Date(),
          location: row.location,
          jobdescription: row.jobdescription,
          joburl: row.joburl,
          specificrequirements: row.specificrequirements,
          comments: row.comments,
          accepted: row.accepted,
          pending: row.pending,
          rejected: row.rejected,
          list_id: list_obj[0].list_id,
        })
        .where('app_id', '=', index)
        .then((rows) => {
          console.log('This is the one', rows);
          res.json(rows);
        });
    })
    .catch((err) => console.log(err));
});

app.post('/deleteRecords', (req, res) => {
  const { index, listToDisplay } = req.body;
  db.from('list')
    .select('list_id')
    .where('name', '=', listToDisplay)
    .then((list_obj) => {
      db('application')
        .del()
        .where('app_id', '=', index)
        .then(() => {
          console.log('deleted');
          res.json('deleted');
        });
    })
    .catch((err) => console.log(err));
});

app.put('/updateCredentials', (req, res) => {
  const { id, name, password, new_password } = req.body;
  const saltRounds = 10;
  const salt = bcrypt.genSaltSync(saltRounds);
  const hash = bcrypt.hashSync(new_password, salt);
  db('auth')
    .select('hash')
    .where('id', '=', id)
    .then((data) => {
      const isValid = bcrypt.compareSync(password, data[0].hash);
      if (isValid) {
        console.log('1st', id);
        db('auth')
          .update({
            hash: hash,
          })
          .where('id', '=', id)
          .returning('id')
          .then((id) => {
            console.log('2nd', id);
            db('users')
              .update({
                name: name,
              })
              .where('id', '=', id[0])
              .returning('*')
              .then((user) => res.json(user));
          })
          .catch((err) => res.status(400).json('unable to get user'));
      } else {
        res.status(400).json('wrong credentials');
      }
    })
    .catch((err) => console.log(err));
});

app.post('/getGraphs', (req, res) => {
  const graphData = [];
  const { id } = req.body;
  db.raw(
    `with table1 as (select users.id, users.name, accepted, pending, rejected from users, list, application where users.id = list.id and list.list_id = application.list_id order by users.id)
  SELECT count(*) as total,sum(accepted::int) as accepted, sum(rejected::int) as rejected, sum(pending::int) as pending from table1 where id = ${id};
  `
  )
    .then((data) => {
      graphData.push(data.rows[0]);
      console.log(graphData);
    })
    .then(() => {
      return db.raw(` with table1 as (select *, application.app_id as appid, users.id as uni_id from users, list, application where users.id = list.id and list.list_id = application.list_id order by users.id)
    SELECT uni_id as id, COUNT(appid) as count, date_trunc('day', dateapplied) as day
    FROM table1
    WHERE dateapplied>='2020-05-13' and uni_id = 3
    GROUP BY uni_id, day;`);
    })
    .then((data) => {
      console.log(data.rows);
      graphData.push(data.rows);
      res.json(graphData);
    })
    .catch((err) => console.log(err));
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`listening on port ${PORT}`);
});
