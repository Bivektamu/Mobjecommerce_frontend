import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useStoreDispatch } from '../../store/index'
import { getAuthStatus, useAuth } from '../../store/slices/authSlice'
import BreadCrumbs from '../../components/layout/BreadCrumbs'
import { v4 as uuidv4 } from 'uuid';

import { deleteCartByCustomerId } from '../../store/slices/cartSlice'
import { OrderInput, Role, Status, Toast, Toast_Vairant } from '../../store/types'
import SquareLoader from '../../components/ui/SquareLoader'
// import { getProducts, useProduct } from '../../store/slices/productSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import ShippingForm from '../../components/forms/ShippingForm'
import Preloader from '../../components/ui/Preloader'
// import ProgressLoader from '../../components/ui/ProgressLoader'
import { useMutation } from '@apollo/client'
import { CREATE_ORDER } from '../../data/mutation/orders.mutation'
import PageWrapper from '../../components/ui/PageWrapper'
import { addToast } from '../../store/slices/toastSlice'
import { useUser } from '../../store/slices/userSlice'
import { GET_ORDERS_BY_USER_ID } from '../../data/query/orders.query';
import client from '../../data/client';

const Checkout = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [createOrder] = useMutation(CREATE_ORDER, {
    onCompleted: (data) => {
      client.query({
        query: GET_ORDERS_BY_USER_ID,
        variables: {
          userOrdersId: user?.id
        },
        fetchPolicy: "network-only", // force fresh fetch
      })

      dispatch(deleteCartByCustomerId(user?.id))
      navigate(`/checkout/success/${data.createOrder}`, {
        state: {
          fromCheckout: true
        }
      })

    },
    onError: (error) => {
      console.error("Error creating order", error);
      navigate('/checkout/fail', {
        state: {
          order: newOrder as OrderInput
        }
      })
    }
  })

  const dispatch = useStoreDispatch()
  const { user:authUser, status } = useAuth()
  const { user } = useUser()
  const [preloaderFlag, setPreloaderFlag] = useState<boolean>(false)

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getAuthStatus())
      return
    }
    else if (status === Status.REJECTED) {
      console.log('a')
      return navigate('/')
    }
    else if (status == Status.FULFILLED) {
      if(!user || authUser?.role !== Role.CUSTOMER) {
      console.log('b')

        return navigate('/')
      }
    }
  }, [user, status, navigate, dispatch])


  const newOrder: OrderInput | null = useMemo(() => {
    const order = location.state?.order ? location.state.order as OrderInput : null
    if (order && user?.address) {
      order.shippingAddress = user.address
    }
    return order
  }
    , [location, user])

  const uniqueCartItems = useMemo(() => newOrder?.items ? [...new Map(newOrder.items.map(item => [item.productId, item])).values()] : [], [newOrder])

  useEffect(() => {

    if (!newOrder || Object.keys(newOrder).length < 1 || newOrder.items.length < 1) {
      navigate('/')
    }
  }, [newOrder, navigate])


  const placeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let addressValid: boolean
    const { shippingAddress } = newOrder as OrderInput
    if (Object.keys(shippingAddress).length < 1) {
      addressValid = false
    }
    else {
      addressValid = Object.values(shippingAddress).every(value => value !== null)
    }

    if (!addressValid) {
      const newToast: Toast = {
        id: uuidv4(),
        variant: Toast_Vairant.DANGER,
        msg: 'Please update shipping address first '
      }
      dispatch(addToast(newToast))
      return
    }
    setPreloaderFlag(true)


    createOrder({
      variables: {
        input: newOrder
      }
    })
  }
  if (preloaderFlag || !newOrder || status === Status.PENDING)
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
          <div className="xl:w-2/3 md:w-1/2 w-full">
            <p className="font-bold md:text-xl text-lg  border-slate-200 lg:mb-24 md:mb-12 mb-6">Shipping Address</p>

            <ShippingForm />

          </div>
          {/* border-slate-200 border-[1px] */}
          {
            Object.keys(newOrder).length < 1 ? <SquareLoader square={1} squareClass='xl:w-1/3 md:w-1/2 w-full h-[400px]' /> : newOrder.total > 0 &&
              <div className="xl:w-1/3 md:w-1/2 w-full border-slate-200 border-[1px] md:border-[0] md:border-l-[1px]  md:pl-16 p-4 md:p-0">
                <p className="font-bold md:text-xl text-lg md:mb-12 mb-4">Order Summary</p>
                <div className="flex justify-between md:mb-12 mb-4">
                  <div className='flex'>
                    {
                      uniqueCartItems.slice(0, 4).map((item, index) => <img key={index} className='w-8 mr-2' src={item.imgUrl} />)
                    }
                    {
                      uniqueCartItems.length > 4 && <span className='self-center md:text-sm text-xs italic font-medium text-slate-600 '>+ {uniqueCartItems.length - 4}</span>
                    }
                    {/* {
                      uniqueCartItems.length < newOrder.items.length && <span className='self-center md:text-sm text-xs italic font-medium text-slate-600 '>+ {newOrder.items.length - uniqueCartItems.length}</span>
                    } */}

                  </div>
                  <Link to='/cart' className='md:text-sm text-xs  border-[1px] border-black w-28 justify-center flex items-center rounded'>Edit Cart</Link>
                </div>
                <p className="flex justify-between md:text-base text-sm mb-4">
                  <span className=" text-gray-500 font-medium">Subtotal</span>
                  <span className='font-medium'>${newOrder.subTotal}</span>
                </p>
                <p className='flex justify-between md:text-base text-sm mb-4'>
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className='font-medium'>Free</span>
                </p>
                <p className='flex justify-between md:text-base text-sm md:pb-8 pb-4 md:mb-8 mb-4 border-b-[1px] border-gray-200'>
                  <span className="text-gray-500 font-medium">Tax</span>
                  <span className='font-medium'>${newOrder.tax}</span>
                </p>

                <p className='flex justify-between md:text-base text-sm mb-10 border-gray-200'>
                  <span className="font-medium">Total</span>
                  <span className='font-medium'>${newOrder.total}</span>
                </p>

                <button className='bg-black text-white py-3 px-4 rounded text-center cursor-pointer md:text-sm text-xs w-full md:mb-8 mb-4' onClick={placeHandler}>Place Order</button>
              </div>
          }

        </div>
      </section>
    </PageWrapper>
  )
}

export default Checkout