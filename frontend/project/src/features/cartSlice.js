import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

//add items to cart
export const addItemtoCart = createAsyncThunk(
  "cart/additems",
  async ({id,quantity},{ rejectWithValue }) => {
    try { 
      const {data}=await axios.get(`/api/products/${id}`);
      return {
        product:data.product._id,
        name:data.product.name,
        price:data.product.price,
        image: data.product.image?.[0]?.url,
        // image:data.product.image.url,
        stock:data.product.stock,
        quantity
      }
    } catch (error) {
      console.log(error)
      return rejectWithValue(
        error.response?.data || "An error occured"
      );
    }
  }
);

const cartSlice=createSlice({
    name:'cart',
    initialState:{
        cartItems:JSON.parse(localStorage.getItem("cartItems"))||[],
        loading:false,
        error:null,
        success:false,
        message:null,
        removingId:null,
        shippingInfo:JSON.parse(localStorage.getItem("shippingInfo"))||{}
    },
    reducers:{
        removeError:(state)=>{
            state.error=null
        },
        removeMessage:(state)=>{
            state.message=null
        },
        removeItemFromCart:(state,action)=>{
          state.removingId=action.payload,
          state.cartItems=state.cartItems.filter((item)=>item.product!==action.payload)
          localStorage.setItem("cartItems",JSON.stringify(state.cartItems))
          state.removingId=null
        },
        saveShippingInfo:(state,action)=>{
          state.shippingInfo=action.payload,
          localStorage.setItem("shippingInfo",JSON.stringify(state.shippingInfo))
        },
        clearCart:(state)=>{
          state.cartItems=[],
          localStorage.removeItem('cartItems');
          localStorage.removeItem('shippingInfo')
        }
    },
    extraReducers:(builder)=>{
        //add items to cart
        builder
        .addCase(addItemtoCart.pending,(state)=>{
            state.loading = true;
            state.error = null;
        })
        .addCase(addItemtoCart.fulfilled,(state,action)=>{
            const item = action.payload; // Store API 
            const existingItem=state.cartItems.find((i)=>i.product===item.product)
            if(existingItem){
              existingItem.quantity=item.quantity;
              state.message=`Updated ${item.name} quantity in cart`;
            }else{
              state.cartItems.push(item);
              state.message=`${item.name} added to cart Sucessfully`;
            }
            console.log("item",item)
            state.loading = false;
            state.success=true
            localStorage.setItem('cartItems',JSON.stringify(state.cartItems))
        })
        .addCase(addItemtoCart.rejected,(state,action)=>{
            state.loading = false;
            state.error = action.payload?.message || "Something went wrong";
        })
    }
})
export const {removeError,removeMessage,removeItemFromCart,saveShippingInfo,clearCart}=cartSlice.actions
export default cartSlice.reducer