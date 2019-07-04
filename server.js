const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');
const bcrypt        = require('bcrypt-nodejs');
const image         = require('./controllers/image');
const profile       = require('./controllers/profileid');
const register      = require('./controllers/register');
const signin        = require('./controllers/signin');
const db            = require('knex')({
    client:'pg',
    connection: {
        connectionString: process.env.DATABASE_URL,
        ssl:true
    }
});



const app       = express();
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);

app.use(bodyParser.json());
app.use(cors());
 
app.get("/", (req,res) => {res.json("index root"); });

app.post("/signin", signin.handleSignInRoute(bcrypt, db));

app.post("/register", register.handleRegisterRoute(bcrypt, db, salt));

app.get("/profile/:id", profile.handleProfileRoute(db));

app.put("/image", image.handleImageRoute(db));

app.post("/imageface", image.handleApiRoute);

app.listen( process.env.PORT || 3000, () => {
    console.log("SERVER LIVING");
});