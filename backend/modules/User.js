import mongoose from "mongoose";
import validator from "validator"
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import crypto from "crypto"
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema({
 userName: {
    type: String,
    required: [true, "User name is required"],
    maxLength:[25,"Invalid Name"],
    minLength:[3,"Name is to Short"],
    trim: true,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique:true,
    validate:[validator.isEmail,"Please Enter a valid Email"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    select:false
  },

  avatar:{
    public_id:{
        type:String,
        required:true
    },
    url:{
        type:String,
        required:true
    }
  },

  role:{
    type:String,
    default:"user"
  },


  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken:String,
  resetPasswordExpire:Date

});

//password hash
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return ;
  }
  this.password = await bcryptjs.hash(this.password, 10);
});

// JWT token generate
userSchema.methods.getjwtToken=function(){
  return jwt.sign({id:this._id},process.env.JWT_SECRET_KEY,{expiresIn:process.env.JWT_EXPIRES})
}

//to get resesttoken
userSchema.methods.getResetPasswordToken = function () {
    // Generate random token
    const resetToken = crypto.randomBytes(20).toString("hex");
    // Hash token and save to database
    this.resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex");
    // Token expires in 15 minutes
    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
};

//to verifypassword
userSchema.methods.verify=async function (password) {
  return await bcrypt.compare(password,this.password)
}


const User = mongoose.model("User", userSchema);
export default User;