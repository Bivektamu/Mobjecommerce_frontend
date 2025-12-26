import { JwtPayload } from "jwt-decode"
import { Types } from "mongoose"

export interface Address {
    street: string,
    city: string,
    postcode: string,
    country: string,
    state: string
}
export interface User {
    id: string,
    firstName: string,
    lastName: string,
    email: string,
    registeredDate: Date,
    address: Address,
    isActive: boolean,
    isVerified: boolean
}
export type UserId = User['id']

export type UserEmail = User['email']

export interface UserInput {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    address?: Address,
    isActive?: boolean,
    isVerified?: boolean
}

export interface UserEditInput {
    id: UserId
    firstName: string,
    lastName: string,
    email: string,
    address?: Address,
    isActive?: boolean,
    isVerified?: boolean
}


export interface CreateUserForm {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
}

export enum Status {
    PENDING = 'PENDING',
    FULFILLED = 'FULFILLED',
    REJECTED = 'REJECTED',
    IDLE = 'IDLE'
}

export enum Role {
    ADMIN = "admin",
    CUSTOMER = "customer"
}
export interface AuthUser {
    role: Role,
    id: string
}

export enum ErrorCode {
    USER_NOT_FOUND = 'USER_NOT_FOUND',
    BAD_CREDENTIALS = 'BAD_CREDENTIALS',
    SHIPPING_ADDRESS_ERROR = 'SHIPPING_ADDRESS_ERROR',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    NOT_AUTHENTICATED = 'NOT_AUTHENTICATED',
    WRONG_USER_TYPE = 'WRONG_USER_TYPE',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INPUT_ERROR = 'INPUT_ERROR',
    NOT_FOUND = 'NOT_FOUND',
    JWT_TOKEN_EXPIRED = 'JWT_TOKEN_EXPIRED',
    JWT_TOKEN_INVALID = 'JWT_TOKEN_INVALID',
    JWT_TOKEN_MISSING = 'JWT_TOKEN_MISSING',
    GOOGLE_ERROR = 'GOOGLE_ERROR',
    NETWORK_ERROR = 'NETWORK_ERROR'
}

export interface ResponseError {
    message: string,
    code: ErrorCode,
    extras?: Record<string, string>
}


export interface CustomError {
    message: string,
    code?: number,
    extras?: Record<string, string>
}
export interface Auth {
    isLoggedIn: boolean,
    authUser: AuthUser | null,
    status: Status,
    error: ResponseError | null,
}


export interface LoginInput {
    email: string,
    password: string
}
export interface GoogleLoginInput {
    credential: string
}


export type LoginResponse = string

export interface AuthStatusResponse {
    isLoggedIn: boolean,
    user: AuthUser
}

export interface CustomJwtPayload extends AuthUser, JwtPayload { }


export enum Action {
    FETCH = 'FETCH',
    ADD = 'ADD',
    DELETE = 'DELETE',
    EDIT = 'EDIT'
}

export interface ProductSlice {
    status: Status,
    error: string,
    products: Product[],
    action: Action | null
}

export interface UserSlice {
    status: Status,
    error: string | null,
    users: User[],
    user: User | null,
    action: Action | null
}

export interface RootState {
    auth: Auth,
    toasts: ToastSlice,
    products: ProductSlice,
    user: UserSlice,
    cart: CartSlice,
}

export enum Colour {
    BLACK = "BLACK",
    RED = "RED",
    GRAY = "GRAY",
    WHITE = "WHITE",
    AMBER = "AMBER"
}

export enum Size {
    SMALL = "S",
    MEDIUM = "M",
    LARGE = "L",
    EXTRA_LARGE = "XL",
}

// export interface ProductImage {
//     _id: string,
//     img: File | string
// }


export interface ProductImage {
    id: string,
    url: string,
    fileName: string
}
export interface QueriedProductImage extends ProductImage {
    __typename?: string
}
export interface ProductImageInput {
    _id: Types.ObjectId,
    img: File
}

