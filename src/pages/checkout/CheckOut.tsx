import { MouseEvent, useEffect, useMemo, useState } from 'react'
import { useStoreDispatch } from '../../store/index'
import { useAuth } from '../../store/slices/authSlice'
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
import { CREATE_ORDER } from '../../data/mutation'
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
          userOrdersId: authUser?.id
        },
        fetchPolicy: "network-only", // force fresh fetch
      })

      dispatch(deleteCartByCustomerId(authUser?.id))
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
  const { authUser, status: authStatus } = useAuth()
  const { user } = useUser()
  const [preloaderFlag, setPreloaderFlag] = useState<boolean>(false)

  useEffect(() => {
    if (authStatus !== Status.PENDING && authUser?.role !== Role.CUSTOMER) {
      navigate('/')
    }
  }, [authUser, authStatus])


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
  }, [newOrder])


  const placeHandler = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    let addressValid: boolean
    const { shippingAddress } = newOrder as OrderInput
    // console.log(shippingAddress)
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


  if (preloaderFlag || !newOrder)
    return <Preloader />


  return (
    <PageWrapper>
      {
        authStatus !== Status.FULFILLED && authUser?.role !== Role.CUSTOMER && <Preloader />
      }

      <section id="breadcrums" className="">
        <div className="py-14 container mx-auto">
          <h2 className="text-2xl font-bold mb-4">Checkout</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center'>
        <div className="container pt-16 pb-36 flex gap-28">
          <div className="basis-2/3">
            <p className="font-bold text-xl  border-slate-200 mb-24">Shipping Address</p>

            <ShippingForm />

          </div>
          {/* border-slate-200 border-[1px] */}
          {
            Object.keys(newOrder).length < 1 ? <SquareLoader square={1} squareClass='basis-1/3 h-[400px]' /> : newOrder.total > 0 &&
              <div className="basis-1/3 border-slate-200 border-l-[1px]  pl-16 pr-0">
                <p className="font-bold text-xl mb-12">Order Summary</p>
                <div className="flex justify-between mb-12">
                  <div className='flex'>
                    {
                      uniqueCartItems.map((item, index) => <img key={index} className='w-8 mr-4' src={item.imgUrl} />)
                    }
                    {
                      uniqueCartItems.length < newOrder.items.length && <span className='self-center text-sm italic font-medium text-slate-600 '>+ {newOrder.items.length - uniqueCartItems.length}</span>
                    }

                  </div>
                  <Link to='/cart' className='text-sm  border-[1px] border-black w-28 justify-center flex items-center rounded'>Edit Cart</Link>
                </div>
                <p className="flex justify-between mb-4">
                  <span className=" text-gray-500 font-medium">Subtotal</span>
                  <span className='font-medium'>${newOrder.subTotal}</span>
                </p>
                <p className='flex justify-between mb-4'>
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className='font-medium'>Free</span>
                </p>
                <p className='flex justify-between pb-8 mb-8 border-b-[1px] border-gray-200'>
                  <span className="text-gray-500 font-medium">Tax</span>
                  <span className='font-medium'>${newOrder.tax}</span>
                </p>

                <p className='flex justify-between mb-10 border-gray-200'>
                  <span className="font-medium">Total</span>
                  <span className='font-medium'>${newOrder.total}</span>
                </p>

                <button className='bg-black text-white py-3 px-4 rounded text-center cursor-pointer text-sm w-full mb-8' onClick={placeHandler}>Place Order</button>
              </div>
          }

        </div>
      </section>
    </PageWrapper>
  )
}

export default Checkout