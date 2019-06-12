import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import passport from 'passport';
import { NextFunction } from 'connect';
import { ensureAuthenticated } from '../config/passport';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', {
    successRedirect: '/auth/loginSuccess',
    failureRedirect: '/auth/loginFailure'
  })(req, res, next);
});

router.post('/logout', ensureAuthenticated, (req: Request, res: Response) => {
  req.logOut();
  res.status(200).json({
    description: "Successfully logged out.",
    status: "SUCCESS"
  });
});

router.post('/register', async (req: Request, res: Response) => {
  let { username, password } = req.body;
  if (!username || !password) {
    res.status(200).json({
      description: "Missing required field.",
      status: "FAILURE"
    });
    return;
  }
  let newUser = new User({ username, password });
  saveUser(newUser, (err: Error) => {
    if (err) res.status(500).json({
      error: err
    });
    else {
      res.status(200).json({
        description: "Successfully created new user.",
        status: "SUCCESS"
      });
    }
  });
});

router.get('/user', ensureAuthenticated, (req: Request, res: Response) => {
  res.json({
    User: req.user,
    status: "SUCCESS"
  });
});

router.get('/invalidSession', (req: Request, res: Response) => {
  res.status(400).json({
    description: "There is no user in session.",
    status: "FAILURE"
  });
});

router.get('/loginSuccess', (req: Request, res: Response) => {
  res.status(200).json({
    description: "Successfully logged in.",
    status: "SUCCESS"
  });
});

router.get('/loginFailure', (req: Request, res: Response) => {
  res.status(400).json({
    description: "Invalid credentials. There was an issue logging in to your account.",
    status: "FAILURE"
  });
});

export const profileRouter: Router = router