import { Response } from 'express';
import { status } from '../models/Interfaces';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/Interfaces';

export function sendResponse(info: any, statusCode: number, res: Response): void {
    res.status(statusCode).json({
        info: info,
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