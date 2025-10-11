import { useQuery } from "@apollo/client"
import { useNavigate, useParams } from "react-router-dom"
import { GET_ORDER_DETAILS_BY_ORDER_NUMBER } from "../../data/query"
import Preloader from "../../components/ui/Preloader"
import { useEffect } from "react"
import { stripTypename } from "@apollo/client/utilities"
import { Order, OrderItem } from "../../store/types"
import getMonth from "../../utils/getMonth"

const UserOrderDetails = () => {


  const navigate = useNavigate()

  const { orderNumber } = useParams()


  const { data, loading, error } = useQuery(GET_ORDER_DETAILS_BY_ORDER_NUMBER, {
    variables: {
      orderNumber: orderNumber
    }
  })

  useEffect(() => {
    if (error)
      navigate('/404')
  }, [error])



  const order: Order = stripTypename(data?.orderByNumber)


  if (loading || !order || Object.keys(order).length < 1) {
    return <Preloader />
  }
  return (
    <div>
      <div className="summary-wrapper mb-20">
        <h1 className="font-bold mb-12">Order Summary</h1>

        <div className="flex items-center gap-x-8 px-8 py-4 border-t-[1px] border-b-[1px] ">
          <span className="text-sm text-slate-500 font-semibold basis-1/3 ">Order Number</span>
          <span className="text-sm text-slate-500 basis-2/3">{order.orderNumber}</span>
        </div>

        <div className="flex items-center gap-x-8 px-8 py-4 border-b-[1px]">
          <span className="text-sm text-slate-500 font-semibold basis-1/3 ">Placed On</span>
          <span className="text-sm text-slate-500 basis-2/3">{new Date(order.orderPlaced).getDate() + ' ' + getMonth((new Date(order.orderPlaced).getMonth() + 1)) + ' ' + (new Date(order.orderPlaced).getFullYear())}</span>
        </div>

        <div className="flex items-center gap-x-8 px-8 py-4 border-b-[1px]">
          <span className="text-sm text-slate-500 font-semibold basis-1/3">Status</span>
          <span className="text-sm text-slate-500 basis-2/3">{order.status}</span>
        </div>

        <div className="flex items-center gap-x-8 px-8 py-4 border-b-[1px]">
          <span className="text-sm text-slate-500 font-semibold basis-1/3">Total</span>
          <span className="text-sm text-slate-500 basis-2/3">{order.total}</span>
        </div>

        <div className="flex items-center gap-x-8 px-8 py-4 border-b-[1px]">
          <span className="text-sm text-slate-500 font-semibold basis-1/3">Shipping Address</span>
          <span className="text-sm text-slate-500 basis-2/3">
            {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postcode}`}
          </span>
        </div>
      </div>

      <h2 className="font-semibold mb-8">Order Items</h2>

      <div className="grid grid-cols-8 items-center gap-x-8 px-8 py-4 border-t-[1px] border-b-[1px] mb-6">
        <span className="">&nbsp;</span>
        <span className="text-sm text-slate-500 font-semibold  col-span-2">Product</span>
        <span className="text-sm text-slate-500 font-semibold">Qty</span>
        <span className="text-sm text-slate-500 font-semibold ">Colour</span>
        <span className="text-sm text-slate-500 font-semibold">Size</span>
        <span className="text-sm text-slate-500 font-semibold">Unit Price</span>
        <span className="text-sm text-slate-500 font-semibold">Subtotal</span>
      </div>

      {
        order.items.map((item: OrderItem) =>

          <div className="grid grid-cols-8 items-center gap-x-8 px-8 py-4  border-b-[1px]" key={item.id}>
            <img className="w-14" src={item.imgUrl} alt="" />

            <span className="text-sm text-slate-500  col-span-2">
              Essential Neutrals
            </span>
            <span className="text-sm text-slate-500">{item.quantity}</span>
            <span className="text-sm text-slate-500 ">{item.color}</span>
            <span className="text-sm text-slate-500">{item.size}</span>
            <span className="text-sm text-slate-500">{item.price}</span>
            <span className="text-sm text-slate-500">{item.price * item.quantity}</span>
          </div>

        )
      }
    </div>
  )
}

export default UserOrderDetails