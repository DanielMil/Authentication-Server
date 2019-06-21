import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import passport from 'passport';
import { NextFunction } from 'connect';
import { ensureAuthenticated } from '../config/passport';
import { userModel } from '../models/Interfaces';
import { sendResponse } from '../config/APIUtils';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', {
    successRedirect: '/redirect/loginSuccess',
    failureRedirect: '/redirect/loginFailure'
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
  if (!username || !password) res.redirect('/redirect/missingFieldError');
  let newUser = new User({ username, password, email });
  saveUser(newUser, (err: Error) => {
    if (err) { 
      sendResponse(err, 500, res, false);
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
  if (!username && !email) return res.redirect('/redirect/missingFieldError');
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
      sendResponse(err, 500, res, false);
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
      sendResponse(err, 500, res, false);
    });
});



export const profileRouter: Router = router