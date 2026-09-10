import React, { useEffect, useState } from 'react' 
import Navbar from '../components/Navbar' 
import PageTitle from '../components/pageTitle'
import Footer from '../components/Footer' 
import "./UpdateUserRole.css" 
import { useParams } from 'react-router-dom' 
import { useDispatch, useSelector } from 'react-redux' 
import { getSingleUser, updateUserRole ,removeError,removeMessage} from '../features/adminSlice' 
import { useNavigate } from "react-router-dom"; 
import Loader from "../components/Loader.jsx";
import { toast } from "react-toastify"; 

const UpdateUserRole = () => { 
  const {id}=useParams(); // Gets the user ID from the URL, for example /admin/user/update/123
  const {loading,error,success,message}=useSelector((state)=>state.admin); // Gets loading, error and success states from the admin Redux state
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user); // Gets logged-in user, authentication status and loading state from user Redux state
  const dispatch=useDispatch(); 
  const navigate=useNavigate();

  useEffect(()=>{ 
    dispatch(getSingleUser(id)); // Sends the user ID to Redux to fetch that particular user's details
  },[dispatch,id]); // Runs again only when dispatch or id

  // if user Exists
  useEffect(()=>{ // Runs whenever the user value changes
    if(user){ // Checks whether user data exists
      setFromData({ // Updates the form data with the user's information
        name:user.userName || "", // Sets the user's name, or empty string if it doesn't exist
        email:user.email || "", // Sets the user's email, or empty string if it doesn't exist
        role:user.role ||"" // Sets the user's role, or empty string if it doesn't exist
      })
    }
  },[user]) // Runs whenever user changes

  const [formData,setFromData]=useState({ // Creates state for the form fields
    name:"", // Initial name value
    email:"", // Initial email value
    role:"" // Initial role value
  })
  const {name,email,role}=formData // Extracts name, email and role from formData
  const handleChange=(e)=>{ // Function that runs whenever a form input changes
    e.preventDefault(); // Prevents the default browser action
    setFromData({...formData,[e.target.name]:e.target.value}) // Updates the field that was changed
  }
  const handleSubmit=(e)=>{
    e.preventDefault();
    dispatch(updateUserRole({id,role}));
    navigate("/admin/users")
  }

  useEffect(() => { // Checks whether the user is authenticated
    if (!userLoading && !isAuthenticated) { // If loading is finished and the user is not logged in
      toast.error("Please login to access Admin Panel", { // Displays an error message
        position: "top-center", // Places the toast at the top center
        autoClose: 2000 // Automatically closes the message after 2 seconds
      });
      navigate("/login"); // Redirects the user to the login page
    }
  }, [userLoading, isAuthenticated, navigate]); // Runs when these values change

  useEffect(() => { // Checks whether the logged-in user is an admin
    if (!userLoading && isAuthenticated && user?.role !== "admin") { // If logged in but the role is not admin
      toast.error("You are not authorized to access Admin Panel", { // Displays an authorization error
        position: "top-center", // Places the toast at the top center
        autoClose: 2000 // Automatically closes the message after 2 seconds
      });
      navigate("/"); // Redirects unauthorized users to the home page
    }
  }, [userLoading, isAuthenticated, user, navigate]); // Runs when authentication or user information changes
  
  useEffect(() => { // Runs when authentication/user information changes
    if (!userLoading && isAuthenticated && user?.role === "admin") { // Checks whether the logged-in user is an authenticated admin
    }
  }, [dispatch, userLoading, isAuthenticated, user]); // Dependencies for this effect
  
  useEffect(() => { // Watches for errors from Redux
    if (error) { // Checks whether an error exists
      toast.error(error, { // Displays the Redux error using a toast
        position: "top-center", // Places the toast at the top center
        autoClose: 2000 // Automatically closes the message after 2 seconds
      });
      dispatch(removeError()); // Clears the error from Redux
    }
    if (success) { // Checks whether an error exists
      toast.success(message, { // Displays the Redux error using a toast
        position: "top-center", // Places the toast at the top center
        autoClose: 2000 // Automatically closes the message after 2 seconds
      });
      dispatch(removeMessage()); // Clears the error from Redux
    }
  }, [error, dispatch,success,message]); // Runs whenever error changes
  
  if (userLoading || loading) { // Checks if either user data or admin data is loading
    return ( // Stops rendering the page and shows the loader
      <>
        <Navbar /> // Displays the Navbar while loading
        <Loader /> // Displays the loading animation
        <Footer /> // Displays the Footer while loading
      </>
    );
  }
  
  return ( // Renders the actual page
    <>
    <Navbar/> 
    <PageTitle title="UpdateUser-Role"/> 
    <div className="page-wrapper">
      <div className="update-user-role"> 
        <h1>Update User Role</h1> 
        <form action="" className="updateUserRole-form" onSubmit={handleSubmit}> 
          <div className="form-group">
            <label htmlFor="name"></label> 
            <input type="text" name="name" id="name" required readOnly value={name}/> 
          </div>
          <div className="form-group">
            <label htmlFor="email"></label> 
            <input type="email" name="email" id="email" required readOnly value={email}/> 
          </div>
          <div className="form-group">
            <label htmlFor="role"></label> 
            <select name="role" id="role" required onChange={handleChange} > 
              <option value="">Select Role</option> 
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <button>Update User</button> 
        </form>
      </div>
    </div>
    <Footer/> 
    </>
  )
}
export default UpdateUserRole // Exports the component so it can be used in other files