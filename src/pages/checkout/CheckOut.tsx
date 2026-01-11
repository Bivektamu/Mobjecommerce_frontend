import { useEffect, useMemo, useRef, useState } from 'react'
import { useStoreDispatch } from '../../store/index'
import { getAuthStatus, useAuth } from '../../store/slices/authSlice'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'


import { LiaSpinnerSolid } from "react-icons/lia";

import { CheckOutDetails, OrderInput, PaymentIntent, Status, ValidateSchema, } from '../../store/types'
import { useLocation, useNavigate } from 'react-router-dom'
import Preloader from '../../components/ui/Preloader'
import { useMutation } from '@apollo/client'
import PageWrapper from '../../components/ui/PageWrapper'
import { getUser, useUser } from '../../store/slices/userSlice'
import ShippingAndBilling from '../../components/checkout/ShippingAndBilling';
import OrderSummary from '../../components/checkout/OrderSummary';
import { CREATE_PAYMENT_INTENT } from '../../data/payment.graphql';
import PaymentForm from '../../components/forms/PaymentForm'
import validateForm from '../../utils/validate'

const Checkout = () => {

  const dispatch = useStoreDispatch()
  const { user: authUser, status: authStatus } = useAuth()
  const { user, status } = useUser()

  const navigate = useNavigate()
  const location = useLocation()
  const clientSecret = useRef<string | null>(null)
  const [disabled, setDisabled] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

  const [createPaymentIntent, { loading }] = useMutation(CREATE_PAYMENT_INTENT, {
    onCompleted(data) {
      clientSecret.current = data.createPaymentIntent.clientSecret
    },
  })


  console.log(clientSecret.current)



  useEffect(() => {
    if (authStatus === Status.IDLE)
      dispatch(getAuthStatus())
  }, [authStatus, dispatch])


  useEffect(() => {
    if (status === Status.IDLE && authUser)
      dispatch(getUser(authUser.id))
  }, [status, dispatch, authUser])


  const [checkoutDetails, setCheckOutDetails] = useState<CheckOutDetails>({
    shipping: null,
    billing: null,
    items: []
  })

  const newOrder: OrderInput | null = useMemo(() => {
    const order = location.state?.order ? location.state.order as OrderInput : null
    return order
  }
    , [location])


  useEffect(() => {
    // if (!newOrder || Object.keys(newOrder).length < 1 || newOrder.items.length < 1) {
    //   return navigate('/')
    // }
    const items = structuredClone(newOrder.items).map(({ imgUrl, price, ...rest }) => rest)
    setCheckOutDetails(prev => ({ ...prev, items }))
  }, [newOrder, navigate])



  const { shipping, billing, items, email } = checkoutDetails


  useEffect(() => {
    if (shipping && billing && !loading) {
      if (user || email) {
        console.log(user, email)
        setDisabled(false)
      }
      else {
        setDisabled(true)
      }
    }
    else {
      setDisabled(true)
    }

  }, [loading, shipping, billing, email])

  useEffect(() => {
    if (email) {
      setEmailError(null)
    }
  }, [email])


  const clickHandler = () => {
    if (shipping && billing && items.length > 0) {

      const validateSchema: ValidateSchema<unknown>[] = [{
        name: 'email',
        type: 'email',
        value: email
      }]
      if (!user) {
        const error = validateForm(validateSchema)
        console.log()
        if (Object.keys(error).length > 0)
          return setEmailError(error.email)
      }

      if (!clientSecret.current) {
        const input: PaymentIntent = {
          items,
          shippingAddress: shipping,
          billingAddress: billing,
        }
        if (email) {
          input.email = email
        }
        console.log(input)
        createPaymentIntent({
          variables: {
            input
          }
        })
      }
    }
  }

  if (!newOrder || status === Status.PENDING)
    return <Preloader />

  return (
    <PageWrapper>

      <section id="breadcrums" className="px-4">
        <div className="lg:py-14 py-6 container mx-auto">
          <h2 className="md:text-2xl text-lg font-bold md:mb-4 mb-2">Checkout</h2>
          {/* <BreadCrumbs rootLink="Ecommerce" /> */}
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center px-4'>
        <div className="container md:pt-16 pt-8 md:pb-36 pb-16 flex xl:gap-28 gap-10 md:flex-row flex-col">

          {
            !clientSecret.current ?
              <div className='xl:w-2/3 md:w-1/2 w-full'>
                {!user &&
                  <div className='mb-8'>
                    <h4 className="text-left font-semibold md:text-xl text-lg mb-4">Contact Information</h4>
                    <fieldset>
                      <label htmlFor="email" className='capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2'>Email</label>
                      <input
                        type='text'
                        className='border-[1px] outline-none bg-slate-50 block px-3 py-2 rounded w-full max-w-[400px] md:text-sm text-xs placeholder:font-normal'
                        value={email}
                        onChange={(e) => setCheckOutDetails(prev => ({
                          ...prev,
                          email: e.target.value
                        }))} />
                      {emailError && <span className='text-red-500 text-xs text-left block mt-2'>{emailError}</span>}
                    </fieldset>
                  </div>
                }

                <ShippingAndBilling setCheckOutDetails={setCheckOutDetails} checkoutDetails={checkoutDetails} />

                {
                  <button
                    disabled={disabled}
                    type="button"
                    onClick={clickHandler}
                    className={`relative w-full  md:w-[200px]  py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base mt-16 ${!disabled ? 'bg-black text-white' : 'disabled'}`}>
                    Continue
                    {loading && <LiaSpinnerSolid className='size-6 absolute right-4 top-0 bottom-0 m-auto animate-spin' />}

                  </button>
                }

              </div>
              :
              <div className='xl:w-2/3 md:w-1/2 w-full'>
                <Elements stripe={stripePromise} options={{
                  clientSecret: clientSecret.current
                }}>
                  <PaymentForm billing={billing!} total={newOrder.total} />
                </Elements>
              </div>
          }
          <OrderSummary order={newOrder} />
        </div>

      </section>
    </PageWrapper>
  )
}

export default Checkout