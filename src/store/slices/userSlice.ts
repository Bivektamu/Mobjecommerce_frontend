import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Action, UserInput, UserSlice, Status, RootState, Address, User, ResponseError, ErrorCode, UserId } from "../types";
import client from "../../data/client";
import { CREATE_USER } from "../../data/mutation/users.mutation";
import { GET_USER } from "../../data/query/user.query";
import { stripTypename } from "@apollo/client/utilities";
import { useSelector } from "react-redux";
import { ApolloError } from "@apollo/client";

const initialState: UserSlice = {
    status: Status.IDLE,
    error: null,
    users: [],
    user: null,
    action: null
}

export const createUser = createAsyncThunk<
    User,
    UserInput,
    { rejectValue: ResponseError }

>('/user/add', async (
    formData: UserInput,
    { rejectWithValue }
) => {
    try {
        const response = await client.mutate({
            mutation: CREATE_USER,
            variables: { input: formData }
        })
        return response.data.createUser.id

    } catch (err) {
        if (err instanceof ApolloError) {
            const error = err.graphQLErrors[0]
            if (error) {
                return rejectWithValue({
                    message: error.message as string,
                    code: error.extensions.code as ErrorCode,
                    extras: error.extensions.extras as Record<string, string>
                })
            }

            if (err.networkError) {
                return rejectWithValue({
                    message: 'Network Error',
                    code: ErrorCode.NETWORK_ERROR,
                })
            }
        }

        return rejectWithValue({
            message: 'Unexpected Error',
            code: ErrorCode.INTERNAL_SERVER_ERROR
        })
    }
})


export const getUser = createAsyncThunk<
    User,
    UserId,
    { rejectValue: ResponseError }
>(`/user/:id`, async (
    id,
    { rejectWithValue }
) => {
    try {
        const response = await client.query({
            query: GET_USER,
            variables: { userId: id }
        })

        return response.data.user

    } catch (err) {
        if (err instanceof ApolloError) {
            const error = err.graphQLErrors[0]
            if (error) {
                return rejectWithValue({
                    message: error.message as string,
                    code: error.extensions.code as ErrorCode,
                    extras: error.extensions.extras as Record<string, string>
                })
            }

            if (err.networkError) {
                return rejectWithValue({
                    message: 'Network Error',
                    code: ErrorCode.NETWORK_ERROR,
                })
            }
        }

        return rejectWithValue({
            message: 'Unexpected Error',
            code: ErrorCode.INTERNAL_SERVER_ERROR
        })
    }
})


const userSlice = createSlice({
    name: 'users',
    initialState: initialState,
    reducers: {
        resetUserAction: (state: UserSlice) => {
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
                state.error = action.payload as ResponseError
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
                state.error = action.payload as ResponseError
                state.status = Status.REJECTED
                state.user = null
            })

    }
})
export const { resetUserAction } = userSlice.actions
export const useUser = () => useSelector((state: RootState) => state.user)
export default userSlice.reducer;
