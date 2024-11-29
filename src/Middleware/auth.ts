import asyncHandler from 'express-async-handler'; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../Model/user/user.model';
import { config } from 'dotenv';
 
config(); 
const SECRET_KEY = process.env.SECRET_KEY;


export const userAuth = asyncHandler(async (req: Request, res: any, next: NextFunction) => {
    let token: string;

    // Extract token from Authorization header if it starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
        // Verify the token
        const decoded: any = jwt.verify(token, SECRET_KEY);

        // Find the user by id from the decoded token
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid token',
            });
        }

        // Attach the user to the request object
        req.user = user;

        
        next();
    } catch (err) {
        return res.status(401).json({ error: 'You are not authorized to access this route' });
    }
});
