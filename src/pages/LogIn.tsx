import { useEffect } from 'react'
import { Cart, Role, Status, Toast, Toast_Vairant } from '../store/types'
import { useStoreDispatch } from '../store/index'
import { useAuth, getAuthStatus, logInGoogleUser } from '../store/slices/authSlice'

import BreadCrumbs from '../components/layout/BreadCrumbs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import { upDateCart, useCart } from '../store/slices/cartSlice'
import PageWrapper from '../components/ui/PageWrapper'
import LoginForm from '../components/forms/LoginForm';
import { CredentialResponse, GoogleLogin } from '@react-oauth/google'
import { addToast } from '../store/slices/toastSlice'
import { v4 } from 'uuid'
import { map } from 'framer-motion/client'
const LogIn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const dispatch = useStoreDispatch()
  const { isLoggedIn, authUser, status } = useAuth()
  const { cart } = useCart()

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getAuthStatus())
      return
    }
    if (status === Status.FULFILLED) {
      if (isLoggedIn && authUser?.role === Role.CUSTOMER) {
        // return navigate('/')

        if (searchParams.get('cart')) {
          const guestCartItems = cart.filter(item => !item.userId)
          if (guestCartItems.length > 0) {
            const userCartItems = cart.filter(item => item.userId === authUser.id)

              const mapCart = new Map<string, Cart>()
              for (const item of userCartItems) {
                mapCart.set(item.id, { ...item })
              }
              for (const item of guestCartItems) {
                const currItem = mapCart.get(item.id)
                if (currItem?.color === item.color && currItem?.size === item.size) {
                  mapCart.set(item.id, { ...currItem, quantity: currItem.quantity + item.quantity })
                }
                else {
                  mapCart.set(item.id, {...item, userId: authUser.id})
                }
              }

              const newCart = Array.from(mapCart.values())

              console.log(newCart)
            
            dispatch(upDateCart(newCart))
            return navigate('/cart')
          }
        }
      }
    }
  }, [status, dispatch, isLoggedIn, authUser, navigate, cart, searchParams])


  const googleLoginHandler = (credentialResponse: CredentialResponse) => {

    const credential = (credentialResponse.credential)

    const toast: Toast = {
      id: v4(),
      variant: Toast_Vairant.SUCCESS,
      msg: 'Sign In successful'
    }


    dispatch(logInGoogleUser(credential as string))
      .unwrap()
      .then(() => {
        dispatch(addToast(toast))

      })
      .catch((error) => {
        console.log(error)
        toast.variant = Toast_Vairant.WARNING
        toast.msg = error
        dispatch(addToast(toast))
      })
  }

  const googleErrorHandler = () => {
    const toast: Toast = {
      id: v4(),
      variant: Toast_Vairant.WARNING,
      msg: 'Google sign in error'
    }
    dispatch(addToast(toast))

  }

  return (
    <PageWrapper>
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
          <GoogleLogin
            onSuccess={googleLoginHandler}
            onError={googleErrorHandler}
            useOneTap
          />
          <p className="text-sm mt-8 text-center text-slate-500">
            Don't have an account? <CustomNavLink to='/signup' cssClass='font-semibold text-black'>Sign up</CustomNavLink>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default LogIn