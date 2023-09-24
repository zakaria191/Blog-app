require('dotenv').config();
const express = require('express');
const expressLayout = require('express-ejs-layouts');
const methodOverride = require('method-override');
const cookieParser = require('cookie-parser');
const MongoStore = require('connect-mongo');
const session = require('express-session');

const conectDB = require('./server/config/db');


const app = express();
const PORT = 5000 || process.env.PORT;

// connect db 
conectDB();

app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride('_method'));

app.use(session(
    {
        secret : 'keybord cat',
        resave : false,
        saveUninitialized : true,
        store: MongoStore.create({
            mongoUrl: process.env.mongodbUrl
        }),
    }
))

app.use(expressLayout);
app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use('/',require('./server/routes/main'));
app.use('/',require('./server/routes/admin'));


app.listen(PORT, ()=>{
    console.log(`app listening on port ${PORT}`);
});