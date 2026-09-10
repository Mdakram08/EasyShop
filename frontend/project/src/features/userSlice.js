import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

//register user
export const userRegister = createAsyncThunk(
  "user/register",
  async (userData,{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          'Content-type':'multipart/form-data'
        }
      }
      const register="/api/user/register"
      const { data } = await axios.post(register,userData,config);
      console.log(data)
      return data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Registration Failed try again.."
      );
    }
  }
);

//login user
export const userLogin = createAsyncThunk(
  "user/login",
  async ({email,password},{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          'Content-type':'application/json'
        }
      }
      const login="/api/user/login"
      const { data } = await axios.post(login,{email,password},config);
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Login Failed try again.."
      );
    }
  }
);

//user profile 
export const userProfile=createAsyncThunk("user/profile",async(_,{rejectWithValue})=>{
  try {
    const userProfile="/api/user/profile"
    const {data}= await axios.get(userProfile);
    return data
  } catch (error) {
    return rejectWithValue(
        error.response?.data || "Failed to load User try again.."
      );
  }
})

//user Logout
export const userLogout = createAsyncThunk(
  "user/logout",
  async (_,{ rejectWithValue }) => {
    try {
      const userLogout="/api/user/logout"
      const { data } = await axios.post(userLogout,{},{withCredentials:true});
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed to log-OUT try again.."
      );
    }
  }
);

// /user/profile/update
export const userProfileUpdate = createAsyncThunk(
  "user/profile/update",
  async (userData,{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          "Content-Type":"multipart/form-data"
        }
      }
      const userProfileUpdate="/api/user/profile/update"
      const { data } = await axios.put(userProfileUpdate,userData,config);
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Profile could not update try again later.."
      );
    }
  }
);

//user update password
export const userChangePassword = createAsyncThunk(
  "user/change/password",
  async (userData,{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      }
      const userUpdatePassword="/api/user/change/password"
      const { data } = await axios.put(userUpdatePassword,userData,config);
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Password could not update try again later.."
      );
    }
  }
);

//user Forgot Password
export const userForgotPassword = createAsyncThunk(
  "user/forgot/password",
  async (userData,{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          "Content-Type":"application/json"
        },
        withCredentials:true
      }
      const userForgotPassword="/api/user/forgot/password"
      const { data } = await axios.post(userForgotPassword,userData,config);
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To send Reset Link !"
      );
    }
  }
);

//user Reset Password
export const userPasswordReset = createAsyncThunk(
  "user/reset/password",
  async ({userData,token},{ rejectWithValue }) => {
    try {
      const config={
        headers:{
          "Content-Type":"multipart/form-data"
        },
        withCredentials:true
      }
      const userPasswordReset=`/api/user/reset/${token}`
      
      const { data } = await axios.put(userPasswordReset,userData,config);
      console.log(data)
      return data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || "Failed To Reset Password !"
      );
    }
  }
);


const userSlice=createSlice({
    name:"user",
    initialState:{
        loading:false,
        error:null,
        user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')) : null,
        isAuthenticated:localStorage.getItem('isAuthenticated')==='true',
        success:false,
        message:null
    },
    reducers:{
     removeError:(state)=>{
        state.error=null
     },
     removeSuccess:(state)=>{
        state.success=null
     }
    },     
    extraReducers: (builder) => {
    builder
    // Registration
    .addCase(userRegister.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userRegister.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.success = action.payload.success;
      state.isAuthenticated = Boolean(action.payload?.user);
      // localstorage to maintain user data afeter page refresh
      localStorage.setItem('user',JSON.stringify(state.user));
      localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
      state.error = null;
    })
    .addCase(userRegister.rejected, (state, action) => {
      state.loading = false;
      state.error =
      action.payload?.message || action.payload || "Login Failed, try again";
      state.user = null;
      state.isAuthenticated = false;
    })

    // Login
    builder
    .addCase(userLogin.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.success = action.payload.success;
      state.isAuthenticated = Boolean(action.payload?.user);
       // localstorage to maintain user data afeter page refresh
      localStorage.setItem('user',JSON.stringify(state.user));
      localStorage.setItem('isAuthenticated',JSON.stringify(state.isAuthenticated));
      state.error = null;
    })
    .addCase(userLogin.rejected, (state, action) => {
      state.loading = false;
      state.error =
      action.payload?.message || action.payload || "Login Failed, try again";
      state.user = null;
      state.isAuthenticated = false;
    });

    //user profile
    builder
    .addCase(userProfile.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload?.user || null;
      state.isAuthenticated = Boolean(action.payload?.user);
      localStorage.setItem('user',JSON.stringify(state.user));
      localStorage.setItem('isAuthenticated','true');
      state.error = null;
    })
    .addCase(userProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || action.payload || "Failed to load User Profile";
      state.user = null;
      state.isAuthenticated = false;
      if(action.payload.statusCode===401){
        state.user=null,
        state.isAuthenticated=false
        localStorage.removeItem('user'),
        localStorage.removeItem('isAuthenticated')
      }
    });
    
    //user logout 
    builder
    .addCase(userLogout.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userLogout.fulfilled, (state, action) => {
      state.loading = false;
      state.user =  null;
      state.isAuthenticated = false;
      state.error = null;
      localStorage.removeItem('user'),
      localStorage.removeItem('isAuthenticated')
    })
    .addCase(userLogout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to Logout User";
    });
    //user profile update 
    builder
    .addCase(userProfileUpdate.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userProfileUpdate.fulfilled, (state, action) => {
      state.loading = false;
      state.user =  action.payload.user;
      state.message=action.payload?.message ;
      state.success=action.payload?.success
      state.isAuthenticated = Boolean(action.payload?.user);
      state.error = null;
    })
    .addCase(userProfileUpdate.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to Update user profile";
    });
    //user password update
    builder
    .addCase(userChangePassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userChangePassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success=action.payload?.success
      state.isAuthenticated = Boolean(action.payload?.user);
      state.error = null;
    })
    .addCase(userChangePassword.rejected, (state, action) => {
      state.loading = false;
      state.error =typeof action.payload === "string" ? action.payload: action.payload?.message || "Failed to Update user Password";
    });
    //user forgot password
    builder
    .addCase(userForgotPassword.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userForgotPassword.fulfilled, (state, action) => {
      state.loading = false;
      state.success=action.payload?.success
      state.message=action.payload?.message
      state.error = null;
    })
    .addCase(userForgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error =typeof action.payload === "string" ? action.payload: action.payload?.message || "Failed To send Reset Link !";
    });
    //user password REset
    builder
    .addCase(userPasswordReset.pending, (state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(userPasswordReset.fulfilled, (state, action) => {
      state.loading = false;
      state.success=action.payload?.success
      state.message=action.payload?.message
      state.isAuthenticated=false
      state.user=null
      state.error = null;
    })
    .addCase(userPasswordReset.rejected, (state, action) => {
      state.loading = false;
      state.error =typeof action.payload === "string" ? action.payload: action.payload?.message || "Failed To Reset Password !";
    });

}

})

export const{removeError,removeSuccess}=userSlice.actions
export default userSlice.reducer
