import ExpressError from "./ExpressError.js";
import wrapAsync from "./wrapAsync.js";
import jwt from "jsonwebtoken";
import User from "../modules/User.js";

// Authentication middleware wrapped with wrapAsync
export const userAuth = wrapAsync(async (req, res, next) => {
    // Extract token from cookies
    const { token } = req.cookies;
    // Check if token exists
    if (!token) {
        // If token is missing, return authentication error
        return next(
            new ExpressError(
                "Authentication Error, Login to continue...",
                400
            )
        );
    }
    // Verify JWT token using secret key
    const decodedData = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY
    );
    // Find user in database using ID stored in token
    req.user = await User.findById(decodedData.id);
    // Check if user exists in database
    if (!req.user) {
        // If user not found, return error
        return next(
            new ExpressError("User not found", 404)
        );
    }
    // User authenticated successfully
    // Pass control to next middleware/controller
    next();
});

//user based roles
export const userBasedRoles=(...roles)=>{
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            return next(new ExpressError("You are not the admin you can't access the resource",400));
        }
        next();
    }
}

