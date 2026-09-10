import React, { useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/pageTitle";
import "./AdminUsers.css";
import { useDispatch, useSelector } from "react-redux";
import { deleteUser, getUsers, removeError,removeMessage } from "../features/adminSlice";

import { FaEdit, FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

const AdminUsers = () => {

  const {users,loading,error,success,message} = useSelector((state) => state.admin);
  const { user, loading: userLoading, isAuthenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete=(id)=>{
    const confrim=window.confirm("Are you sure that you want to delete this user?");
    if(confrim){
      dispatch(deleteUser(id));
    }
  }

  useEffect(() => {
    if (!userLoading && !isAuthenticated) {
      toast.error("Please login to access Admin Panel", {position: "top-center",autoClose: 2000});
      navigate("/login");
    }
  }, [userLoading, isAuthenticated, navigate]);

  useEffect(() => {
    if (!userLoading && isAuthenticated && user?.role !== "admin") {
      toast.error("You are not authorized to access Admin Panel", {position: "top-center",autoClose: 2000});
      navigate("/");
    }
  }, [userLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (!userLoading && isAuthenticated && user?.role === "admin") {
      dispatch(getUsers());
    }
  }, [dispatch, userLoading, isAuthenticated, user]);

  useEffect(() => {
    if (error) {
      toast.error(error, {position: "top-center",autoClose: 2000});
      dispatch(removeError());
    }
    if (success) { // Checks whether an error exists
      toast.success(message, {position: "top-center",autoClose: 2000});
      dispatch(removeMessage());
      dispatch(getUsers());
      navigate("/admin/users"); 
    }
  }, [error, dispatch,message]);

  if (userLoading || loading) {
    return (
      <>
        <Navbar />
        <Loader />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <PageTitle title="Admin - Users" />

      <div className="admin-users-container">

        <div className="admin-users-header">
          <div>
            <h1>Registered Users</h1>
            <p>Manage all registered users</p>
          </div>

          <div className="total-users">
            Total Users: <strong>{users.length}</strong>
          </div>
        </div>

        {loading ? (
          <div className="users-loading">
            <h2>Loading Users...</h2>
          </div>
        ) : users.length === 0 ? (
          <div className="no-users">
            <h2>No Registered Users Found</h2>
          </div>
        ) : (
          <div className="users-table-container">

            <table className="users-table">

              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Registered Date</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>

                {users.map((user, index) => (
                  <tr key={user._id}>
                    {/* user index */}
                    <td>{index + 1}</td>
                    {/* user name */}
                    <td className="user-name">
                      {user.name}
                    </td>
                    {/* user email */}
                    <td>
                      {user.email}
                    </td>
                    {/* user role */}
                    <td>
                      <span
                        className={
                          user.role === "admin"
                            ? "user-role admin-role"
                            : "user-role"
                        }
                      >
                        {user.role}
                      </span>
                    </td>
                    {/* user Creted At */}
                    <td>
                      {user.createdAt
                        ? new Date(
                            user.createdAt
                          ).toLocaleDateString("en-IN")
                        : "N/A"}
                    </td>
                    {/* user Action Buttons */}
                    <td>
                      <div className="user-actions">
                        {/* user Edit button */}
                        <button
                          className="edit-user-btn"
                          onClick={() =>
                            navigate(
                              `/admin/users/${user._id}`
                            )
                          }
                        >
                          <FaEdit />
                          Edit
                        </button>
                        
                        {/* user delete Buttons */}
                        <button
                          className="delete-user-btn"
                          onClick={() => {console.log(user._id);handleDelete(user._id)}}
                        >
                          <FaTrash />
                          Delete
                        </button>

                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default AdminUsers;
