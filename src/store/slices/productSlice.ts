import { ProductInput, ProductSlice, Status, RootState, Action, ProductEditInput, Product, ErrorCode, ResponseError, ProductId } from "../types";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CREATE_PRODUCT, DELETE_PRODUCT, EDIT_PRODUCT } from "../../data/mutation/products.mutation";
import client from "../../data/client";
import { GET_PRODUCTS } from "../../data/query/products.query";
import { useSelector } from "react-redux";
import { stripTypename } from "@apollo/client/utilities";
import { ApolloError } from "@apollo/client";

interface DeleteProductResponse {
    success: boolean
}
const initialState: ProductSlice = {
    status: Status.IDLE,
    error: null,
    products: [],
    action: null
}

export const addProduct = createAsyncThunk<
    Product,
    ProductInput,
    { rejectValue: ResponseError }
>('/admin/product/add', async (formData, { rejectWithValue }) => {

    try {
        const response = await client.mutate({
            mutation: CREATE_PRODUCT,
            variables: { input: formData }
        })


        return response.data.createProduct

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

export const editProduct = createAsyncThunk<
    Product,
    ProductEditInput,
    { rejectValue: ResponseError }
>('/admin/product/edit', async (formData, { rejectWithValue }) => {

    try {
        const response = await client.mutate({
            mutation: EDIT_PRODUCT,
            variables: { input: formData }
        })


        return response.data.editProduct

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

export const deleteProduct = createAsyncThunk<
    DeleteProductResponse,
    ProductId,
    { rejectValue: ResponseError }

>('/admin/product/delete', async (id, { rejectWithValue }) => {

    try {
        const response = await client.mutate({
            mutation: DELETE_PRODUCT,
            variables: { deleteProductId: id }
        })

        return response.data.deleteProduct

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


export const getProducts = createAsyncThunk<
    Product[],
    void,
    { rejectValue: ResponseError }

>('/admin/products', async (_, { rejectWithValue }) => {

    try {

        const response = await client.query({
            query: GET_PRODUCTS
        })


        return response.data.products

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

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {

    },
    extraReducers: builder => {
        builder
            .addCase(getProducts.pending, (state: ProductSlice) => {
                state.status = Status.PENDING
            })
            .addCase(getProducts.fulfilled, (state: ProductSlice, action) => {
                state.status = Status.FULFILLED
                state.action = Action.FETCH
                const products: Product[] = stripTypename(action.payload)
                state.products = products
            })
            .addCase(getProducts.rejected, (state: ProductSlice, action) => {
                state.status = Status.REJECTED
                state.error = action.payload as ResponseError
            })
            .addCase(addProduct.pending, (state: ProductSlice) => {
                state.status = Status.PENDING
            })
            .addCase(addProduct.fulfilled, (state: ProductSlice, action) => {
                client.resetStore()
                state.status = Status.FULFILLED
                state.products.push(action.payload)
                state.action = Action.ADD
            })
            .addCase(addProduct.rejected, (state: ProductSlice, action) => {
                state.status = Status.REJECTED
                state.error = action.payload as ResponseError
            })
            .addCase(deleteProduct.pending, (state: ProductSlice) => {
                state.status = Status.PENDING
            })
            .addCase(deleteProduct.fulfilled, (state: ProductSlice) => {
                client.resetStore()
                state.status = Status.FULFILLED
                state.action = Action.DELETE
            })
            .addCase(deleteProduct.rejected, (state: ProductSlice, action) => {
                state.status = Status.REJECTED
                state.error = action.payload as ResponseError
            })
            .addCase(editProduct.pending, (state: ProductSlice) => {
                state.status = Status.PENDING
            })
            .addCase(editProduct.fulfilled, (state: ProductSlice, action) => {
                client.resetStore()
                state.status = Status.FULFILLED
                state.products.push(action.payload)
                state.action = Action.EDIT
            })
            .addCase(editProduct.rejected, (state: ProductSlice, action) => {
                state.status = Status.REJECTED
                state.error = action.payload as ResponseError

            })
    }
})

export default productSlice.reducer
// export const {resetStatus} = productSlice.actions
export const useProduct = () => useSelector((state: RootState) => state.products)