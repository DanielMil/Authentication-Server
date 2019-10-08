import { Router, Request, Response } from 'express';
import { User } from '../models/User';
import passport from 'passport';
import { NextFunction } from 'connect';
import { ensureAuthenticated } from '../utils/passport';
import { userModel } from '../models/Interfaces';
import { sendResponse, getHashedPassword, getToken, validateEmailPattern } from '../utils/APIUtils';

const router: Router = Router();

router.post('/login', (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', async (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect('/redirect/loginFailure');
    }
    const token = getToken(user);
    const info = {
      description: "Successfully logged in.",
      token
    };
    req.logIn(user, (err) => {
      sendResponse(info, 200, res);
      if (err) return res.redirect('/redirect/loginFailure');
    });
  })(req, res, next);
});

router.post('/register', async (req: Request, res: Response) => {
  const { email, password, additionalInfo } = req.body;
  if (!email || !password) return res.redirect('/redirect/missingFieldError');
  if (!validateEmailPattern(email)) return res.redirect('/redirect/invalidEmailPattern');
  try {
    let hashedPassword = await getHashedPassword(password);
    let newUser: userModel = new User({ email, password: hashedPassword });
    additionalInfo ? newUser.additionalInfo = additionalInfo : newUser.additionalInfo = {};
    await newUser.save();
    sendResponse("Successfully created new user.", 200, res);
  } catch (err) {
    console.log(err);
    sendResponse(err, 500, res);
  }
});

router.post('/logout', ensureAuthenticated, (req: Request, res: Response) => {
  req.logOut();
  sendResponse("Successfully logged out.", 200, res);
});

router.get('/user', ensureAuthenticated, (req: Request, res: Response) => {
  let user: any = new Object(JSON.parse(JSON.stringify(req.user)));
  delete user.password;
  sendResponse(user, 200, res);
});

router.put('/user', ensureAuthenticated, async (req: Request, res: Response) => {
  const { data, email, additionalInfo } = req.body;
  let validEmail = true;
  if (!data && !email && !additionalInfo) return res.redirect('/redirect/missingFieldError');
  if (email) {
    validateEmailPattern(email) ? req.user.email = email : validEmail = false;
    if (!validEmail) return res.redirect('/redirect/invalidEmailPattern');
  }
  additionalInfo ? req.user.additionalInfo = { ...req.user.additionalInfo, ...additionalInfo } : null;
  try {
    await req.user.save();
    sendResponse('Successfully updated user.', 200, res);
  } catch (err) {
    console.log(err);
    sendResponse(err, 500, res);
  }
});

router.delete('/user', ensureAuthenticated, async (req: Request, res: Response) => {
  try {
    await User.findByIdAndDelete({ _id: req.user.id });
    sendResponse('Successfully deleted user.', 200, res);
  } catch (err) {
    console.log(err);
    sendResponse(err, 500, res);
  }
})

export const profileRouter: Router = router;
