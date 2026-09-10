import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios"

//get products
export const getProduct = createAsyncThunk(
  "product/getProduct",
  async ({keyword},{ rejectWithValue }) => {
    try {
      const getProduct=keyword?`/api/products?keyword=${encodeURIComponent(keyword)}`:"/api/products"
      const { data } = await axios.get(getProduct);
      return data;
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "An error occured"
      );
    }
  }
);

//get single product details
export const getSingleProduct=createAsyncThunk("product/getSingleProduct",async(id,{rejectWithValue})=>{
    try {
        const getSingleProduct=`/api/products/${id}`;
        const{data}=await axios.get(getSingleProduct);
        
        return data
    } catch (error) {
         console.log("Thunk Error:", error.response?.data);
        return rejectWithValue(
            error.response?.data || "An error occured"
        )
    }
})

//createReview for product
export const createRatingReview=createAsyncThunk("product/creteeRatingReview",async({rating, comment, productId},{rejectWithValue})=>{
    try {
        const config={
          headers:{
            "Content-Type":"application/json"
          }
        }
        const createReviews="/api/admin/reviews"
        const{data}=await axios.put(createReviews,{rating, comment, productId},config);
        return data
    } catch (error) {
         console.log("Thunk Error:", error.response?.data);
        return rejectWithValue(
            error.response?.data || "An error occured"
        )
    }
})

const productSlice=createSlice({
   name:"product",
   initialState:{
    products:[],
    productCount:0,
    loading:false,
    error:null,
    product:null,
    reviewSuccess:false,
    reviewLoading:false,
   },
   reducers:{
    removeError:(state)=>{
        state.error=null
    } ,
    removeSuccess:(state)=>{
      state.reviewSuccess=false
    }
   },
   
   extraReducers: (builder) => {

    //get all products
    builder
    .addCase(getProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.products = action.payload.products; // Store API data
      state.error = null;
    })

    .addCase(getProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
      state.products=[];
    });

    //get single products
    builder
    .addCase(getSingleProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    .addCase(getSingleProduct.fulfilled, (state, action) => {
      state.loading = false;
      state.product = action.payload.product; // Store API data
      state.error = null;
    })

    .addCase(getSingleProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    });
    //creating REview 
    builder
    .addCase(createRatingReview.pending, (state) => {
      state.reviewLoading = true;
      state.error = null;
    })

    .addCase(createRatingReview.fulfilled, (state) => {
      state.reviewLoading = false;
      state.reviewSuccess=true;
      state.error = null;
    })

    .addCase(createRatingReview.rejected, (state) => {
      state.reviewLoading = false;
      state.error = action.payload?.message || "Something went wrong";
    });

   } 
});

export const {removeError,removeSuccess}=productSlice.actions;
export default productSlice.reducer