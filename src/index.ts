import express from 'express';
import { Request, Response } from 'express';
import * as bodyParser from 'body-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import passport = require('passport');
import { configurePassport } from './config/passport';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import mongoStore from 'connect-mongo';
import { passwordRouter } from './routes/Password';
import { redirectRouter } from './routes/Redirect';
import { databaseRouter } from './routes/development/Database'
import { profileRouter } from './routes/ProfileRouter';

const app = express();

app.use((req: Request, res: Response, next: any) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// Set environment variables
dotenv.config();
const sessionSecret: any = process.env.SESSION_SECRET;
const dbConnection: any = process.env.MONGO_URI;

// Initialize db and server
const init = async (port: string) => {
    try {
        await mongoose.connect(dbConnection, { useNewUrlParser: true });
        console.log('Successfully connected to MongoDB.');
        await app.listen(port);
        console.log('Listening on port ' + port);
    } catch (err) {
        console.log(err);
    }
}

const MongoStore = mongoStore(session);
const db: any = mongoose.connection;

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
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/auth', profileRouter);
app.use('/auth/password', passwordRouter);
app.use('/redirect/', redirectRouter);
app.use('/dev', databaseRouter);

const port: any = process.env.PORT || 5000;
init(port);

export default app;