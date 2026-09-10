import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

// get all products fro admin
export const allAdminProducts = createAsyncThunk(
  "admin/allAdminProducts",
  async (_,{ rejectWithValue }) => {
    try { 
      const adminProducts="/api/admin/products";
      const {data}=await axios.get(adminProducts);
      return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Products"
      );
    }
  }
);

//create Product
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async (productData,{ rejectWithValue }) => {
    try { 
      const confiq={
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
      const creteProduct="/api/admin/create/product";
      const {data}=await axios.post(creteProduct,productData,confiq);
      return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Create Product"
      );
    }
  }
);

//update Products
export const updateProduct = createAsyncThunk(
  "admin/updateProduct",
  async ({id,myForm},{ rejectWithValue }) => {
    try { 
      const confiq={
        headers:{
          'Content-Type':'multipart/form-data'
        }
      }
      const updateProductApi=`/api/admin/products/${id}`;
      const {data}=await axios.put(updateProductApi ,myForm,confiq);
      return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Update Product"
      );
    }
  }
);

//delete Product
export const deleteProduct = createAsyncThunk(
  "admin/deleteproduct",
  async (id,{ rejectWithValue }) => {
    try { 
      const deleteProductApi=`/api/admin/products/${id}`;
      const {data}=await axios.delete(deleteProductApi);
      return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Delete Product"
      );
    }
  }
);

//fetch all users
export const getUsers = createAsyncThunk(
  "admin/getUsers",
  async (_,{ rejectWithValue }) => {
    try { 
      const getAllUsers=`/api/admin/users`;
      const {data}=await axios.get(getAllUsers);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Users"
      );
    }
  }
);

//fetch single user for admin
export const getSingleUser = createAsyncThunk(
  "admin/getSingleUser",
  async (id,{ rejectWithValue }) => {
    try { 
      const ghetSindleUserDetail=`/api/admin/users/${id}`;
      const {data}=await axios.get(ghetSindleUserDetail);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch User in Detail"
      );
    }
  }
);   

//Update user Role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({id,role},{ rejectWithValue }) => {
    try { 
      const updateRole=`/api/admin/users/${id}`;
      const {data}=await axios.put(updateRole,{role});
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Update User Role!"
      );
    }
  }
);  

//delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUSer",
  async (id,{ rejectWithValue }) => {
    try { 
      const userDelete=`/api/admin/users/${id}`;
      const {data}=await axios.delete(userDelete);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Delete User!"
      );
    }
  }
);  

//fetch orders
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_,{ rejectWithValue }) => {
    try { 
      const allorders=`/api/admin/orders`;
      const {data}=await axios.get(allorders);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Orders!"
      );
    }
  }
);  

//delete orders
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id,{ rejectWithValue }) => {
    try { 
      const orderDel=`/api/admin/orders/${id}`;
      const {data}=await axios.delete(orderDel);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to delete Order!"
      );
    }
  }
); 

//updateOrder status
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({id,status},{ rejectWithValue }) => {
    try { 
      const updOrder=`/api/admin/orders/${id}`;
      const {data}=await axios.put(updOrder,{status});
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Update Order Status!"
      );
    }
  }
);

//fetch all Reviews
export const fetchProductReviews = createAsyncThunk(
  "admin/fetchProductReviews",
  async (id,{ rejectWithValue }) => {
    try { 
      const productReviews=`/api/admin/reviews?id=${id}`;
      const {data}=await axios.get(productReviews);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Product reviews!"
      );
    }
  }
);

//delete REviews 
export const deleteProductReviews = createAsyncThunk(
  "admin/deleteProductReviews",
  async ({id,reviewId},{ rejectWithValue }) => {
    try { 
      const deleteReview=`/api/admin/reviews?id=${id}&reviewId=${reviewId}`;
      const {data}=await axios.delete(deleteReview);
      return data
    } catch (error) {
      console.log(error.message)
      return rejectWithValue(
        error.response?.data || "Failed to Delete Product review!"
      );
    }
  }
);



const adminSlice=createSlice({
    name:'admin',
    initialState:{
        products:[],
        loading:false,
        success:false,
        error:null,
        product:{},
        users:[],
        user:{},
        message:null,
        orders:[],
        totalAmount:0,
        order:{},
        productReview:[]
    },
    reducers:{
      removeError:(state)=>{
        state.error=null
      },
      removeSuccess:(state)=>{
        state.success=false;
      },
      removeMessage:(state)=>{
        state.message=null
      }
    },
    extraReducers:(builder)=>{
      //get all admin product
          builder
          .addCase(allAdminProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(allAdminProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.product;
            state.error = null;
          })
          .addCase(allAdminProducts.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Fetch Products";
          });
          //add product
          builder
          .addCase(createProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(createProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = action.payload.product;
            state.success=action.payload.success;
            state.error = null;
          })
          .addCase(createProduct.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Create Product";
          });
          //updtaeproduct
          builder
          .addCase(updateProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.product = action.payload.product;
            state.success=action.payload.success;
            state.error = null;
          })
          .addCase(updateProduct.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Update Product";
          });
          //Deleteproduct
          builder
          .addCase(deleteProduct.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteProduct.fulfilled, (state, action) => {
            state.loading = false;
            state.products = state.products.filter((product)=>product._id!==action.payload.id);
            state.success=action.payload.success;
            state.error = null;
          })
          .addCase(deleteProduct.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Delete Product";
          });
          //fetch usesr
          builder
          .addCase(getUsers.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getUsers.fulfilled, (state, action) => {
            state.loading = false;
            state.users = action.payload.users
          })
          .addCase(getUsers.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Fetch Users";
          });
          //fetch Single usesr
          builder
          .addCase(getSingleUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(getSingleUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user= action.payload.user
          })
          .addCase(getSingleUser.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Fetch User in Detail";
          });
          //update User role
          builder
          .addCase(updateUserRole.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateUserRole.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.message=action.payload.message
          })
          .addCase(updateUserRole.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Update User Role!";
          });
          //delete user
          builder
          .addCase(deleteUser.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteUser.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.message=action.payload.message
          })
          .addCase(deleteUser.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Delete User!";
          });
          //fetch all orders
          builder
          .addCase(fetchAllOrders.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchAllOrders.fulfilled, (state, action) => {
            state.loading = false;
            state.orders=action.payload.orders;
            state.success=action.payload.success;
            state.totalAmount=action.payload.totalAmount;
          })
          .addCase(fetchAllOrders.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Fetch Orders!";
          });
          // delete orders
          builder
          .addCase(deleteOrder.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteOrder.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.message=action.payload.message
          })
          .addCase(deleteOrder.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Delete Order!";
          });
          //updtae Order STatus
          builder
          .addCase(updateOrderStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(updateOrderStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.order=action.payload.order
          })
          .addCase(updateOrderStatus.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Update Order Status!";
          });
          //Product REviews
          builder
          .addCase(fetchProductReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(fetchProductReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.productReview=action.payload.productReview
          })
          .addCase(fetchProductReviews.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Fetch Product Reviews!";
          });
          //delete review
          builder
          .addCase(deleteProductReviews.pending, (state) => {
            state.loading = true;
            state.error = null;
          })
          .addCase(deleteProductReviews.fulfilled, (state, action) => {
            state.loading = false;
            state.success=action.payload.success;
            state.message=action.payload.message
          })
          .addCase(deleteProductReviews.rejected, (state, action) => {
            state.loading = false;
            state.error =action.payload?.message || action.payload || "Failed to Delete Product Review!";
          });
    }
})


export const {removeError,removeSuccess,removeMessage}=adminSlice.actions;
export default adminSlice.reducer