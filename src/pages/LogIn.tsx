import { useEffect } from 'react'
import { Role, Status, Toast, Toast_Vairant } from '../store/types'
import { useStoreDispatch } from '../store/index'
import { useAuth, getAuthStatus, logInGoogleUser } from '../store/slices/authSlice'

import BreadCrumbs from '../components/layout/BreadCrumbs'
import { useLocation, useNavigate } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import { useCart } from '../store/slices/cartSlice'
import PageWrapper from '../components/ui/PageWrapper'
import LoginForm from '../components/forms/LoginForm';
import { addToast } from '../store/slices/toastSlice'
import { v4 } from 'uuid'
import { getToastVariant } from '../utils/helpers'
import Preloader from '../components/ui/Preloader'
import useGoogleAuth from '../auth/useGoogleAuth'
import { FaGoogle } from 'react-icons/fa'
import { Helmet } from 'react-helmet-async'

const LogIn = () => {
  const location = useLocation()
  const mergeCart = location?.state?.mergeCart
  const navigate = useNavigate()

  const dispatch = useStoreDispatch()
  const { isLoggedIn, user, status } = useAuth()
  const { cart } = useCart()

  const { login, loading, data, error } = useGoogleAuth()
  console.log(loading)

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getAuthStatus())
      return
    }
    if (status === Status.FULFILLED) {
      if (isLoggedIn && user?.role === Role.CUSTOMER) {

        if (mergeCart) {
          return navigate('/cart', {
            state: { mergeCart }
          })


        }
        return navigate('/')
      }
    }
  }, [status, dispatch, isLoggedIn, user, navigate, cart, mergeCart])

  useEffect(() => {
    const toast: Toast = {
      id: v4(),
      variant: Toast_Vairant.SUCCESS,
      msg: 'Sign In successful'
    }

    if (data) {
      dispatch(logInGoogleUser(data))
        .unwrap()
        .then(() => {
          dispatch(addToast(toast))
        })
        .catch((error) => {
          toast.msg = error.message
          toast.variant = getToastVariant(error.code)
          dispatch(addToast(toast))
        })
    }
    else if (error) {
      toast.variant = Toast_Vairant.DANGER,
        toast.msg = 'Google sign in error'
      dispatch(addToast(toast))
    }
  }, [data, error, dispatch])

  if (loading)
    return <>
      <Helmet>
        <title>Signing You In...</title>
      </Helmet>
      <Preloader /></>

  return (
    <PageWrapper>
      <Helmet>
        <title>Login | Sign In to Mobje Commerce</title>
      </Helmet>
      <section id="breadcrums" className="px-4">
        <div className="md:py-14 py-6 container mx-auto">
          <h2 className="text-xl md:text-2xl font-semibold mb-4">Login</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center'>
        <div className="md:w-[384px] w-full  max-w-full bg-white pt-8 pb-12 md:px-8 px-4 rounded-lg">
          <LoginForm />
          <br />


          <button
            className='border-black border py-2 px-4 rounded w-full text-sm md:text-base flex items-center justify-center gap-4'
            onClick={login}
            disabled={loading}
          >
            <FaGoogle />
            Continue on Google
          </button>

          <p className="text-sm mt-8 text-center text-slate-500">
            Don't have an account? <CustomNavLink to='/signup' cssClass='font-semibold text-black'>Sign up</CustomNavLink>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default LogIn