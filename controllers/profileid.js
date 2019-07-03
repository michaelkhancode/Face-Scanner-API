const handleProfileRoute = (db) => (req,res) => {
    const { id } = req.params;
    db.select('*').from('users').where({ id })
    .then(user => {
        user.length === 0 
        ? 
        res.status(400).json("user not found")
        :
        res.json(user[0])
    });
}

module.exports = { handleProfileRoute };
