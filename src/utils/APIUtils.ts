import { Response } from 'express';
import { status } from '../models/Interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/Interfaces';

export function sendResponse(info: any, statusCode: number, res: Response): void {
    res.status(statusCode).json({
        info,
        status: statusCode === 200 || statusCode === 201 ? status.Success : status.Failure
    });
}

export async function getHashedPassword(password: string): Promise<any> {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (err) {
        console.log(err);
        return null;
    }
}

export const getToken = (user: userModel) => {
    const secret: any = process.env.JWT_SECRET;
    return jwt.sign({
        iss: 'auth-server',
        sub: user.id,
        iat: new Date().getTime(),
        exp: new Date().setDate(new Date().getDate() + 1)
    }, secret);
}

export const validateEmailPattern = (toCheck: string) => {
    const expr = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
    return expr.test(toCheck);
}