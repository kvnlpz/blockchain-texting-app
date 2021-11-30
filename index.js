
import mongoose from 'mongoose';
import express from 'express';

const app = express();


const port = 3000;

mongoose.connect('mongodb://localhost/AlephChat')

const userSchema =  new mongoose.Schema({
	username: String,
	password: String
})


const User = mongoose.model('User', userSchema);


User.create({ username: 'Jimbob', password:  'password'})
User.create({ username: 'Micheal Scott', password:  'invalid'})
User.create({ username: 'Debby', password:  'password23'})

app.get('/', (req, res) =>{
    res.send('hello world')
} )

app.get('/users/:username', (req, res) => {
    // look up the user
    User.findOne({ username: req.params.username }, (err, user) => {
    if (err){
        res.send({ error: err})
    // do something
    } else {
    res.send({ user: user })
    }
})
})



app.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
})


console.log(mongoose)
