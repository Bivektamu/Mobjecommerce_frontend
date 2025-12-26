import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, Status, RootState, ErrorCode, LoginResponse, LoginInput, CustomJwtPayload, AuthUser, ResponseError, AuthStatusResponse } from "../types";
import client from "../../data/client";
import { LOGIN_ADMIN, LOGIN_GOOGLE_USER, LOGIN_USER } from "../../data/mutation";
import { GET_AUTH } from "../../data/query";
import { jwtDecode } from "jwt-decode";
import { stripTypename } from "@apollo/client/utilities";
import { useSelector } from "react-redux";
import { ApolloError } from "@apollo/client";

const initialState: Auth = {
    isLoggedIn: false,
    authUser: null,
    status: Status.IDLE,
    error: null,
}


const clearSession = () => {
    localStorage.setItem('token', '')
    client.resetStore()
}

const setSession = (token: string) => {
    localStorage.setItem('token', token)
    client.resetStore()
}


export const loginAdmin = createAsyncThunk<
    LoginResponse,
    LoginInput,
    { rejectValue: ResponseError }
>(
    '/admin/login',
    async ({ email, password }, { rejectWithValue }) => {

        try {
            const response = await client.mutate({
                mutation: LOGIN_ADMIN,
                variables: { input: { email, password } }
            })

            const token = response.data?.logInAdmin?.token

            if (!token) {
                clearSession()
                return rejectWithValue({
                    message: 'Token Missing from response',
                    code: ErrorCode.INTERNAL_SERVER_ERROR
                })
            }
            setSession(token)
            return token
        } catch (err) {
            clearSession()

            if (err instanceof ApolloError) {
                const error = err.graphQLErrors[0]
                if (error) {
                    return rejectWithValue({
                        message: error.message,
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
                message: 'Unknown Error',
                code: ErrorCode.INTERNAL_SERVER_ERROR,
            })
        }
    })


export const logInUser = createAsyncThunk<
    LoginResponse,
    LoginInput,
    { rejectValue: ResponseError }>(
        '/user/login',
        async ({ email, password }, { rejectWithValue }) => {

            try {
                const response = await client.mutate({
                    mutation: LOGIN_USER,
                    variables: { input: { email, password } }
                })

                const token = response.data?.logInUser?.token
                if (!token) {
                    clearSession()
                    return rejectWithValue({
                        message: 'Token missing from response',
                        code: ErrorCode.INTERNAL_SERVER_ERROR
                    })
                }
                setSession(token)
                return token
            }
            catch (err) {
                clearSession()

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

export const logInGoogleUser = createAsyncThunk<
    LoginResponse,
    string,
    { rejectValue: ResponseError }>(
        '/googleUser/login',
        async (credential, { rejectWithValue }) => {

            try {
                const response = await client.mutate({
                    mutation: LOGIN_GOOGLE_USER,
                    variables: { credential }
                })

                const token = response.data?.logInGoogleUser?.token
                if (!token) {
                    clearSession()
                    return rejectWithValue({
                        message: 'Token Missing from response',
                        code: ErrorCode.INTERNAL_SERVER_ERROR
                    })
                }
                setSession(token)
                return token
            } catch (err) {
                clearSession()

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


export const getAuthStatus = createAsyncThunk<
    AuthStatusResponse,
    void,
    { rejectValue: ResponseError }
>('/getAuth', async (
    _,
    { rejectWithValue }
) => {

    try {
        const response = await client.query({
            query: GET_AUTH,
        })
        const authStatus = response.data?.getAuthStatus
        if (!authStatus) {
            clearSession()
            return rejectWithValue({
                message: 'Unknown Error',
                code: ErrorCode.INTERNAL_SERVER_ERROR,
            })
        }

        return authStatus


    } catch (err) {
        clearSession()

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


const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: (state) => {
            // state.status = Status.IDLE
            clearSession()
            state.isLoggedIn = false
            state.authUser = null
        },
    },
    extraReducers: builder => {
        builder
            .addCase(loginAdmin.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(loginAdmin.fulfilled, (state: Auth, action) => {
                const decoded_user = jwtDecode<CustomJwtPayload>(action.payload)
                state.status = Status.FULFILLED
                state.error = null
                const authUser: AuthUser = {
                    role: decoded_user.role,
                    id: decoded_user.id
                }
                state.authUser = authUser
                state.isLoggedIn = true
            })
            .addCase(loginAdmin.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                state.error = action.payload as ResponseError
            })

            .addCase(logInUser.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(logInUser.fulfilled, (state: Auth, action) => {
                const decoded_user = jwtDecode<CustomJwtPayload>(action.payload)
                state.status = Status.FULFILLED
                state.isLoggedIn = true
                const authUser: AuthUser = {
                    role: decoded_user.role,
                    id: decoded_user.id
                }
                state.authUser = authUser
                state.error = null
            })
            .addCase(logInUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                
                state.error = action.payload as ResponseError
            })
            .addCase(logInGoogleUser.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(logInGoogleUser.fulfilled, (state: Auth, action) => {
                const decoded_user = jwtDecode<CustomJwtPayload>(action.payload)
                state.status = Status.FULFILLED
                state.isLoggedIn = true
                const authUser: AuthUser = {
                    role: decoded_user.role,
                    id: decoded_user.id
                }
                state.authUser = authUser
                state.error = null
            })
            .addCase(logInGoogleUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                state.error = action.payload as ResponseError

            })

            .addCase(getAuthStatus.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(getAuthStatus.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.isLoggedIn = action.payload.isLoggedIn
                state.authUser = stripTypename(action.payload.user)
                state.error = null
            })
            .addCase(getAuthStatus.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.authUser = null
                console.log(action.payload)
                state.error = action.payload as ResponseError

            })
    }
})

export default authSlice.reducer
export const { logOut } = authSlice.actions

export const useAuth = () => useSelector((state: RootState) => state.auth)