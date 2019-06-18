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
import { passwordRouter } from './routes/Password';

const app = express();

// Set environment variables
dotenv.config();
const sessionSecret: any = process.env.SESSION_SECRET;
const dbConnection: any = process.env.MONGO_URI; 

// Mongo config
mongoose.connect(dbConnection, { useNewUrlParser: true })
 .then(() => console.log("Succesfully connected to MongoDB."))
 .catch((err: mongoose.Error) => console.error(err));
const MongoStore = mongoStore(session); 
const db: any  = mongoose.connection;
 
// Fix mongo deprecation warnings
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

// Configure express session
app.use(cookieParser());
app.use(session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
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
app.use('/auth/password', passwordRouter);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log('Listening on port ' + port);
});