// Import React and useState hook
import React, { useState } from "react";
// Import common components
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import { userChangePassword,removeError,removeSuccess } from "../features/userSlice";
import { useSelector, useDispatch, } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../pagesStyling/UpdatePassword.css"

const UpdatePassword = () => {
    const{loading,error,success,isAuthenticated}=useSelector((state)=>state.user);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    // State for old password
    const [oldpassword, setOldpassword] = useState("");
    // State for new password
    const [newpassword, setNewpassword] = useState("");
    // State for confirm password
    const [confirmpassword, setConfirmpassword] = useState("");
    // Function runs when form is submitted
    const changePassword = (e) => {
        // Prevent page refresh
        e.preventDefault();
        // Create FormData object
        const myForm = new FormData();
        // Add old password
        myForm.set("oldpassword", oldpassword);
        // Add new password
        myForm.set("newpassword", newpassword);
        // Add confirm password
        myForm.set("confirmpassword", confirmpassword);
        // Display values in console (for testing)
        // Later you can dispatch your Redux action here
        dispatch(userChangePassword(myForm));
    };
    useEffect(()=>{
        if(error){
          toast.error(error,{position:'top-center',autoClose:2000})
          dispatch(removeError())
        }
    },[dispatch,error])
    useEffect(()=>{
        if(success){
          toast.success("Password Changed",{position:'top-center',autoClose:2000})
          dispatch(removeSuccess());
          navigate("/")
        }
    },[dispatch,success])

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    return (
    <>
    {/* Navbar */}
    <Navbar />
    {/* Browser page title */}
    <PageTitle title="Update Password" />        
    <div className="profile-Update">
        <div className="profile-pass-update">
            <h1>UPDATE PASSWORD</h1>
            <form onSubmit={changePassword}>
                {/* Old Password */}
                <div className="input-group">
                  <input
                    type="password"
                    name="oldpassword"
                    placeholder="Old Password"
                    value={oldpassword}
                    onChange={(e) => setOldpassword(e.target.value)}
                  />
                </div>
                
                {/* New Password */}
                <div className="input-group">
                   <input
                    type="password"
                    name="newpassword"
                    placeholder="New Password"
                    value={newpassword}
                    onChange={(e) => setNewpassword(e.target.value)}
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
                   {loading?"Updating Password ":"Update Password"}
                </button>
       
            </form>
        </div>
    </div>
    {/* Password Update Form */}   
    {/* Footer */}
    <Footer />
    </>
    );
};

export default UpdatePassword;