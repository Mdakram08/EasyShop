// Function to generate JWT token and send it in a cookie
const sendToken = (user, statusCode, res) => {
    // Generate JWT token using user model method
    const token = user.getjwtToken();
    // Cookie configuration options
    const options = {
        // Cookie expiry date (in days from .env file)
        expires: new Date(
            Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
        ),
        // Prevent JavaScript access to the cookie
        httpOnly: true
    };

    // Send response with cookie and JSON data
    res.status(statusCode).cookie("token", token, options)// Store JWT token in cookie
      .json({
         success: true,// Indicates successful login/register
         user,// Send user details
         token// Send token in response body
      });
};

export default sendToken;