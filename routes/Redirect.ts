import { Router, Request, Response } from 'express';
import { userModel } from '../models/Interfaces';
import jwt from 'jsonwebtoken';
import { sendResponse } from '../config/APIUtils';

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

router.get('/loginSuccess', (req: Request, res: Response) => {
    const token = getToken(req.user);
    const info = {
        description: "Successfully logged in.",
        token: token,
    };
    sendResponse(info, 200, res);
});

router.get('/missingFieldError', (req: Request, res: Response) => {
    sendResponse("Missing required field.", 400, res);
});
  
router.get('/invalidSession', (req: Request, res: Response) => {
    sendResponse("There is no user in session.", 401, res);
});
  
router.get('/loginFailure', (req: Request, res: Response) => {
    sendResponse("Invalid credentials. There was an issue logging in to your account.", 400, res);
});

router.get('/forgotPasswordTokenError', (req: Request, res: Response) => {
    sendResponse("Invalid or expired password reset token.", 403, res);
});

router.get('/forgotPasswordEmailError', (req: Request, res: Response) => {
    sendResponse("Invalid email.", 400, res);
});

export const redirectRouter: Router = router
