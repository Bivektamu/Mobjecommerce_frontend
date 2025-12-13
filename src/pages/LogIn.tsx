import { useEffect } from 'react'
import { Cart, Role, Status } from '../store/types'
import { useStoreDispatch } from '../store/index'
import { useAuth, getAuthStatus } from '../store/slices/authSlice'

import BreadCrumbs from '../components/layout/BreadCrumbs'
import { useNavigate, useSearchParams } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import { upDateCart, useCart } from '../store/slices/cartSlice'
import PageWrapper from '../components/ui/PageWrapper'
import LoginForm from '../components/forms/LoginForm';

const LogIn = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  const dispatch = useStoreDispatch()
  const { isLoggedIn, authUser, status } = useAuth()
  const { cart } = useCart()




  useEffect(() => {
    if (status === Status.IDLE)
      dispatch(getAuthStatus())
  }, [status])

  useEffect(() => {
    if (isLoggedIn && authUser?.role === Role.CUSTOMER)
      navigate('/')
  }, [isLoggedIn, authUser])

  useEffect(() => {
    if (searchParams.get('cart')) {

      const cartItems = cart.map((item: Cart) => ({ ...item, customerId: item.userId || authUser?.id }))
      dispatch(upDateCart(cartItems))
      navigate('/checkout')
    }
  }, [searchParams])

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
          <p className="text-sm mt-8 text-center text-slate-500">
            Don't have an account? <CustomNavLink to='/signup' cssClass='font-semibold text-black'>Sign up</CustomNavLink>
          </p>
        </div>
      </section>
    </PageWrapper>
  )
}

export default LogIn