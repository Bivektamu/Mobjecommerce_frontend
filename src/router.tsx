import { Suspense, lazy, } from "react"
import { createBrowserRouter, Navigate } from "react-router-dom"
import { GoogleOAuthProvider } from '@react-oauth/google'

import Preloader from "./components/ui/Preloader"
import Contact from "./pages/Contact"
const DashBoard = lazy(() => import("./pages/admin/DashBoard"))
const Products = lazy(() => import("./pages/admin/Products"))
const SignIn = lazy(() => import("./pages/admin/SignIn"))
const AddProduct = lazy(() => import("./components/admin/AddProduct"))
const EditProduct = lazy(() => import("./components/admin/EditProduct"))
const Orders = lazy(() => import("./pages/admin/Orders"))
const Customers = lazy(() => import("./pages/admin/Customers"))
const Reviews = lazy(() => import("./pages/admin/Reviews"))
const AdminPrivateRoute = lazy(() => import("./pages/admin/Private"))

const Cart = lazy(() => import("./pages/Cart"))
const Fail = lazy(() => import("./pages/checkout/Fail"))

const AddressBook = lazy(() => import("./pages/account/AddressBook"))
const ChangePassword = lazy(() => import("./pages/account/ChangePassword"))
const AccountDetails = lazy(() => import("./pages/account/AccountDetails"))
const Account = lazy(() => import("./pages/account/Account"))
const UserOrders = lazy(() => import("./pages/account/Orders"))
const UserOrderDetails = lazy(() => import("./pages/account/UserOrderDetails"))
const WishList = lazy(() => import("./pages/account/WishList"))

const PageNotFound = lazy(() => import("./pages/PageNotFound"))
const Checkout = lazy(() => import("./pages/checkout/CheckOut"))
const OrderConfirmation = lazy(() => import("./pages/checkout/OrderConfirmation"))
const Home = lazy(() => import("./pages/Home"))
const Layout = lazy(() => import("./pages/Layout"))
const Product = lazy(() => import("./pages/collections/ProductDetails"))
const Collections = lazy(() => import("./pages/collections/Collections"))
const LogIn = lazy(() => import("./pages/LogIn"))
const SignUp = lazy(() => import("./pages/SignUp"))




const router = createBrowserRouter([
    {
        path: '/',
        element: <Suspense fallback={< Preloader />}>

            <Layout />
        </Suspense >,
        children: [
            {
                path: '/',
                element: <Home />
            },
            {
                path: '/collections',
                element: <Collections />
            },
            {
                path: '/collections/:slug',
                element: <Product />
            },

            {
                path: '/contact',
                element: <Contact />
            },
            {
                path: '/cart',
                element: <Cart />
            },
            {
                path: '/checkout',
                children: [
                    {
                        path: 'order-confirmation',
                        element: <OrderConfirmation />,
                    },
                    {
                        path: 'fail',
                        element: <Fail />,
                    },
                    {
                        index: true,
                        element: <Checkout />,
                    }
                ]

            },

            {
                path: '/account',
                element: <Account />,
                children: [
                    {
                        path: 'orders',
                        element: <UserOrders />,
                    },
                    {
                        path: 'orders/:orderNumber',
                        element: <UserOrderDetails />,
                    },
                    {
                        path: 'wishlist',
                        element: <WishList />,
                    },
                    {
                        path: 'address-book',
                        element: <AddressBook />,
                    },
                    {
                        path: 'change-password',
                        element: <ChangePassword />,
                    },
                    {
                        path: 'details',
                        element: <AccountDetails />,
                    },

                    {
                        index: true,
                        element: <Navigate to="details" replace />,
                    },

                ]
            },

            {
                path: '/login',
                element: <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
                    <LogIn />
                </GoogleOAuthProvider>
            },
            {
                path: '/signup',
                element: <SignUp />
            },
            {
                path: '/admin/login',
                element: <SignIn />
            },
            {
                path: '/admin',
                element: <AdminPrivateRoute />,
                children: [
                    {
                        path: 'products',
                        element: <Products />
                        ,
                    },
                    {
                        path: 'products/:slug',
                        element: <EditProduct />
                    },

                    {
                        path: 'products/add',
                        element: <AddProduct />
                    },
                    {
                        path: 'dashboard',
                        element: <DashBoard />
                    },

                    {
                        path: 'orders',
                        element: <Orders />
                    },

                    {
                        path: 'customers',
                        element: <Customers />
                    },

                    {
                        path: 'reviews',
                        element: <Reviews />
                    }
                ]
            },

            {
                path: '*',
                element: <PageNotFound />
            },

        ]
    },
])

export default router