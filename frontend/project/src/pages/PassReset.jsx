import React, { useState } from 'react'
import { useParams } from "react-router-dom";
import { useSelector, useDispatch, } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { userPasswordReset,removeError,removeSuccess } from '../features/userSlice';
import PageTitle from '../components/pageTitle';

const PassReset = () => {
    const{loading,error,success,isAuthenticated,user,message}=useSelector((state)=>state.user);
    // State for new password
    const [password, setPassword] = useState("");
    // State for confirm password
    const [confirmpassword, setConfirmpassword] = useState("");
    //to take token which is send to user to resest password
    const {token}=useParams();
    const dispatch=useDispatch();
    const navigate = useNavigate();
    // reset password function
    const resestPasswordSubmit=(e)=>{
        e.preventDefault();
        const myForm=new FormData()
        myForm.set("password",password);
        myForm.set("confirmpassword",confirmpassword);
        console.log(password,confirmpassword)
        dispatch(userPasswordReset({userData:myForm,token}))
    }
        useEffect(()=>{
            if(error){
              toast.error(error,{position:'top-center',autoClose:2000})
              dispatch(removeError())
            }
        },[dispatch,error])

        useEffect(()=>{
            if(success){
              toast.success(message? message:"Password Reset Sucessfull",{position:'top-center',autoClose:2000})
              dispatch(removeSuccess());
              navigate("/login")
            }
        },[dispatch,success])
    
        
  return (
    <>
    <PageTitle title="Reset Password"/>
    <div>
      <div className="profile-Update">
        <div className="profile-pass-update">
            <h1>RESET PASSWORD</h1>
            <form onSubmit={resestPasswordSubmit}>
        
                {/* New Password */}
                <div className="input-group">
                   <input
                    type="password"
                    name="password"
                    placeholder=" Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                   />
                </div>
                {/* Confirm Password */}
                <div className="input-group">
                  <input
                    type="password"
                    name="confirmpassword"
                    placeholder="Confirm Password"
                    value={confirmpassword}
                    onChange={(e) => setConfirmpassword(e.target.value)}
                   />
                {/* Submit Button */}
                </div>
                <button type="submit" className="auth-btn">
                    Reset Password
                </button>
            </form>
        </div>
    </div>
    </div>
    </>
  )
}

export default PassReset
