import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { catchAsyncError } from './catchAsyncError.js';
import ErrorHandler from '../utils/errorHandler.js';

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return next(new ErrorHandler("Please Login to access this resource", 401));
    }

    const decodedData = jwt.verify(token, process.env.JWT_SECRET);

    // Get the user from the database
    const user = await User.findById(decodedData.id);

    // Critical check: Ensure a user was actually found
    if (!user) {
        return next(new ErrorHandler("User not found or session expired", 401));
    }

    // Attach the user to the request object
    req.user = user;

    next();
});