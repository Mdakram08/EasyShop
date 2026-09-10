import User from "../modules/User.js";
import wrapAsync from "../utils/wrapAsync.js";
import bcrypt from "bcryptjs"
import ExpressError from "../utils/ExpressError.js";
import sendToken from "../utils/jwtToken.js";
import { sendEmail } from "../utils/sendEmail.js";
import crypto from "crypto";
import cloudinary from "cloudinary"

//new user Registration
export const userRegister = wrapAsync(async (req, res, next) => {
    // Get user data from request body
    const { userName, password, email,avatar } = req.body;
    const myCloud = await cloudinary.v2.uploader.upload(avatar, {
       folder:"avatar",
       width:150,
       crop:"scale"
    })
    // Check if user already exists with the same email
    const registered = await User.findOne({ email });
    if (registered) {
        return next(new ExpressError("User Already Registered. Login to continue...",409));
    }
    // Create new user Password will be hashed automatically by the pre("save") middleware
    const user = await User.create({
        userName,
        email,
        password,
        avatar: {
            public_id: myCloud.public_id,
            url: myCloud.secure_url
        }
    });
    // Generate JWT token using schema method
    sendToken(user,201,res);
});


// User Login Controller
export const userLogin = wrapAsync(async (req, res, next) => {
    // Get email and password from request body
    const { email, password } = req.body;
    // Check if email and password are provided
    if (!email || !password) {
        return next(new ExpressError("Email and Password cannot be Empty!",400));
    }
    // Find user by email and explicitly include password
    // because password field has select: false in schema
    const user = await User.findOne({ email }).select("+password");
    // Check if user exists
    if (!user) {
        return next(new ExpressError("Invalid Email or Password",401));
    }
    // Compare entered password with hashed password in database
    const isMatch = await bcrypt.compare(
        password,
        user.password
    );
    // If password doesn't match
    if (!isMatch) {
        return next(new ExpressError("Incorrect Password try again..",401));
    }
    // Generate JWT token using schema method
    const token = user.getjwtToken();
    // Send success response
    sendToken(user,201,res);
});


// Logout User
export const userLogout = wrapAsync(async (req, res, next) => {
    // Clear the JWT token cookie
    res.cookie("token", null, {
        expires: new Date(Date.now()), // Expire cookie immediately
        httpOnly: true, // Prevent JavaScript access to the cookie
    });
    // Send success response
    res.status(200).json({
        success: true,
        message: "Logout Successfully",
    });
});


// Request Password Reset Controller
export const requestPasswordReset = wrapAsync(async (req, res, next) => {
    // Get email from request body
    const { email } = req.body;
    // Find user by email
    const user = await User.findOne({ email });
    // If user does not exist
    if (!user) {
        return next(new ExpressError("User does not exist", 400));
    }
    // Variable to store generated reset token
    let resetToken;
    try {
        // Generate reset password token
        resetToken = user.getResetPasswordToken();
        // Save reset token and expiry in database
        await user.save({ validateBeforeSave: false });
    } catch (error) {
        // Error while generating token
        return next(
            new ExpressError("Error generating reset token", 500)
        );
    }
    // Create reset password URL
    const resetPasswordUrl =`${req.protocol}://${req.get("host")}/reset/${resetToken}`;
   // Email message
    const message = `Use the following link to reset your password:${resetPasswordUrl} This link will expire in 30 minutes.If you didn't request a password reset, please ignore this email.`;
    try {
        // Send reset password email
        await sendEmail({
            email: user.email,
            subject: "Password Reset Mail",
            message,
        });
        // Send success response after email is sent
        return res.status(200).json({
            success: true,
            message: `Reset Mail sent to ${user.email}`,
        });
    } catch (error) {
        console.log(error)
        // Remove reset token if email sending fails
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        // Save changes to database
        await user.save({ validateBeforeSave: false });
        // Pass error to error handler
        return next(
            new ExpressError("Email cannot be sent", 500)
        );
    }
});


