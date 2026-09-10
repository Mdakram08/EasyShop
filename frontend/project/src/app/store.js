import { configureStore, createReducer } from "@reduxjs/toolkit";
import productReducer from "../features/productSlice";
import userReducer from "../features/userSlice";
import cartReducer from "../features/cartSlice"
import orderReducer from "../features/orderSlice"
import adminReducer from "../features/adminSlice"

const store = configureStore({
    reducer: {
        product: productReducer,
        user:userReducer,
        cart:cartReducer,
        order:orderReducer,
        admin:adminReducer
    },
});

export default store