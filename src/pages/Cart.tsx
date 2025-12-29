import { useEffect, useMemo } from 'react'
import { useStoreDispatch } from '../store/index'
import { useAuth, getAuthStatus } from '../store/slices/authSlice'
import BreadCrumbs from '../components/layout/BreadCrumbs'
import { upDateCart, useCart } from '../store/slices/cartSlice'
import { Order_Status, Status, OrderInput, OrderItemInput, Colour, Size, Address, Cart as CartItemType } from '../store/types'
import CartItem from '../components/CartItem'
import SquareLoader from '../components/ui/SquareLoader'
import { getProducts, useProduct } from '../store/slices/productSlice'
import { Link, useLocation } from 'react-router-dom'
import CustomNavLink from '../components/CustomNavLink'
import PageWrapper from '../components/ui/PageWrapper'


const TAX_RATE: number = 0.1

const Cart = () => {

  const location = useLocation()
  const mergeCart = location?.state?.mergeCart
  const dispatch = useStoreDispatch()
  const { user, status: userStatus } = useAuth()
  const { cart: carts } = useCart()
  const { status } = useProduct()
  useEffect(() => {
    if (status === Status.IDLE)
      dispatch(getProducts())
  }, [status, dispatch])

  useEffect(() => {
    if (userStatus === Status.IDLE)
      dispatch(getAuthStatus())
  }, [userStatus, dispatch])

  useEffect(() => {
    if (mergeCart && user) {

      const guestCartItems = structuredClone(carts.filter(item => !item.userId))

      if (guestCartItems.length > 0) {
        const userCartItems = carts.filter(item => item.userId === user.id)
        for (const item of guestCartItems) {
          item.id = user.id + item.id
        }
        const mapCart = new Map<string, CartItemType>()
        for (const item of userCartItems) {
          mapCart.set(item.id, { ...item })
        }
        for (const item of guestCartItems) {
          if (mapCart.has(item.id)) {
            const itemInMap = mapCart.get(item.id) as CartItemType
            mapCart.set(item.id, ({ ...item, quantity: itemInMap.quantity + item.quantity }))
          }
          else {
            mapCart.set(item.id, { ...item, userId: user.id })
          }
        }

        const newCart = [...Array.from(mapCart.values()), ...carts.filter(item => item.userId && item.userId !== user.id)]
        dispatch(upDateCart(newCart))
      }
    }
  }, [mergeCart, carts, user, dispatch])

  const userCart = useMemo(() => {

    if (carts.length > 0) {

      if (user) {
        return [...carts.filter(cart => cart.userId === user?.id)]
      }
      return [...carts.filter(cart => !cart.userId)]
    }
    return []
  },
    [carts, user]
  )


  const newOrder: OrderInput | null = useMemo(() => {
    if (userCart.length > 0) {
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
        userId: user?.id || '',
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
  }, [userCart, user])


  return (
    <PageWrapper>
      <section id="breadcrums" className="px-4">
        <div className="lg:py-14 py-6 container mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Cart</h2>
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className='w-full bg-white flex justify-center items-center px-4'>
        <div className="container pt-16 lg:pb-36 pb-16 flex lg:gap-28 gap-12 flex-col lg:flex-row">
          <div className="lg:w-2/3 w-full">
            <p className="font-bold md:text-xl text-lg pb-4 border-b-[1px] border-slate-200 md:mb-12 mb-6">Your Cart</p>
            {
              userCart.length < 1 ?
                <p className='md:text-sm text-xs'>
                  Ther are no items in your cart. Please add items to your shopping cart.</p>
                : userCart.map((item) => (<CartItem key={item.id} cartItem={item} />))
            }
          </div>

          {
            status !== Status.FULFILLED ? <SquareLoader square={1} squareClass='lg:w-1/3 w-full h-[400px]' /> : newOrder && newOrder?.subTotal > 0 &&
              <div className="lg:w-1/3 w-full border-slate-200 border-[1px] p-6">
                <p className="font-bold md:text-xl text-lg md:mb-12 mb-6">Order Summary</p>
                <p className="flex justify-between mb-4">
                  <span className=" text-gray-500 font-medium">Subtotal</span>
                  <span className='font-medium'>${newOrder.subTotal}</span>
                </p>
                <p className='flex justify-between mb-4'>
                  <span className="text-gray-500 font-medium">Shipping</span>
                  <span className='font-medium'>Free</span>
                </p>
                <p className='flex justify-between md:pb-8 pb-4 md:mb-8 mb-4 border-b-[1px] border-gray-200'>
                  <span className="text-gray-500 font-medium">Tax</span>
                  <span className='font-medium'>{newOrder.tax}</span>
                </p>

                <p className='flex justify-between mb-10 border-gray-200'>
                  <span className="font-medium">Total</span>
                  <span className='font-medium'>${newOrder.total}</span>
                </p>
                {
                  user ?

                    <CustomNavLink
                      to='/checkout'

                      state={
                        {
                          order: newOrder
                        }
                      }
                      cssClass='bg-black text-white py-3 px-4 rounded text-center cursor-pointer md:text-sm text-xs w-full mb-8 block'>Checkout</CustomNavLink>
                    :
                    <>
                      <CustomNavLink
                        to="/login"
                        state={
                          {
                            mergeCart: true
                          }
                        }
                        cssClass='bg-black text-white py-3 px-4 rounded text-center cursor-pointer md:text-sm text-xs w-full mb-2 block'>Sign in to checkout</CustomNavLink>
                      <p className="md:text-sm text-xs mb-8 text-center text-slate-500 italic">
                        or <CustomNavLink to='/signup?cart=true' cssClass='font-semibold'>Sign up</CustomNavLink>
                      </p>
                    </>
                }
                <div className='block text-center'>
                  <Link to='/collections' className='md:text-sm text-xs font-semibold border-b-[1px] border-black'>Continue Shopping</Link>
                </div>

              </div>
          }

        </div>
      </section >
    </PageWrapper>
  )
}

export default Cart