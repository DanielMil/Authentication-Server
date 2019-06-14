import { Router, Request, Response } from 'express';
import { User, saveUser } from '../models/User';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { userModel } from '../models/User';

const router: Router = Router();

router.post('/forgotPassword', async (req: Request, res: Response) => {
    try {
        let buffer = await crypto.randomBytes(16);
        let token = buffer.toString('hex');
        let user: userModel = await User.findOne({ email: req.body.email }); 
        if (!user) return res.redirect('/auth/password/forgotPasswordError');
        user.resetPasswordToken = token;
        user.resetPasswordExpiration = Date.now() + 3600000; 
        await user.save();
        const transporter: any = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_ADDRESS,
              pass: process.env.EMAIL_PASSWORD
            }
        });
        const mailOptions = {
            from: process.env.EMAIL_ADDRESS,
            to: user.email,
            subject: 'Link To Reset Password',
            text: `http://${req.connection.remoteAddress}/auth/forgot-password/${token}\n\n`
        };
        await transporter.sendMail(mailOptions);
        res.json({ status: "SUCCESS" });
    } catch (err) {
        console.error(err);
        res.redirect('/auth/password/forgotPasswordError');
    }
});

router.get('/forgotPasswordError', (req: Request, res: Response) => {
    res.status(400).json({
        description: "Invalid email.",
        status: "FAILURE"
    });
});

export const passwordRouter: Router = router