const handleRegisterRoute = (bcrypt, db, salt) => (req,res) => {
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
}


module.exports = { handleRegisterRoute }
