import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Action, UserInput, UserSlice, Status, RootState, Address } from "../types";
import client from "../../data/client";
import { CREATE_USER, UPDATE_ADDRESS } from "../../data/mutation";
import { GET_USER } from "../../data/query/user.query";
import { stripTypename } from "@apollo/client/utilities";
import { useSelector } from "react-redux";

const initialState: UserSlice = {
    status: Status.IDLE,
    error: null,
    users: [],
    user: null,
    action: null
}

export const createUser = createAsyncThunk('/user/add', async (formData: UserInput) => {
    try {
        const response = await client.mutate({
            mutation: CREATE_USER,
            variables: { input: formData }
        })
        return response.data.createUser.id

    } catch (error) {
        if (error instanceof Error) {
            throw error
        }
    }
})


export const getUser = createAsyncThunk(`/user/:id`, async (id: string) => {
    try {
        const response = await client.query({
            query: GET_USER,
            variables: { userId: id }
        })

        return response.data.user

    } catch (error) {
        if (error instanceof Error) {

            throw error
        }
    }
})



export const updateAddress = createAsyncThunk('/user/updateaddress', async (formData: Address) => {
    // console.log('response.data');

    try {
        const response = await client.mutate({
            mutation: UPDATE_ADDRESS,
            variables: { input: formData }
        })


        return response.data.updateAddress

    } catch (error) {

        if (error instanceof Error) {
            throw error
        }
    }
})


const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        resetUserAction:(state:UserSlice)=> {
            state.action = null
        }
    },
    extraReducers: builder => {
        builder
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = stripTypename(action.payload)
                state.action = Action.FETCH
                state.error = null
                state.status = Status.FULFILLED
            })
            .addCase(getUser.pending, (state) => {
                state.status = Status.PENDING
                state.error = null
            })

            .addCase(getUser.rejected, (state, action) => {
                state.error = action.error.message as string
                state.status = Status.REJECTED
                state.user = null
            })

            .addCase(createUser.fulfilled, (state, action) => {
                state.user = stripTypename(action.payload)
                state.action = Action.ADD
                state.error = null
                state.status = Status.FULFILLED
            })
            .addCase(createUser.pending, (state) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(createUser.rejected, (state, action) => {
                state.error = action.error.message as string
                state.status = Status.REJECTED
                state.user = null
            })

            // Update Address
            .addCase(updateAddress.fulfilled, (state, action) => {
                if (state.user) {
                    state.user.address = stripTypename(action.payload)
                }
                state.action = Action.EDIT
                state.error = null
                state.status = Status.FULFILLED
            })
            .addCase(updateAddress.pending, (state) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(updateAddress.rejected, (state, action) => {
                state.error = action.error.message as string
                state.status = Status.REJECTED

                if (state.user) {
                    state.user.address = {} as Address
                }

            })


    }
})
export const {resetUserAction} = userSlice.actions
export const useUser = () => useSelector((state: RootState) => state.user)
export default userSlice.reducer;
