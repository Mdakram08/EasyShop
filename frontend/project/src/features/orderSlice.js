import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";


//create order
export const createOrder = createAsyncThunk(
  "order/createorder",
  async (order,{ rejectWithValue }) => {
    try {
        const config={
            headers:{
               "Content-Type":"application/json",
            }
        };
        const {data}=await axios.post("/api/new/order",order,config);
        // console.log(data.order);
        return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to create Order"
      );
    }
  },
);

//get all order
export const getAllMyorders = createAsyncThunk(
  "order/getAllMyorders",
  async (_,{ rejectWithValue }) => {
    try {
        const {data}=await axios.get("/api/user/orders");
        return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Orders"
      );
    }
  },
);

//get singleOrder
export const getSingleorder = createAsyncThunk(
  "order/getSingleorders",
  async (orderId,{ rejectWithValue }) => {
    try {
        const {data}=await axios.get(`/api/user/orders/${orderId}`);
        return data
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "Failed to Fetch Order Details"
      );
    }
  },
);

const orderSlice=createSlice({
    name:'order',
    initialState:{
        loading:false,
        error:null,
        success:false,
        order:{},
        orders:[]
    },
    reducers:{
        removeError:(state)=>{
            state.error=null
        },
        removeSuccess:(state)=>{
            state.success=false
        },
    },
    extraReducers:(builder)=>{
        builder.addCase(createOrder.pending,(state)=>{
           state.loading = true;
           state.error = null;
        })
        .addCase(createOrder.fulfilled,(state,action)=>{
            state.loading=false,
            state.success=action.payload.success;
            state.order=action.payload.order
        })
        .addCase(createOrder.rejected,(state,action)=>{
           state.loading = false;
           state.error = action.payload?.message || "Failed to create Order";
        }),
        //get all order
        builder.addCase(getAllMyorders.pending,(state)=>{
           state.loading = true;
           state.error = null;
        })
        .addCase(getAllMyorders.fulfilled,(state,action)=>{
            state.loading=false,
            state.orders=action.payload.orders
        })
        .addCase(getAllMyorders.rejected,(state,action)=>{
           state.loading = false;
           state.error = action.payload?.message || "Failed to create Order";
        })
        //get single order
        builder.addCase(getSingleorder.pending,(state)=>{
           state.loading = true;
           state.error = null;
        })
        .addCase(getSingleorder.fulfilled,(state,action)=>{
            state.loading=false,
            state.order=action.payload.order
        })
        .addCase(getSingleorder.rejected,(state,action)=>{
           state.loading = false;
           state.error = action.payload?.message || "Failed to Fetch order Details";
        })
    }
})

export const{removeError,removeSuccess}=orderSlice.actions;
export default orderSlice.reducer