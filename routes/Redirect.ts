import { Router, Request, Response } from 'express';
import { sendResponse } from '../config/APIUtils';

const router: Router = Router();

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
