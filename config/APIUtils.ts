import { Response } from 'express';
import { status } from '../models/Interfaces';
import bcrypt from 'bcrypt';


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