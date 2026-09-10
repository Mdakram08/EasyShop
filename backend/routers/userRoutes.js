import express from "express";
import { userLogin, userRegister ,userLogout, requestPasswordReset, resetPassword, userProfileDetails, updatePassword, updateUserDetails, getAdminUsers,getAdminSingleUser,adminUpdateUserRole, deleteAdminuser} from "../controllers/userControllers.js";
import { userAuth,userBasedRoles } from "../utils/userAuth.js";

const router = express.Router();

//user register
router.post("/user/register",userRegister);
//user login
router.post("/user/login",userLogin);
//user logout
router.post("/user/logout",userLogout);
//user forget password
router.post("/user/forgot/password",requestPasswordReset);
//user forget password token email sending
router.put("/user/reset/:token",resetPassword);
//user profile
router.get("/user/profile",userAuth,userProfileDetails);
//user change password
router.put("/user/change/password",userAuth,updatePassword);
//user update profile
router.put("/user/profile/update",userAuth,updateUserDetails);
//admin all users
router.get("/admin/users",userAuth,userBasedRoles("admin"),getAdminUsers);
//admin get single user
router.get("/admin/users/:id",userAuth,userBasedRoles("admin"),getAdminSingleUser);
//admin user role update
router.put("/admin/users/:id",userAuth,userBasedRoles("admin"),adminUpdateUserRole);
//admin user delete
router.delete("/admin/users/:id",userAuth,userBasedRoles("admin"),deleteAdminuser);


export default router;