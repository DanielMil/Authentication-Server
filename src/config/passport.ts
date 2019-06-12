import { Strategy } from 'passport-local';
import { User, userModel } from '../models/User';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express'; 
import { NextFunction } from 'connect';

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
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/auth/invalidSession');
    }
}   