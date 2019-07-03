const handleSignInRoute = (bcrypt, db) => (req,res) => {
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
}

module.exports = { handleSignInRoute }
