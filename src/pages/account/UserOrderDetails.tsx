import { useQuery } from "@apollo/client"
import { useParams } from "react-router-dom"
import { GET_ORDER_DETAILS_BY_ORDER_NUMBER } from "../../data/query/orders.query"
import Preloader from "../../components/ui/Preloader"
import { stripTypename } from "@apollo/client/utilities"
import { Order, OrderItem } from "../../store/types"
import getMonth from "../../utils/getMonth"
import UserOrderItemTile from "../../components/account/UserOrderItemTile"

const UserOrderDetails = () => {
  const { orderNumber } = useParams()

  const { data, loading } = useQuery(GET_ORDER_DETAILS_BY_ORDER_NUMBER, {
    variables: {
      orderNumber: orderNumber
    }
  })

  const order: Order = stripTypename(data?.orderByNumber)


  if (loading || !order) {
    return <Preloader />
  }
  return (
    <div>
      <div className="summary-wrapper mb-10 md:mb-20">
        <h1 className="font-bold mb-6 md:mb-12">Order Summary</h1>

        <table className="w-full table-auto border-collapse  rounded text-xs md:text-sm">
          <tr className="border-y">
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 font-semibold  ">Order Number</span>
            </td>
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500">{order.orderNumber}</span>
            </td>
          </tr>

          <tr className="border-y">
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 font-semibold basis-1/3 border-r ">Placed On</span>
            </td>
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 basis-2/3">{new Date(order.createdAt).getDate() + ' ' + getMonth((new Date(order.createdAt).getMonth() + 1)) + ' ' + (new Date(order.createdAt).getFullYear())}</span>
            </td>
          </tr>

          <tr className="border-y">
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 font-semibold basis-1/3 border-r">Status</span>
            </td>
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 basis-2/3">{order.status}</span>
            </td>
          </tr>

          <tr className="border-y">
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 font-semibold basis-1/3 border-r">Total</span>
            </td>
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 basis-2/3">{order.total}</span>
            </td>
          </tr>

          <tr className="border-y">
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 font-semibold basis-1/3 border-r">Shipping Address</span>
            </td>
            <td className=" px-2 md:px-4 py-2">
              <span className="text-slate-500 basis-2/3">
                {`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state}, ${order.shippingAddress.postcode}`}
              </span>
            </td>
          </tr>
        </table>
      </div>

      <h2 className="font-semibold mb-8">Order Items</h2>

      <table className="w-full block gap-8 lg:table table-auto border-collapse  rounded text-xs md:text-sm">
        <thead className="hidden lg:table-header-group">
          <tr className="border-y">
            <th className="px-4 py-2">&nbsp;</th>
            <th className=" text-slate-500 font-semibold px-4 py-2">Product</th>
            <th className=" text-slate-500 font-semibold px-4 py-2">Qty</th>
            <th className=" text-slate-500 font-semibold px-4 py-2 ">Colour</th>
            <th className=" text-slate-500 font-semibold px-4 py-2">Size</th>
            <th className=" text-slate-500 font-semibold px-4 py-2">Unit Price</th>
            <th className=" text-slate-500 font-semibold px-4 py-2">Subtotal</th>
          </tr>
        </thead>
        <tbody className="w-full grid grid-cols-1 gap-8 lg:table-row-group ">
          {
            order.items.map((item: OrderItem) => <UserOrderItemTile key={item.productId+item.color+item.size} item={item} />
            )
          }
        </tbody>

      </table>

    </div>
  )
}

export default UserOrderDetails