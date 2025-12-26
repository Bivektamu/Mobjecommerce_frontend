import { createSlice } from "@reduxjs/toolkit";
import { RootState, ToastSlice } from "../types";
import { useSelector } from "react-redux";

const initialState: ToastSlice = {
    toasts: []
}

const toastSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        addToast: (state: ToastSlice, action) => {
            const toastExists = state.toasts.findIndex(toast => toast.msg === action.payload.msg)
            if (toastExists < 0)
                state.toasts.push(action.payload)
        },
        removeToast: (state: ToastSlice, action) => {
            state.toasts = state.toasts.filter(toast => toast.id !== action.payload)
            // state.toasts.splice(0,1)
            // state.toasts = state.toasts.filter(toast => toast !== action.payload)
        }
    }
})

export default toastSlice.reducer
export const { addToast, removeToast } = toastSlice.actions
export const useToasts = () => useSelector((state: RootState) => state.toasts.toasts)