import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, Status, RootState, Role, ErrorCode, LoginResponse, LoginInput, CustomJwtPayload, AuthUser } from "../types";
import client from "../../data/client";
import { LOGIN_ADMIN, LOGIN_USER } from "../../data/mutation";
import { GET_AUTH } from "../../data/query";
import { jwtDecode } from "jwt-decode";
import { stripTypename } from "@apollo/client/utilities";
import { useSelector } from "react-redux";

const initialState: Auth = {
    isLoggedIn: false,
    authUser: null,
    status: Status.IDLE,
    error: null,
}

export const loginAdmin = createAsyncThunk('/admin/login', async ({ email, password }: Partial<Pick<LoginInput, 'email' | 'password'>>) => {

    try {
        const response = await client.mutate({
            mutation: LOGIN_ADMIN,
            variables: { input: { email, password } }
        })

        const token = response.data.logInAdmin.token
        if (token) {
            return token
        }
    } catch (error) {
        if (error instanceof Error)
            throw error
    }
})


export const logInUser = createAsyncThunk<LoginResponse, LoginInput>(
    '/user/login',
    async ({ email, password }) => {

        try {
            const response = await client.mutate({
                mutation: LOGIN_USER,
                variables: { input: { email, password } }
            })

            const token = response.data?.logInUser?.token
            // console.log(token)
            if (token) {
                return token
            }
        } catch (error) {
            localStorage.setItem('token', '')

            if (error instanceof Error) {
                throw error
            }
        }

    })


export const getAuthStatus = createAsyncThunk('/getAuth', async () => {

    try {
        const response = await client.query({
            query: GET_AUTH,
        })

        return response.data.getAuthStatus


    } catch (error) {
        if (error instanceof Error)
            throw error
    }
})


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            state.status = Status.IDLE

            client.resetStore()
            localStorage.setItem('token', '')
            state.isLoggedIn = false
            state.authUser = null
            state.status = Status.FULFILLED

        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginAdmin.pending, (state: Auth) => {
                state.status = Status.PENDING
            })
            .addCase(loginAdmin.fulfilled, (state: Auth, action) => {
                client.resetStore()
                localStorage.setItem('token', action.payload)
                state.status = Status.FULFILLED
                state.error = null

                const authUser: AuthUser = {
                    role: Role.ADMIN,
                    id: ''
                }
                state.authUser = authUser
                state.isLoggedIn = true

            })
            .addCase(loginAdmin.rejected, (state: Auth, action) => {
                localStorage.setItem('token', '')
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                state.error = {
                    msg: action.error.message as string
                }
            })

            .addCase(logInUser.pending, (state: Auth) => {
                state.status = Status.PENDING
            })
            .addCase(logInUser.fulfilled, (state: Auth, action) => {

                client.resetStore()

                const decode_user = jwtDecode<CustomJwtPayload>(action.payload)
                if (decode_user) {

                    localStorage.setItem('token', action.payload)
                    state.status = Status.FULFILLED
                    state.isLoggedIn = true
                    const authUser: AuthUser = {
                        role: decode_user.role,
                        id: decode_user.id
                    }
                    state.authUser = authUser
                    state.error = null

                }


            })
            .addCase(logInUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                state.error = {
                    msg: action.error.message as string
                }
            })

            .addCase(getAuthStatus.pending, (state: Auth) => {
                state.status = Status.PENDING
            })
            .addCase(getAuthStatus.fulfilled, (state: Auth, action) => {

                state.status = Status.FULFILLED

                if (action.payload?.isLoggedIn) {
                    state.isLoggedIn = action.payload?.isLoggedIn
                    state.authUser = stripTypename(action.payload?.user)
                    state.error = null

                }
                else {
                    state.isLoggedIn = false
                    state.error = {
                        msg: ErrorCode.BAD_CREDENTIALS as string
                    }

                }

            })
            .addCase(getAuthStatus.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                state.error = {
                    msg: action.error as string
                }

            })
    }
})

export default authSlice.reducer
export const { logOut } = authSlice.actions

export const useAuth = () => useSelector((state: RootState) => state.auth)