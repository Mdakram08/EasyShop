import "../pagesStyling/UserProfile.css"
import { Link  ,useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import {  userLogout,removeError, removeSuccess } from '../features/userSlice';
import Loader from "../components/Loader";
import { useEffect } from "react";
import { toast } from "react-toastify";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";



const  Profile = () => {
  const { user,error,loading,isAuthenticated} = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //logout handleer function
  const logoutHandler = async () => {
     try {
      const result = await dispatch(userLogout());
     if (userLogout.fulfilled.match(result)) {
        toast.success("Successfully logged out",{position:'top-center',autoClose:2000})
      navigate("/");
     }
     } catch (error) {
      console.log(error)
     }
  };
  
  useEffect(()=>{
    if(error){
      toast.error(error,{position:'top-center',autoClose:2000})
       dispatch(removeError())
    }
  },[dispatch,error])


  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate("/login");
    }
  }, [loading, isAuthenticated, navigate]);

  if(loading || !user){
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
    <PageTitle title="Profile"/>
    <Navbar/>
    <div className="profile-page">
      <div className="profile-card">
        <h2><b>MY PROFILE</b></h2>
        <img
          src={user?.avatar?.url || "/profile.jpeg"}
          alt="Profile"
          className="profile-image"
        />

        <h2>{user?.userName}</h2>
 
        <p>Email : {user?.email}</p>

        <p>
          Joined-AT:{" "}
          {user?.createdAt
            ? new Date(user.createdAt).toLocaleDateString("en-IN")
            : ""}
        </p>

        <div className="profile-buttons">
          <Link to="/user/orders" className="profile-btn">
            My Orders
          </Link>

          <button
            className="profile-btn logout-btn"
            onClick={logoutHandler}
          >
            <b>Logout</b>
          </button>

          {user?.role === "admin" && (
          <Link to="/admin/dashboard" className="profile-btn admin-badge">
            Admin Dashboard
          </Link>
          )}
        </div>

        <div className="customize-section">
          <Link to="/user/change/password" className="profile-btn change-password">
            reset Password
          </Link>
           <Link to="/user/profile/update" className="profile-btn">
            Edit Profile
          </Link>
        </div>
      </div>
    </div>
    <Footer/>
  </>
  );
};

export default Profile;