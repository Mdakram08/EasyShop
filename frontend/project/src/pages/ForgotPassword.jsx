import React, { useState } from 'react'
import PageTitle from '../components/pageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import "../pagesStyling/ForgotPassword.css"
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { userForgotPassword,removeError,removeSuccess } from '../features/userSlice'
import { useEffect } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";


const ForgotPassword = () => {
  const {error,loading,success,message}=useSelector((state)=>state.user);
  const dispatch=useDispatch();
    const [email,setEmail]=useState("");

    const forgotPasswordEmail=(e)=>{
        e.preventDefault();
        const myForm=new FormData();
        myForm.set("email",email)
        dispatch(userForgotPassword(myForm));
    }
    useEffect(()=>{
      if(error){
        toast.error(error,{position:'top-center',autoClose:2000})
        dispatch(removeError())
      }
    },[dispatch,error])

    useEffect(()=>{
      if(success){
        toast.success(message,{position:'top-center',autoClose:2000})
        dispatch(removeSuccess());
      }
    },[dispatch,success])

    if(loading){
    return(
      <>
      <Navbar/>
      <Loader/>
      <Footer/>
      </>
    )
  } 
  return (
    <>
    <Navbar/>
    <PageTitle title="Forget-Password"/>
    <div className="fog-container">
      <div className="fog-form-container">
        <h2>FORGOT PASSWORD</h2>
        <form onSubmit={forgotPasswordEmail}>
            <div className="fog-input-group">
                <input type="email" name="email" id="" placeholder='Enter Registered Email' value={email} onChange={(e)=>setEmail(e.target.value)}/>
            </div>
            <button className='fog-btn'>Submit</button>
        </form>
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default ForgotPassword
