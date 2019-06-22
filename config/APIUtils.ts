import { Response } from 'express';
import { status } from '../models/Interfaces'

export function sendResponse(info: any, statusCode: number, res: Response): void {
    res.status(statusCode).json({
        info: info,
        status: statusCode === 200 || statusCode === 201 ? status.Success : status.Failure
    });
}