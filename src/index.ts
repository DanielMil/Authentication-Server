import express from 'express';
import * as bodyParser from 'body-parser';
import { profileRouter } from './routes/ProfileRouter';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport = require('passport');
import { configurePassport } from './config/passport';
import session from 'express-session'; 
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';

const MongoStore = mongoStore(session); 
const app = express();
dotenv.config();

// Mongo config
const DB_CONNECTION: any = process.env.MONGO_URI; 
mongoose.connect(DB_CONNECTION, { useNewUrlParser: true })
 .then(() => console.log("Succesfully connected to MongoDB."))
 .catch((err: mongoose.Error) => console.error(err));

const db: any  = mongoose.connection;
 
// Fix mongo deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Configure express session
app.use(cookieParser());
app.use(session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: db })
}));

// Passport config
configurePassport(passport); 
app.use(passport.initialize());
app.use(passport.session()); 

// General config
app.use(bodyParser.urlencoded({ extended:true }));
app.use(bodyParser.json());

app.use('/auth', profileRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});