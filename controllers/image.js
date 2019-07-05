const clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: '22a0a8fa2edd4094b48c3055c1f3b86a'
});

const handleApiRoute = (req, res) => {
    app.models.predict("a403429f2ddf4b49b307e318f00e528b", req.body.input)
    .then ( data => {
        res.json(data);
    })
    .catch (err => {
        console.log(err);
        res.status(400).json(`unable to work with api`)
    })
}

const handleImageRoute = (db) => (req, res) => {
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
}

module.exports = { handleImageRoute, handleApiRoute }

