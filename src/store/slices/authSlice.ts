import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Auth, Status, RootState, ErrorCode, LoginInput, ResponseError, AuthStatusResponse } from "../types";
import client from "../../data/client";
import { LOGIN_ADMIN, LOGIN_GOOGLE_USER, LOGIN_USER, LOGOUT_USER, REFRESH_TOKEN } from "../../data/mutation/auth.mutation";
import { GET_AUTH } from "../../data/query/auth.query";
import { useSelector } from "react-redux";
import { ApolloError } from "@apollo/client";
import { stripTypename } from "@apollo/client/utilities";
import { setAccessToken } from "../../auth/tokenManager";

const initialState: Auth = {
    isLoggedIn: false,
    user: null,
    status: Status.IDLE,
    error: null,
}

export const loginAdmin = createAsyncThunk<
    AuthStatusResponse,
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

            const auth = response.data?.logInAdmin

            if (!auth) {
                return rejectWithValue({
                    message: 'Auth payload missing',
                    code: ErrorCode.INTERNAL_SERVER_ERROR
                })
            }
            return auth
        } catch (err) {
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
    AuthStatusResponse,
    LoginInput,
    { rejectValue: ResponseError }>(
        '/user/login',
        async ({ email, password }, { rejectWithValue }) => {

            try {
                const response = await client.mutate({
                    mutation: LOGIN_USER,
                    variables: { input: { email, password } }
                })

                const auth = response.data?.logInUser
                if (!auth) {

                    return rejectWithValue({
                        message: 'Auth missing from response',
                        code: ErrorCode.INTERNAL_SERVER_ERROR
                    })
                }

                return auth
            }
            catch (err) {


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
    AuthStatusResponse,
    string,
    { rejectValue: ResponseError }>(
        '/googleUser/login',
        async (credential, { rejectWithValue }) => {

            try {
                const response = await client.mutate({
                    mutation: LOGIN_GOOGLE_USER,
                    variables: { credential }
                })

                const auth = response.data?.logInGoogleUser
                if (!auth) {
                    return rejectWithValue({
                        message: 'Auth Missing from response',
                        code: ErrorCode.INTERNAL_SERVER_ERROR
                    })
                }

                return auth
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


export const logOutUser = createAsyncThunk<
    AuthStatusResponse,
    void,
    { rejectValue: ResponseError }>(
        '/user/logout',
        async (_, { rejectWithValue }) => {

            try {
                const response = await client.mutate({
                    mutation: LOGOUT_USER,
                })

                const auth = response.data?.logOutUser
                if (!auth) {
                    return rejectWithValue({
                        message: 'Unexpected error while logging out',
                        code: ErrorCode.INTERNAL_SERVER_ERROR
                    })
                }

                return auth
            }
            catch (err) {
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
                    message: 'Unexpected Error while logging out',
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
            return rejectWithValue({
                message: 'Auth missing from response',
                code: ErrorCode.INTERNAL_SERVER_ERROR,
            })
        }
        return authStatus
    } catch (err) {
        if (err instanceof ApolloError) {
            console.log(err)
            const error = err.graphQLErrors[0]
            if (error) {
                if (error.extensions.code === ErrorCode.NOT_AUTHENTICATED) {
                    const response = await client.mutate({
                        mutation: REFRESH_TOKEN
                    })
                    const refreshToken = response?.data?.refreshToken
                    if (refreshToken) {
                        setAccessToken(refreshToken.accessToken)
                        return {
                            isLoggedIn: true,
                            user: refreshToken.user
                        }
                    }
                }
                return rejectWithValue({
                    message: error.message as string,
                    code: error.extensions.code as ErrorCode,
                    extras: error.extensions.extras as Record<string, string>
                })
            }
            else if (err.networkError) {
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
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(loginAdmin.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(loginAdmin.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.error = null
                state.user = stripTypename(action.payload.user)
                setAccessToken(action.payload.accessToken!)
                state.isLoggedIn = action.payload.isLoggedIn
            })
            .addCase(loginAdmin.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.user = null
                state.error = action.payload as ResponseError
                setAccessToken(null)
            })

            .addCase(logInUser.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(logInUser.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = stripTypename(action.payload.user)
                setAccessToken(action.payload.accessToken!)

                state.error = null
            })
            .addCase(logInUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.user = null
                state.error = action.payload as ResponseError
                setAccessToken(null)

            })


            .addCase(logOutUser.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(logOutUser.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = null
                setAccessToken(null)
                state.error = null
            })
            .addCase(logOutUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.user = null
                state.error = action.payload as ResponseError
                setAccessToken(null)

            })

            .addCase(logInGoogleUser.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(logInGoogleUser.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = stripTypename(action.payload.user)
                setAccessToken(action.payload.accessToken!)
                state.error = null
            })
            .addCase(logInGoogleUser.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.user = null
                state.error = action.payload as ResponseError
                setAccessToken(null)
            })


            .addCase(getAuthStatus.pending, (state: Auth) => {
                state.status = Status.PENDING
                state.error = null
            })
            .addCase(getAuthStatus.fulfilled, (state: Auth, action) => {
                state.status = Status.FULFILLED
                state.isLoggedIn = action.payload.isLoggedIn
                state.user = stripTypename(action.payload.user)
                state.error = null
            })
            .addCase(getAuthStatus.rejected, (state: Auth, action) => {
                state.status = Status.REJECTED
                state.isLoggedIn = false
                state.user = null
                state.error = action.payload as ResponseError
                setAccessToken(null)

            })
    }
})

export default authSlice.reducer
export const useAuth = () => useSelector((state: RootState) => state.auth)