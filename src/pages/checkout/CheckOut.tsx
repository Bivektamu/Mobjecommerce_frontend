import { ChangeEvent, useEffect, useMemo, useState } from 'react'
import { useStoreDispatch } from '../../store/index'
import { getAuthStatus, useAuth } from '../../store/slices/authSlice'
import BreadCrumbs from '../../components/layout/BreadCrumbs'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'


import { GoCheckbox } from 'react-icons/go';
import { MdOutlineCheckBoxOutlineBlank } from 'react-icons/md';
import { LiaSpinnerSolid } from "react-icons/lia";

import {  BillingDetails, CheckOutDetails, OrderInput, Role, Status, } from '../../store/types'
import { useLocation, useNavigate } from 'react-router-dom'
import Preloader from '../../components/ui/Preloader'
import { useMutation } from '@apollo/client'
import PageWrapper from '../../components/ui/PageWrapper'
import { useUser } from '../../store/slices/userSlice'
import ShippingAddress from '../../components/checkout/ShippingAddress';
import BillingForm from '../../components/forms/BillingForm';
import OrderSummary from '../../components/checkout/OrderSummary';
import { CREATE_PAYMENT_INTENT } from '../../data/payment.graphql';
import PaymentForm from '../../components/forms/PaymentForm'


const Checkout = () => {

  const navigate = useNavigate()
  const location = useLocation()
  const [clientSecret, setClientSecret] = useState<string | null>(null)

  const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!)

  const [createPaymentIntent, { loading }] = useMutation(CREATE_PAYMENT_INTENT, {
    onCompleted(data) {
      setClientSecret(data.createPaymentIntent.clientSecret)
    },
  })


  const dispatch = useStoreDispatch()
  const { user: authUser, status } = useAuth()
  const { user } = useUser()
  const [checkoutDetails, setCheckOutDetails] = useState<CheckOutDetails>({
    shipping: null,
    billing: null,
    items: []
  })
  const [billingCheck, setBillingCheck] = useState(true);

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getAuthStatus())
      return
    }
    else if (status === Status.REJECTED) {
      return navigate('/')
    }
    else if (status == Status.FULFILLED) {
      if (!authUser || authUser?.role !== Role.CUSTOMER) {

        return navigate('/')
      }
    }
  }, [authUser, status, navigate, dispatch])


  const newOrder: OrderInput | null = useMemo(() => {
    const order = location.state?.order ? location.state.order as OrderInput : null
    return order
  }
    , [location])

  useEffect(() => {
    if (!newOrder || Object.keys(newOrder).length < 1 || newOrder.items.length < 1) {
      return navigate('/')
    }
    const items = structuredClone(newOrder.items).map(({ imgUrl, price, ...rest }) => rest)
    setCheckOutDetails(prev => ({ ...prev, items }))
  }, [newOrder, navigate])

  const { shipping, billing, items } = checkoutDetails

  useEffect(() => {
    if (billingCheck && shipping && user) {
      const { id, label, setAsDefault, ...rest } = shipping
      const billing = rest as BillingDetails
      setCheckOutDetails(prev => ({ ...prev, billing: {
        ...billing, 
        name: user.firstName + ' ' + user.lastName,
        email:user.email
      } }))
    }
    else if (!billingCheck) {
      setCheckOutDetails(prev => ({ ...prev, billing: null }))
    }
  }, [shipping, billingCheck, user])

  const checkHandler = (e: ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    if (e.target.type === 'checkbox') {
      setBillingCheck(e.target.checked)
    }
  }

  const clickHandler = () => {
    if (shipping && billing && items.length > 0) {
      console.log(billing)
      createPaymentIntent({
        variables: {
          input: {
            items,
            shippingAddress: shipping,
          }
        }
      })
    }
  }

  if (!newOrder || status === Status.PENDING)
    return <Preloader />

  return (
    <PageWrapper>
      {
        status !== Status.FULFILLED && authUser?.role !== Role.CUSTOMER && <Preloader />
      }

      <section id="breadcrums" className="px-4">
        <div className="lg:py-14 py-6 container mx-auto">
          <h2 className="md:text-2xl text-lg font-bold md:mb-4 mb-2">Checkout</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center px-4'>
        <div className="container md:pt-16 pt-8 md:pb-36 pb-16 flex xl:gap-28 gap-10 md:flex-row flex-col">

          {
            !clientSecret ?
              <div className='xl:w-2/3 md:w-1/2 w-full'>
                <ShippingAddress setCheckOutDetails={setCheckOutDetails} />
                <br />
                <br />

                <div className=''>
                  <label htmlFor="billingCheck" className="text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full flex items-center gap-2">
                    Billing address same as shipping address

                    {billingCheck ? <GoCheckbox className="size-6" /> : <MdOutlineCheckBoxOutlineBlank className="size-6" />}
                  </label>
                  <input
                    onChange={e => checkHandler(e)}
                    type="checkbox"
                    id="billingCheck"
                    name="billingCheck"
                    className="appearance-none hidden" />
                </div>

                {
                  !billingCheck ? <BillingForm clickHandler={clickHandler} setBilling={setCheckOutDetails} /> :
                    <>
                      <br />
                      <br />
                      <button
                        disabled={loading}
                        type="button"
                        onClick={clickHandler}
                        className="relative w-full md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base mt-16">
                        Continue
                        {loading && <LiaSpinnerSolid className='size-6 absolute right-4 top-0 bottom-0 m-auto animate-spin' />}

                      </button>
                    </>
                }
              </div>
              :
              <div className='xl:w-2/3 md:w-1/2 w-full'>
                <Elements stripe={stripePromise} options={{
                  clientSecret
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