const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const bcrypt        = require('bcrypt');
const db            = require('knex')({
    client:'pg',
    connection: {
        host : '127.0.0.1',
        user : 'postgres',
        password : 'wordpass',
        database : 'smartbrain'
    }
});

const app       = express();
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

app.use(bodyParser.json());
app.use(cors());
 
app.get("/", (req,res) => {
    res.json(database.users);
});

app.post("/signin", (req,res) => {
    const {email, password} = req.body;
    db.select('email', 'hash')
    .from("login")
    .where('email', '=', email)
    .then(data => {
        bcrypt.compareSync(password, data[0].hash)
        ?
        db.select('*').from("users")
        .where('email', '=', email)
        .then(data => res.json(data[0]))
        .catch('error logging in')
        :
        res.status(400).json('passowrd not recognized')
    })
    .catch(er => res.status(400).json('email not recognized'))
});

app.post("/register", (req,res) => {
    const  { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password, salt);

    db.transaction(trx => {
        trx.insert({hash,email})
        .into('login')
        .returning('email')
        .then( loginEmail => {
            return  trx.insert({ email, name, joined: new Date()})
                    .into('users')
                    .returning('*')
                    .then( user => res.json(user[0]) )
                    .catch( err => res.status(400).json("unable to register") )            
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
});

app.get("/profile/:id", (req,res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
    .then(user => {
        user.length === 0 
        ? 
        res.status(400).json("user not found")
        :
        res.json(user[0])
    });
});

app.put("/image", (req,res) => {
    const { id } = req.body;
    db('users')
    .where('id', '=',id)
    .increment('entries', 1)
    .returning('*')
    .then(user => {
        user.length === 0 
        ? 
        res.status(400).json("user not found")
        :
        res.json(user[0])
    });
});

app.listen(3000, () => {
    console.log("SERVER LIVING");
});