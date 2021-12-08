import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';
import connectEnsureLogin from 'connect-ensure-login';


const aleph = require('aleph-js');
const session = require('express-session')({
    secret: 'insert secret here',
    resave: false,
    saveUninitialized: false
})

const chat = express();
const port = 4567;

chat.use(express.static(__dirname))
chat.use(bodyParser.json())
chat.use(bodyParser.urlencoded({extended: true}))
chat.use(session)
chat.use(passport.initialize())
chat.use(passport.session())

chat.set('view engine', 'ejs')

mongoose.connect('mongodb://localhost/AlephChat')

const usrSchema = new mongoose.Schema({
    username: String,
    password: String,
    private_key: String,
    public_key: String,
    mnemonics: String,
    address: String
});

usrSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', usrSchema);
passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

const api_server = 'https://api2.aleph.im';
chat.get('/', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const room = 'main';
    aleph.posts.get_posts('chat', {'refs': [room], 'api_server': api_server}).then((result) => {
        res.render('index', {posts: result.posts, user: req.user, room: room})
    })
})

chat.get('/rooms/:room', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    const room = req.params.room;
    aleph.posts.get_posts('chat', {'refs': [room], 'api_server': api_server}).then((result) => {
        res.render('index', {posts: result.posts, user: req.user, room: room})
    })
})

chat.get('/login', (req, res) => {
    res.sendFile('views/login.html', {root: __dirname})
})

chat.get('/register', (req, res) => {
    res.sendFile('views/register.html', {root: __dirname})
})

// User Registration
chat.post('/register', (req, res) => {
    User.register({username: req.body.username, active: false}, req.body.password, (err, user) => {
        aleph.ethereum.new_account().then((eth_account) => {
            user.private_key = eth_account.private_key
            user.public_key = eth_account.public_key
            user.mnemonics = eth_account.mnemonics
            user.address = eth_account.address
            user.save()

            passport.authenticate('local')(req, res, () => {
                res.redirect('/')
            })
        })
    })
})

chat.post('/login', passport.authenticate('local'), (req, res) => {
    res.redirect('/')
})

// Push messages to Aleph network
chat.post("/messages/:room", connectEnsureLogin.ensureLoggedIn(), (req, res) => {

    const message = req.body.message;
    const room = req.params.room
    aleph.ethereum.import_account({mnemonics: req.user.mnemonics}).then((account) => {
        const channel = 'TEST';
        aleph.posts.submit(account.address, 'chat', {'body': message}, {
            ref: room,
            api_server: api_server,
            account: account,
            channel: channel
        }).then(r => console.log("submitted"))
    })
})

chat.get('/users/:username', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
    // look up the user
    User.findOne({username: req.params.username}, (err, user) => {
        if (err) {
            res.send({error: err})
        } else {
            res.send({user: user})
        }
    })
})

chat.listen(port, () => {
    console.log(`Server is running on port ${port}...`)
})