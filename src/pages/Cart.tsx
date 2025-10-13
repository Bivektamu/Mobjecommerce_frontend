import { useEffect, useMemo } from 'react'
import { useStoreDispatch } from '../store/index'
import { useAuth, getAuthStatus } from '../store/slices/authSlice'
import BreadCrumbs from '../components/layout/BreadCrumbs'
import { useCart } from '../store/slices/cartSlice'
import { Order_Status, Status, OrderInput, OrderItemInput, Colour, Size, Address } from '../store/types'
import CartItem from '../components/CartItem'
import SquareLoader from '../components/ui/SquareLoader'
import { getProducts, useProduct } from '../store/slices/productSlice'
import { Link } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import PageWrapper from '../components/ui/PageWrapper'


const TAX_RATE: number = 0.1

const Cart = () => {

  const dispatch = useStoreDispatch()
  const { authUser, status: userStatus } = useAuth()
  const { cart: carts } = useCart()
  const { status } = useProduct()
  useEffect(() => {
    dispatch(getProducts())
  }, [])

  useEffect(() => {
    if (userStatus === Status.IDLE)
      dispatch(getAuthStatus())
  }, [userStatus])

  const userCart = useMemo(() => {

    if (carts.length > 0) {
      if (authUser) {
        return [...carts.filter(cart => cart.userId === authUser?.id)]
      }
      return [...carts.filter(cart => !cart.userId)]
    }
    return []
  },
    [carts, authUser]
  )


  const newOrder: OrderInput | null = useMemo(() => {
    if (userCart.length > 0 && authUser) {
      const subTotal = userCart.reduce((sum, item) => sum += ((item.price as number) * item.quantity), 0)
      const tax = parseFloat((subTotal * TAX_RATE).toFixed(2))

      const items: OrderItemInput[] = userCart.map((item) => ({
        productId: item.productId,
        color: item.color as Colour,
        quantity: item.quantity,
        size: item.size as Size,
        price: item.price as number,
        imgUrl: item.imgUrl
      }))

      const order: OrderInput = {
        userId: authUser?.id,
        status: Order_Status.PENDING,
        items,
        subTotal: subTotal,
        tax: tax,
        total: parseFloat((subTotal + tax).toFixed(2)),
        shippingAddress: {} as Address
      }

      return order
    }
    else return null
  }, [userCart, authUser])


  return (
    <PageWrapper>
      <section id="breadcrums" className="">
        <div className="py-14 container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Cart</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center'>
        <div className="container pt-16 pb-36 px-8 flex gap-28">
          <div className="basis-2/3">
            <p className="font-bold text-xl pb-4 border-b-[1px] border-slate-200 mb-12">Your Cart</p>
            {
              userCart.length < 1 ?
                <p className='text-sm'>
                  Ther are no items in your cart. Please add items to your shopping cart.</p>
                : userCart.map((item) => (<CartItem key={item.id} cartItem={item} />))
            }
          </div>

          {
            status !== Status.FULFILLED ? <SquareLoader square={1} squareClass='basis-1/3 h-[400px]' /> : newOrder && newOrder?.subTotal > 0 &&
              <div className="basis-1/3 border-slate-200 border-[1px] p-6">
                <p className="font-bold text-xl mb-12">Order Summary</p>
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
                  <span className='font-medium'>{newOrder.tax}</span>
                </p>

                <p className='flex justify-between mb-10 border-gray-200'>
                  <span className="font-medium">Total</span>
                  <span className='font-medium'>${newOrder.total}</span>
                </p>
                {
                  authUser ?

                    <CustomNavLink
                      to='/checkout'

                      state={
                        {
                          order: newOrder
                        }
                      }
                      cssClass='bg-black text-white py-3 px-4 rounded text-center cursor-pointer text-sm w-full mb-8 block'>Checkout</CustomNavLink>
                    :
                    <>
                      <CustomNavLink to="/login?cart=true" cssClass='bg-black text-white py-3 px-4 rounded text-center cursor-pointer text-sm w-full mb-2 block'>Sign in to checkout</CustomNavLink>
                      <p className="text-sm mb-8 text-center text-slate-500 italic">
                        or <CustomNavLink to='/signup?cart=true' cssClass='font-semibold'>Sign up</CustomNavLink>
                      </p>
                    </>
                }
                <div className='block text-center'>
                  <Link to='/collections' className='text-sm font-semibold border-b-[1px] border-black'>Continue Shopping</Link>
                </div>

              </div>
          }

        </div>
      </section >
    </PageWrapper>
  )
}

export default Cart