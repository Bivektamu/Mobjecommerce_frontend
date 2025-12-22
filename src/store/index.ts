import { configureStore } from "@reduxjs/toolkit";
import austSlice from "./slices/authSlice";
import { useDispatch } from "react-redux";
import toastSlice from "./slices/toastSlice";
import productSlice from "./slices/productSlice";
import userSlice from "./slices/userSlice";
import cartSlice from "./slices/cartSlice";

export const Store = configureStore ({
    reducer: {
        auth: austSlice,
        toasts: toastSlice,
        user:userSlice,
        products: productSlice,
        cart: cartSlice,
    }
})

type StoreDispatch = typeof Store.dispatch
export const useStoreDispatch = () => useDispatch<StoreDispatch>()