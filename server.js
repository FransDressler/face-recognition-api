const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const bodyParser = require('body-parser');
const cors = require('cors');
const knex = require('knex');
const register = require('./controller/Register');
const signin = require('./controller/SignIn');
const profile = require('./controller/Profile');
const image = require('./controller/Image');
const db = knex({
    client: 'pg',
    connection: {
      connectionString : "postgresql-perpendicular-58121",
      ssl:true
    }
  });
  
const app = express();

app.use(cors());

app.use(bodyParser.json());

app.get('/', (req, res) => {
    res.send("app running")
});

const port = process.env.PORT;
app.listen(port, () => {
    console.log("app is running on ", port)
})

app.post('/signin', (req,res) => {signin.handleSignIn(req,res,db,bcrypt)})
app.post('/register', (req, res) => {register.handleRegister(req,res,db,bcrypt)})
app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req,res,db,bcrypt)})
app.put('/image', (req, res) => {image.handleImage(req,res,db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req,res)})

// !!! 
// TODO: 
// * signin --> POST = sucess/fail
// * register --> POST = user
// * profile/:id --> GET = user 
// * image --> PUT --> user
// !!! 
