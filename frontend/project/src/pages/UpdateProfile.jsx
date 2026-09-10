import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageTitle from '../components/pageTitle'
import { toast } from 'react-toastify'
import { userProfileUpdate, removeError, removeSuccess } from '../features/userSlice'
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom'
import "../pagesStyling/UpdateProfile.css"

const UpdateProfile = () => {

    const { user, loading, error, message, success ,isAuthenticated} = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [userName, setUserName] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("");
    const [avatarPreview, setAvatarPreview] = useState("/profile.jpeg");

    const profileImageUpdate = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result);
                setAvatar(reader.result);
            }
        };

        reader.onerror = (error) => {
            toast.error(error);
        };

        reader.readAsDataURL(file);
    };

    const updateSubmit = (e) => {
        e.preventDefault();

        const myForm = new FormData();
        myForm.set("userName", userName);
        myForm.set("email", email);
        myForm.set("avatar", avatar);

        dispatch(userProfileUpdate(myForm));
    };

    useEffect(() => {
        if (user) {
            setUserName(user.userName);
            setEmail(user.email);

            if (!avatar) {
                setAvatarPreview(user.avatar?.url || "/profile.jpeg");
            }
        }
    }, [user, avatar]);

    useEffect(() => {
        if (error) {
            toast.error(error, {
                position: "top-center",
                autoClose: 2000,
            });
            dispatch(removeError());
        }
    }, [dispatch, error]);

    useEffect(() => {
        if (success) {
            toast.success(message, {
                position: "top-center",
                autoClose: 2000,
            });
            dispatch(removeSuccess());
            navigate("/user/profile");
        }
    }, [dispatch, success]);

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login");
        }
    }, [loading, isAuthenticated, navigate]);

    return (
        <>
            <Navbar />
            <PageTitle title="Update Profile" />

            <div className="upd-container">
                <div className="upd-form-content">
                    <form
                        className="upd-form"
                        encType="multipart/form-data"
                        onSubmit={updateSubmit}
                    >
                        <h2>UPDATE PROFILE</h2>

                        <img
                            className="upd-profile-image"
                            src={avatarPreview}
                            alt="profile-pic"
                        />

                        <input
                            type="file"
                            className="upd-file-input"
                            accept="image/*"
                            name="avatar"
                            onChange={profileImageUpdate}
                        />

                        <div className="upd-input-group">
                            <input
                                type="text"
                                name="userName"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                            />
                        </div>

                        <div className="upd-input-group">
                            <input
                                type="email"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className="upd-auth-btn"
                            disabled={loading}
                        >
                            {loading ? "Updating..." : "Update"}
                        </button>
                    </form>
                </div>
            </div>

            <Footer />
        </>
    );
};

export default UpdateProfile;