//resest password 
export const resetPassword = wrapAsync(async (req, res, next) => {
    //  Hash token from URL
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex");
    // Find user with valid token + not expired
    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: { $gt: Date.now() }
    });
    if (!user) {
        return next(new ExpressError("Invalid or expired reset token", 400));
    }
    //  Get passwords
    const { password, confirmpassword } = req.body;
    if (!password || !confirmpassword) {
        return next(new ExpressError("Password fields are required", 400));
    }
    if (password !== confirmpassword) {
        return next(new ExpressError("Passwords do not match", 400));
    }
    //  Set new password
    user.password = password;
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    // 6. Save user
    await user.save();
    res.status(200).json({
        success: true,
        message: "Password reset successful",
        user
    });
});


//userProfile
export const userProfileDetails=wrapAsync(async(req,res,next)=>{
    const user=await User.findById(req.user.id);
    if(!user){
        return next(new ExpressError("User not Found",400));
    }
    res.status(200).json({
        success:true,
        message:"user data",
        user
    })
})


// Updating existing password
export const updatePassword = wrapAsync(async (req, res, next) => {
    //Get passwords from request body
    const { oldpassword, newpassword, confirmpassword } = req.body;
    //Find user in DB using logged-in user ID
    //    +password is required because password is hidden in schema
    const user = await User.findById(req.user.id).select("+password");
    //Check if old password matches DB password
    const checkPassword = await user.verify(oldpassword);
    if (!checkPassword) {
        return next(new ExpressError("Old password is Incorrect", 400));
    }
    //Check if new password and confirm password match
    if (newpassword !== confirmpassword) {
        return next(new ExpressError("Password did not match", 400));
    }
    //Assign new password (this will be hashed by pre-save middleware)
    user.password = newpassword;
    //Save updated user in database
    await user.save();
    //Send new JWT token after password update (auto login again)
    sendToken(user, 201, res);
});

//update user details
export const updateUserDetails = wrapAsync(async (req, res, next) => {
   const {userName,email,avatar}=req.body;
   const updateDetails={
    userName,
    email
   }
   if(avatar !== ""){
    const user=await User.findById(req.user.id);
    const imageId=user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    const myCloud=await cloudinary.uploader.upload(avatar,{
        folder:"avatar",
        width:150,
        crop:"scale"
    })
    updateDetails.avatar={
        public_id:myCloud.public_id,
        url:myCloud.secure_url
    }
    
   }
   const user=await User.findByIdAndUpdate(req.user.id,
    updateDetails,{
        new:true,
        runValidators:true
    }
   )
   res.status(200).json({
    success:true,
    message:"User profile updated successfully",
    user
   })
});

//admin get all USers
export const getAdminUsers=wrapAsync(async(req,res,next)=>{
    const users=await User.find();
    res.status(200).json({
        success:true,
        users,
        message:"Users fetched"
    })
})

//admin get single route
export const getAdminSingleUser=wrapAsync(async(req,res,next)=>{
    const user=await User.findById(req.params.id);
    res.status(200).json({
        success:true,
        user,
        message:"Signle User Fetched"
    })
})

//admin updates users role
export const adminUpdateUserRole=wrapAsync(async(req,res,next)=>{
    const {role}=req.body
    const user=await User.findByIdAndUpdate(req.params.id,{role},{
        new:true,
        runValidators:true
    });
    if(!user){
        return next(new ExpressError("User not found",400));
    }
    res.status(200).json({
        success:true,
        user,
        message:"User role Updated Sucessfully"
    })
}) 

//admin user delete
export const deleteAdminuser=wrapAsync(async(req,res,next)=>{
    let user=await User.findById(req.params.id);
    if(!user){
        return next(new ExpressError("User not Found!",400));
    }
    const imageId=user.avatar.public_id;
    await cloudinary.uploader.destroy(imageId);
    user=await User.findByIdAndDelete(req.params.id);
    res.status(200).json({
        success:true,
        user,
        message:"User deleted Sucessfully"
    })
})