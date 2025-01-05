import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import asyncHandler from './asyncHandler.js';


//Potect routes
const protect = asyncHandler(async (req, res, next) => {

    

    let token;

    //Read the JWT from cookie
    token = req.cookies.jwt;

    if (token){
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // console.log(decoded.userId);
            req.user = await User.findById(decoded.userId).select('-password');
            
            next();

        }catch (error) {
            console.log(error);
            res.status(401);
            throw new Error('Not authorized, no token');

        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});


// Admin middleware
const admin = (req, res, next) => {
    
    if(req.user && req.user.isAdmin){
        next();
    }else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
};

const isadmin = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as admin');
    }
});

export { admin, isadmin, protect };

