const express       = require('express');
const bodyParser    = require('body-parser');
const cors          = require('cors');

const app       = express();

app.use(bodyParser.json());
app.use(cors());

const database = {
    users: [
        {
            id:"321",
            name:"sally",
            email: "sally@gmail.com",
            password: "pizza",
            enries:0,
            joined: new Date()
        },
        {
            id:"123",
            name:"john",
            email: "john@gmail.com",
            password: "cookies",
            entries:0,
            joined: new Date()
        }
    ]
}
 
app.get("/", (req,res) => {
    res.json(database.users);
});

app.post("/signin", (req,res) => {
    if (req.body.email === database.users[1].email && 
        req.body.password === database.users[1].password){
            res.json(database.users[1]);
    } else {
        res.status(400).json('error logging in')
    }
});

app.post("/register", (req,res) => {
    const newUser = {...req.body, id:"456", entries:0, joined:new Date() };
    database.users.push(newUser);
    res.json(newUser);
});

app.get("/profile/:id", (req,res) => {
    const { id } = req.params;
    let found = false;

    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            return res.json(user)
        }
    });
    if (!found){
        res.status(400).json("invalid user name")
    }  
});

app.put("/image", (req,res) => {
    const { id } = req.body;
    let found = false;

    database.users.forEach( user => {
        if (user.id === id) {
            found = true;
            ++user.entries
            return res.json(user)
        }
    });
    if (!found){
        res.status(400).json("user not found")
    }
});

app.listen(3000, () => {
    console.log("SERVER LIVING");
});