import React, { useState } from 'react'
import PageTitle from "../components/pageTitle";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Link ,useNavigate} from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from 'react-redux';
import { userLogin ,  removeError, removeSuccess } from '../features/userSlice';
import { useEffect } from "react";

const Login = () => {
    const{error,loading,success,isAuthenticated}=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const[loginEmail,setLoginEmail]=useState("");
    const[loginPassword,setLoginPassword]=useState("");
    const LoginSubmit=(e)=>{
        e.preventDefault();
        if (!loginEmail || !loginPassword) {
            toast.error("Please enter all the required fields", {
                position: "top-center",
                autoClose: 2000,
            });
            return
        }
        dispatch(userLogin({email:loginEmail,password:loginPassword}))
} 
//if errro occuress
  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
      dispatch(removeError())
    }
  },[dispatch,error])
//if success
  useEffect(()=>{
    if(success && isAuthenticated){
      toast.success("Login SuccessFull",{position:'top-center',autoClose:2000})
      dispatch(removeSuccess());
      navigate("/")
    }
  },[dispatch,success,isAuthenticated ])

    useEffect(()=>{
      if(isAuthenticated){
        navigate("/user/profile")
      }
    },[dispatch,navigate,isAuthenticated]);




  return (
    <div>
        <PageTitle title="Login"/>
        <Navbar/>
        <div className="form-container">
            <div className="from-contain">
                
                <form className="form" onSubmit={LoginSubmit}>
                  <h2>LOGIN IN</h2>
                    <div className="input-group">
                        <input type="text" name="email" placeholder='Enter Email' value={loginEmail} onChange={(e)=>setLoginEmail(e.target.value)}/>
                    </div>
                    <div className="input-group">
                        <input type="text" name="password" placeholder='Enter Password' value={loginPassword} onChange={(e)=>setLoginPassword(e.target.value)}/>
                    </div>
                    <button className='auth-btn'>Log In</button>
                    <p className="form-links">Forget your Password? <Link to="/user/forgot/password">Reset Here</Link></p>
                    <p className="form-links">Don't Have an Account?<Link to="/register">Sign Up</Link></p>
                </form>
            </div>
        </div>
        <Footer/>
    </div>
  )
}

export default Login
