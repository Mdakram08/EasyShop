// export default Register;
import React, { useState } from "react";
import PageTitle from "../components/pageTitle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import "../pagesStyling/Register.css";
import { Link ,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { userRegister, removeError, removeSuccess } from "../features/userSlice";
import { useSelector, useDispatch, } from "react-redux";
import { useEffect } from "react";

const Register = () => {
  const {error,success,loading,isAuthenticated}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
  const [user, setUser] = useState({
    userName: "",
    email: "",
    password: "",
  });
  const { userName, email, password } = user;
  // Stores avatar image (Base64)
  const [avatar, setAvatar] = useState("");
  // Default preview image
  const [avatarPreview, setAvatarPreview] = useState("/profile.jpeg");
  //useNavigate hook
  const navigate=useNavigate()
  // Handle input changes for profile function --1
  const registerDataChange = (e) => {
    if (e.target.name === "avatar") {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setAvatarPreview(reader.result);
          setAvatar(reader.result);
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUser({
        ...user,
        [e.target.name]: e.target.value,
      });
    }
  };
  // Handle form submission  function ----2
  const registerForm = (e) => {
    e.preventDefault()
    if (!userName || !email || !password ) {
      toast.error("Please enter all the required fields", {
        position: "top-center",
        autoClose: 2000,
      });
      return
    }

    if(!avatar){
      toast.error("Please select Profile Photo",{
        position:"top-center",
        autoClose:2000,
      });
      return
    }

    const myForm=new FormData();
      myForm.set("userName",userName)
      myForm.set("password",password)
      myForm.set("email",email)
      myForm.set("avatar",avatar)
      dispatch(userRegister(myForm));

  };
  
  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeError())
    }
  },[dispatch,error])

  useEffect(()=>{
    if(isAuthenticated){
      navigate("/user/profile")
    }
  },[dispatch,navigate,isAuthenticated]);

  useEffect(()=>{
    if(success){
      toast.success("Registration SuccessFull",{position:'top-center',autoClose:2000})
      dispatch(removeSuccess());
      navigate("/")
    }
  },[dispatch,success])

  return (
    <>
      <PageTitle title="Register User" />
      <Navbar />

      <div className="form-container">
        <form
          className="form"
          encType="multipart/form-data"
          onSubmit={registerForm}
        >
          <h2>SIGN UP</h2>

          {/* Avatar Preview */}
          <img
            src={avatarPreview}
            alt="Avatar Preview"
            className="avatar"
          />

          {/* Username */}
          <div className="input-group">
            <input
              type="text"
              name="userName"
              placeholder="Username"
              value={userName}
              onChange={registerDataChange}
              
            />
          </div>

          {/* Email */}
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={email}
              onChange={registerDataChange}
              
            />
          </div>

          {/* Password */}
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={registerDataChange}
              
            />
          </div>

          {/* Avatar Upload */}
          <div className="input-group avatar-group">
            <input
              type="file"
              name="avatar"
              accept="image/*"
              className="file-input"
              onChange={registerDataChange}
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="auth-btn">
            {loading?"Singning Up":"Sign Up"}
          </button>

          <p className="form-links">
            Already have an account?{" "}
            <Link to="/login">Sign in here</Link>
          </p>
        </form>
      </div>

      <Footer />
    </>
  );
};

export default Register;