export interface Product {
    id: string,
    imgs: ProductImage[],
    title: string,
    slug: string,
    description: string,
    colors: Colour[],
    sizes: Size[],
    price: number,
    quantity: number,
    sku: string,
    stockStatus: boolean,
    category: string,
    featured: boolean
}
export type ProductId = Product['id']

export interface ProductInput extends Omit<Product, 'id' | 'quantity' | 'price' | 'stockStatus' | 'imgs'> {
    quantity: number | null,
    price: number | null,
    stockStatus: boolean | null,
    imgs: ProductImageInput[]
}
export interface QueriedProduct extends Omit<Product, 'imgs'> {
    __typename: string,
    imgs: QueriedProductImage[]
}
export interface ProductEditInput extends Omit<Product, 'imgs'> {
    __typename?: string
    oldImgs: ProductImage[],
    newImgs: ProductImageInput[]
}


export interface ValidateSchema<T> {
    name: string,
    type: string,
    value: T,
    msg?: string
}
export interface FormError {
    [key: string]: string
}



export enum Toast_Vairant {
    DANGER = 'DANGER',
    SUCCESS = 'SUCCESS',
    INFO = 'INFO',
    WARNING = 'WARNING'
}
export type Toast = {
    id: string,
    variant: Toast_Vairant,
    msg: string
}

export type ToastSlice = {
    toasts: Toast[]
}


export interface PriceRange {
    min: number | '',
    max: number | '',
}

export interface Filters {
    category: string[],
    colors: Colour[],
    sizes: Size[],
    price: PriceRange
}

export interface Cart {
    id: string,
    productId: ProductId,
    userId: string | null
    color: Colour | null,
    quantity: number,
    size: Size | null,
    price: number | null,
    imgUrl: string
}

export interface CartSlice {
    cart: Cart[],
    action: Action | null
}


export enum Order_Status {
    PENDING = 'PENDING',
    COMPLETED = 'COMPLETED',
    PROCESSING = 'PROCESSING',
    CANCELLED = 'CANCELLED',
    FAILED = 'FAILED',
    SHIPPED = 'SHIPPED',
    REFUNDED = 'REFUNDED',
}


export interface OrderItem {
    id: string,
    productId: ProductId,
    color: Colour,
    quantity: number,
    size: Size,
    price: number,
    imgUrl: string
}

export type OrderItemInput = Omit<OrderItem, 'id'>

export interface Order {
    id: string,
    orderNumber: number,
    userId: string,
    items: OrderItem[],
    status: Order_Status,
    subTotal: number,
    total: number,
    tax: number,
    shippingAddress: Address,
    orderPlaced: Date
}

export interface OrderInput extends Omit<Order, 'id' | 'items' | 'orderNumber' | 'orderPlaced'> {
    items: OrderItemInput[]
}


export interface Review {
    id: string,
    userId: UserId,
    productId: ProductId,
    review: string,
    createdAt: Date,
    rating: null | number,
}
export type ReviewId = Review['id']

export type ImgUrl = {
    url: string
}

export interface ProductDetailsForReview {
    _id: ProductId,
    title: string,
    imgs: [ImgUrl]
}

export interface UserDetailsForReview {
    _id: UserId,
    firstName: string,
    lastName: string,
    email: string,
}

export interface DetailedReview extends Omit<Review, 'productId' | 'userId'> {
    productId: ProductDetailsForReview,
    userId: UserDetailsForReview
}

export interface ReviewUserOnly extends Omit<DetailedReview, 'productId'> {
    productId: ProductId,
}

export interface ReviewInput {
    userId: UserId,
    productId: ProductId,
    review: string,
    rating: null | number,
}

export interface EditReviewInput {
    id: ReviewId,
    review: string,
    rating: null | number,
}


export interface ReviewSlice {
    reviews: Review[],
    status: Status,
    error: string,
    action: Action | null
}


export interface LikedProduct {
    id: ProductId,
    createdAt: Date
}

export interface WishList {
    id: string,
    userId: string,
    products: [LikedProduct]
}



export interface LowStockProduct {
    _id: string,
    heroImg: string,
    title: string,
    price: number,
    quantity: number,
    sku: string,
}