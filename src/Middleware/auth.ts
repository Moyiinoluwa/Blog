import asyncHandler from 'express-async-handler'; 
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../Model/user/user.model';
import { Admin } from '../Model/admin/admin.model';
import { getConfig } from '../Config/config';
 

const { SECRET_KEY } = getConfig();
// config(); 
// const SECRET_KEY = process.env.SECRET_KEY;


export const userAuth = asyncHandler(async (req: Request, res: any, next: NextFunction): Promise<void> => {
    let token: string;
    //token = ''
    // Extract token from Authorization header if it starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = ''
    }
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
         //const secretKey = process.env.SECRET_KEY || ''
         
        // Verify the token
        const decoded: any = jwt.verify(token, SECRET_KEY );

        // Find the user by id from the decoded token
        const user = await User.findById(decoded.userId);
        if (!user) {
            return res.status(401).json({
                error: 'Invalid token',
            });
        }

        // Attach the user to the request object
       // req.user = user;

        
        next();
    } catch (err) {
        return res.status(401).json({ error: 'You are not authorized to access this route' });
    }

});



export const adminAuth = asyncHandler(async (req: Request, res: any, next: NextFunction): Promise<void> => {

    let token: string;

    // Extract token from Authorization header if it starts with 'Bearer'
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    } else {
        token = ''
    }
    
    // Check if token exists
    if (!token) {
        return res.status(401).json({ error: 'Not authorized to access this route' });
    }

    try {
         // const secretKey = process.env.SECRET_KEY || ''
        // Verify the token
        const decoded: any = jwt.verify(token, SECRET_KEY);

        // Find the user by id from the decoded token
        console.log(decoded)
        const admin = await Admin.findById(decoded.userId);
        
        if (!admin) {
            return res.status(401).json({
                error: 'Invalid token',
            });
        }

        next();
    } catch (err) {
        return res.status(401).json({ error: 'You are not authorized to access this route' });
    }

});
