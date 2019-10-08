import { Strategy } from 'passport-local';
import { User } from '../models/User';
import { userModel } from '../models/Interfaces'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { NextFunction } from 'connect';
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';
import { sendResponse } from './APIUtils';

export function configurePassport(passport: any) {
    passport.use(
        new Strategy({ usernameField: 'email' }, async (email: string, password: string, done: any) => {
            try {
                const user = await User.findOne({ email })
                if (!user) return done(null, false, { message: 'Cannot find user.' });
                const isMatch = await bcrypt.compare(password, user.password);
                if (isMatch) return done(null, user);
                else done(null, false, { message: 'Passwords do not match!' });
            } catch (err) {
                console.log(err);
            }
        })
    );

    passport.use(
        new jwtStrategy({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.JWT_SECRET
        }, async (payload, done) => {
            try {
                const user = await User.findById(payload.sub)
                done(null, user);
            } catch (err) {
                console.log(err);
                done(err, false);
            }
        })
    );

    passport.serializeUser((user: userModel, done: any) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id: string, done: any) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (err) {
            console.log(err);
        }
    });
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        res.redirect('/redirect/invalidSession');
    } else if (!req.headers.authorization) {
        sendResponse('You must provide a valid jwt to access this route.', 401, res);
    } else {
        passport.authenticate('jwt', { session: false }, (err, user, info) => {
            if (user && (!err || !info)) return next();
            sendResponse(info, 401, res);
        })(req, res, next);
    }
}   
