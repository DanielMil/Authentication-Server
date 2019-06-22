import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { userModel, MailObject } from '../models/Interfaces';
import { sendResponse } from '../config/APIUtils';

const router: Router = Router();

router.post('/forgotPassword', async (req: Request, res: Response) => {
    try {
        const buffer: Buffer = await crypto.randomBytes(16);
        const token: string = buffer.toString('hex');
        const user: userModel = await User.findOne({ email: req.body.email }); 
        if (!user) return res.redirect('/redirect/forgotPasswordEmailError');
        user.resetPasswordToken = token;
        user.resetPasswordExpiration = Date.now() + 3600000; 
        await user.save();
        const forgotPasswordURL: string = `http://${req.connection.remoteAddress}/auth/password/resetPassword/${token}`;
        const transporter: any = createTransport(); 
        const mailOptions: MailObject = createMailObject(user, forgotPasswordURL);
        await transporter.sendMail(mailOptions);
        const info = getResponseObject(forgotPasswordURL, token);
        sendResponse(info, 200, res);
    } catch (err) {
        console.error(err);
        res.redirect('/redirect/forgotPasswordEmailError');
    }
});


router.post('/resetPassword/:token', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() }});
        if (!user) return res.redirect('/redirect/forgotPasswordTokenError');
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        await saveUser(user, (err: Error) => {
            if (err) { 
                sendResponse(err, 500, res);
            } else {
                sendResponse(`${user.username} - password was successfully updated.`, 200, res);
            }
        });
    } catch (err) {
        console.error(err);
        res.redirect('/redirect/forgotPasswordTokenError');
    }
});

const createMailObject = (user: userModel, forgotPasswordURL: string): MailObject => {
    return {
        from: process.env.EMAIL_ADDRESS,
        to: user.email,
        subject: 'Link To Reset Password',
        text: `You are receiving this email because you or someone else requested a password 
            change for an account associated with this email. If this action was not performed by you, 
            please ignore this message, otherwise follow the link to reset your password.\n\n 
            ${forgotPasswordURL}`
    };
}

const createTransport = (): any => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
        }
    });
}

const getResponseObject = (forgotPasswordURL: string, token: string): object => {
    return {
        message: "You can use the associated redirect url to compose your endpoint for the 'Reset Password' screen on the client.",
        redirectURL: forgotPasswordURL,
        resetPasswordToken: token,
    }
}

export const passwordRouter: Router = router
