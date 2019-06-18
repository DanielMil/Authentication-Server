import { Strategy } from 'passport-local';
import { User } from '../models/User';
import { userModel, status } from '../models/Interfaces'
import bcrypt from 'bcrypt';
import { Request, Response } from 'express'; 
import { NextFunction } from 'connect';
import { Strategy as jwtStrategy, ExtractJwt } from 'passport-jwt';
import passport from 'passport';

export function configurePassport(passport: any) {
    passport.use(
        new Strategy({ usernameField: 'username' }, (username: string, password: string, done: any) => {
            User.findOne({ username })
            .then((user) => {
                if (!user) return done(null, false, { message: 'Cannot find user.'});
                bcrypt.compare(password, user.password, (err: Error, isMatch: boolean) => {
                    if (err) console.error(err);
                    if (isMatch) return done(null, user);
                    else done(null, false, {message: 'Passwords do not match!'});
                });
            })
            .catch((err) => console.error(err));
        })
    );

    passport.use(
        new jwtStrategy({
            jwtFromRequest: ExtractJwt.fromHeader('authorization'),
            secretOrKey: process.env.JWT_SECRET
        }, (payload, done) => {
            User.findById(payload.sub)
            .then((user) => {
                done(null, user); 
            })  
            .catch((err) => {
                console.error(err);
                done(err, false);
            });
        })
    );

    passport.serializeUser((user: userModel, done: any) => {
        done(null, user.id);
    });

    passport.deserializeUser((id: string, done: any) => {
        User.findById(id, (err, user)=> {
            if (err) console.error(err);
            done(null, user);
        });
    });
}

export function ensureAuthenticated(req: Request, res: Response, next: NextFunction) {
    if (!req.isAuthenticated()) {
        res.redirect('/auth/invalidSession');
    } else if (!req.headers.authorization) {
        res.status(401).json({
            description: 'You must provide a valid jwt to access this route.',
            status: status.Failure
        });
    } else {
        passport.authenticate('jwt', {session: false}, (err, user, info) => {
            if (user && (!err || !info)) return next();
            res.status(401).json({
                description: info,
                status: status.Failure
            });
        })(req, res, next);
    }
}   