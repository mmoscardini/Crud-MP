const express = require('express');
const path = require ('path');
const bodyParser = require ('body-parser');
const cors = require('cors');
const passport = require ('passport');
const mongoose = require ('mongoose');

const app = express();
const port = 3000;

//Cors middleware
app.use(cors());
//Body Parser middleware
app.use(bodyParser.json());
//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

//Setup MongoDb and Mongoose
const configDB = require ('./config/database');
mongoose.Promise = global.Promise;
mongoose.connect(configDB.db, {useMongoClient: true});
mongoose.connection.on('connected', ()=>{
    console.log ('Mongoose connected to ' + configDB.db);
});
mongoose.connection.on('error', (err)=>{
    console.log ('Mongoose conection error ' + err);    
});
mongoose.connection.on('disconnected', (err)=>{
    console.log ('Mongoose disconnected from ' + configDB.db);    
});

//Set Static folder 
app.use(express.static(path.join(__dirname, 'public')));

//Setup users route
const users = require('./routes/users');
app.use('/users', users);

app.get('/', (req,res,next)=>{
    res.send('Root');
});

app.listen(port,()=>{
    console.log ('Server started on port: '+ port);
});
