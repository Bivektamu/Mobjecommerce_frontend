import { createSlice } from "@reduxjs/toolkit";
import { RootState, CartSlice, Action } from "../types";
import { useSelector } from "react-redux";

const initialState: CartSlice = {
    cart: JSON.parse(localStorage.getItem('cart') as string) || [],
    action: null
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: initialState,
    reducers: {
        addToCart: (state, action) => {
            state.cart.push(action.payload)
            state.action = Action.ADD
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        removeFromCart: (state, action) => {
            state.cart = state.cart.filter(cartItem => cartItem.id !== action.payload)
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },

        updateCartQuantity: (state, action) => {
            const cart = state.cart.find(cart => cart.id === action.payload.id)
            if (cart) cart.quantity = action.payload.quantity
            state.action = Action.EDIT
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        upDateCart: (state, action) => {
            state.cart = action.payload
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        deleteCart: (state, action) => {
            const carts = state.cart.filter(cart => cart.id !== action.payload)
            state.cart = carts
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        deleteCartByCustomerId: (state, action) => {
            let carts = state.cart
            if(action.payload === 'guest') {
                carts = state.cart.filter(cart => cart.userId)
            }
            else {
                carts = state.cart.filter(cart => cart.userId !== action.payload)
            }
            state.cart = carts
            localStorage.setItem('cart', JSON.stringify(state.cart))
        },
        resetCartAction: (state) => {
            state.action = null
        }
    }
})

export const { addToCart, removeFromCart, updateCartQuantity, upDateCart, deleteCart, deleteCartByCustomerId, resetCartAction } = cartSlice.actions;

export const useCart = ()=> useSelector((state: RootState) => state.cart)

export default cartSlice.reducer;