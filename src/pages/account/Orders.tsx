import { useQuery } from "@apollo/client"
import { Link } from "react-router-dom"
import {  GET_ORDERS_BY_USER_ID } from "../../data/query/orders.query"
import {  useMemo } from "react"
import { stripTypename } from "@apollo/client/utilities"
import ProgressLoader from "../../components/ui/ProgressLoader"
import { IoFileTrayOutline } from "react-icons/io5"
import Arrow from "../../components/ui/Arrow"
import { Order } from "../../store/types"
import getMonth from "../../utils/getMonth"
import { useAuth } from "../../store/slices/authSlice"

const UserOrders = () => {

  const {authUser} = useAuth()

  const { data, loading, error } = useQuery(GET_ORDERS_BY_USER_ID, {
    variables:{
      userOrdersId: authUser?.id
    },
  })
  const refinedData = useMemo(() => {
    if (data && data.userOrders.length > 0) {
      return stripTypename(data.userOrders)
    }
    return []
  }, [data])

  if (loading) {
    return <ProgressLoader />
  }



  if (error) {
    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-max m-auto flex justify-center flex-col items-center">

          <p className="text-slate-400 text-sm mb-8">Sorry there was an error while fetching orders. Please refresh page again.</p>

        </div>
      </div>
    )
  }

  else if (refinedData.length === 0)

    return (
      <div className="flex justify-center items-center h-full">
        <div className="w-max m-auto flex justify-center flex-col items-center">
          <IoFileTrayOutline className="mb-10 w-[100px] h-[100px] stroke-slate-600" />
          <p className="text-slate-400 text-sm mb-8">Your order history is waiting to be filled.
            Start Shopping</p>
          <Link to='/collections' className="bg-black text-white py-3  rounded text-center cursor-pointer text-sm flex gap-x-4 justify-center items-center w-[180px]"
          >Start Shopping <Arrow /></Link>
        </div>
      </div>
    )
  else
    return (
      <>
        <h2 className="font-bold mb-16">Orders</h2>
        <div className="grid grid-cols-ui-table-order items-center gap-x-8 px-8 py-4 border-t-[1px] border-b-[1px] mb-6">
          <span className="text-sm text-slate-500 font-semibold ">Order Number</span>
          <span className="text-sm text-slate-500 font-semibold">Date</span>
          <span className="text-sm text-slate-500 font-semibold ">Items</span>
          <span className="text-sm text-slate-500 font-semibold">Total</span>
          <span className="text-sm text-slate-500 font-semibold">Status</span>
          <span className="text-sm text-slate-500 font-semibold">Action</span>
        </div>

        {
          refinedData.map((order: Order) => (
            <div key={order.id} className="grid grid-cols-ui-table-order items-center justify-between gap-x-8 px-8 py-4 border-b-[1px] ">
              <span className="text-sm text-slate-500 ">{order.orderNumber}</span>
              <span className="text-sm text-slate-500">{new Date(order.orderPlaced).getDate() +' '+getMonth((new Date(order.orderPlaced).getMonth() + 1)) + ' ' + (new Date(order.orderPlaced).getFullYear())}</span>
              <span className="text-sm text-slate-500 ">{order.items.length}</span>
              <span className="text-sm text-slate-500">{order.total}</span>
              <span className="text-sm text-slate-500">{order.status}</span>
              <Link to={`./${order.orderNumber}`} className="text-sm text-slate-600 border-[1px] p-2  border-slate-600 font-medium w-[120px] text-center rounded" >View Details</Link>
            </div>
          ))
        }
      </>
    )
}

export default UserOrders