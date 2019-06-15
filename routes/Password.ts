import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { userModel, status, MailObject } from '../models/Interfaces';

const router: Router = Router();

router.post('/forgotPassword', async (req: Request, res: Response) => {
    try {
        const buffer: Buffer = await crypto.randomBytes(16);
        const token: string = buffer.toString('hex');
        const user: userModel = await User.findOne({ email: req.body.email }); 
        if (!user) return res.redirect('/auth/password/forgotPasswordEmailError');
        user.resetPasswordToken = token;
        user.resetPasswordExpiration = Date.now() + 3600000; 
        await user.save();
        const forgotPasswordURL: string = `http://${req.connection.remoteAddress}/auth/password/resetPassword/${token}`;
        const transporter: any = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions: MailObject = {
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Link To Reset Password',
            text: `You are receiving this email because you or someone else requested a password 
                change for an account associated with this email. If this action was not performed by you, 
                please ignore this message, otherwise follow the link to reset your password.\n\n 
                ${forgotPasswordURL}`
        };
        await transporter.sendMail(mailOptions);
        res.json({
            message: "You can use the associated redirect url to compose your endpoint for the 'Reset Password' screen on the client.",
            redirectURL: forgotPasswordURL,
            resetPasswordToken: token,
            status: status.Success
        }); 
    } catch (err) {
        console.error(err);
        res.redirect('/auth/password/forgotPasswordEmailError');
    }
});


router.post('/resetPassword/:token', async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpiration: { $gt: Date.now() }});
        if (!user) return res.redirect('/auth/password/forgotPasswordTokenError');
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiration = undefined;
        await saveUser(user, (err: Error) => {
            if (err) { 
                res.status(500).json({
                  error: err
                });
            } else {
                res.json({
                    message: `${user.username} - password was successfully updated.`,
                    status: status.Success 
                });
            }
        });
    } catch (err) {
        console.error(err);
        res.redirect('/auth/password/forgotPasswordTokenError');
    }
});

router.get('/forgotPasswordTokenError', (req: Request, res: Response) => {
    res.status(403).json({
        description: "Invalid or expired password reset token.",
        status: status.Failure
    });
});

router.get('/forgotPasswordEmailError', (req: Request, res: Response) => {
    res.status(400).json({
        description: "Invalid email.",
        status: status.Failure
    });
});

export const passwordRouter: Router = router