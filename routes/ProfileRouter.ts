import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import passport from 'passport';
import { NextFunction } from 'connect';
import { ensureAuthenticated } from '../config/passport';
import { userModel, status } from '../models/Interfaces';
import jwt from 'jsonwebtoken';

const getToken = (user: userModel) => {
  const secret: any = process.env.JWT_SECRET;
  return jwt.sign({
    iss: 'auth-server',
    sub: user.id,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 1)
  }, secret);
}

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
    status: status.Success
  });
});

router.post('/register', async (req: Request, res: Response) => {
  let { username, password, email } = req.body;
  if (!username || !password) res.redirect('/auth/missingFieldError');
  let newUser = new User({ username, password, email });
  saveUser(newUser, (err: Error) => {
    if (err) { 
      res.status(500).json({
        error: err
      });
    } else {
      res.status(200).json({
        description: "Successfully created new user.",
        status: status.Success
      });
    }
  });
});

router.get('/user', ensureAuthenticated, (req: Request, res: Response) => {
  let user: any =  new Object(JSON.parse(JSON.stringify(req.user)));
  delete user.password;
  res.json({
    User: user,
    status: status.Success
  });
});

router.put('/user', ensureAuthenticated, (req: Request, res: Response) => {
  const { username, email } = req.body;
  if (!username && !email) res.redirect('/auth/missingFieldError');
  req.user.username = username ? username : req.user.username;
  req.user.email = email ? email : req.user.email;
  req.user.save()
    .then((user: userModel) => {
      res.json({
        description: `Successfully updated user ${user.username}`,
        status: status.Success
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        error: err
      });
    });
});

router.delete('/user', ensureAuthenticated, (req: Request, res: Response) => {
  User.findByIdAndDelete({ _id: req.user.id })
    .then((user: userModel) => {
      res.json({
        description: `Successfully deleted user ${user.username}`,
        status: status.Success
      });
    })
    .catch((err: Error) => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/missingFieldError', (req: Request, res: Response) => {
  res.status(400).json({
    description: "Missing required field.",
    status: status.Failure
  });
});

router.get('/invalidSession', (req: Request, res: Response) => {
  res.status(401).json({
    description: "There is no user in session.",
    status: status.Failure
  });
});

router.get('/loginSuccess', (req: Request, res: Response) => {
  const token = getToken(req.user);
  res.status(200).json({
    description: "Successfully logged in.",
    token: token,
    status: status.Success
  });
});

router.get('/loginFailure', (req: Request, res: Response) => {
  res.status(400).json({
    description: "Invalid credentials. There was an issue logging in to your account.",
    status: status.Failure
  });
});

export const profileRouter: Router = router