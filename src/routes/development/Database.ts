import { Router, Request, Response } from 'express';
import { User } from '../../models/User';
import { sendResponse } from '../../config/APIUtils';

const router: Router = Router();

router.delete('/AllUsers', async (req: Request, res: Response) => {
    const environment: any = process.env.MODE;
    if (environment !== 'development') return res.redirect('/redirect/invalidModeError');
    try {
        await User.deleteMany({});
    } catch (err) {
        console.log(err);
        sendResponse("Unexpected error", 500, res);
    }
    sendResponse("Successfully removed all Users from collection.", 200, res);
});

export const databaseRouter: Router = router;
