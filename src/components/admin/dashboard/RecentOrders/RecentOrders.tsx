import { useQuery } from '@apollo/client'
import { useStoreDispatch } from '../../../../store'
import { GET_ORDERS } from '../../../../data/query/orders.query'
import { Order, Toast, Toast_Vairant } from '../../../../store/types'
import { v4 } from 'uuid'
import { addToast } from '../../../../store/slices/toastSlice'
import ProgressLoader from '../../../ui/ProgressLoader'
import UserInfo from './UserInfo'
import { NavLink } from 'react-router-dom'

const RecentOrders = () => {

  const dispatch = useStoreDispatch()


  const { data, error, loading } = useQuery(GET_ORDERS, {
    variables: { limit: 10 },
    pollInterval: 2000,

  })
  if (error) {
    console.log(error.networkError)
    const newToast: Toast = {
      id: v4(),
      variant: Toast_Vairant.WARNING,
      msg: error.message
    }
    dispatch?.(addToast(newToast))
  }


  const orders = data?.orders
  if (loading || !orders) {
    return <ProgressLoader />
  }
  return (
    <div>
      <p className="font-semibold p-4 text-slate-600 flex justify-between items-center bg-regal-white lg:bg-inherit">
        <span>Recent Orders</span>
        <NavLink to='/admin/orders' className="bg-cultured p-2 text-xs rounded border border-slate-600 px-4">
          View All
        </NavLink>
      </p>

      <div className="lg:grid grid-cols-9 gap-x-4 p-4 border-t-[1px] border-b-[1px] hidden ">
        <span className='text-xs text-slate-500 font-medium col-span-2'>
          Order Number
        </span>
        <span className='text-xs text-slate-500 font-medium '>
          Items
        </span>
        <span className='text-xs text-slate-500 font-medium col-span-2'>
          Customer
        </span>
        <span className='text-xs text-slate-500 font-medium col-span-2'>
          Status
        </span>
        <span className='text-xs text-slate-500 font-medium'>
          Total
        </span>
        <span className='text-xs text-slate-500 font-medium'>
          Date
        </span>
      </div>

      <div className="bg-cultured w-full overflow-auto">
        {
          orders.slice(0, 10).map((order: Order) =>
            <div key={order.id} className='bg-white grid grid-cols-1 lg:grid-cols-9  px-4 py-2 lg:border-b-[1px] items-center gap-x-4 gap-y-2 rounded lg:rounded-none shadow lg:shadow-none lg:mb-0 mb-4'>

              <div className="flex justify-between items-center lg:col-span-2">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Order Number</span>
                <span className="xl:text-sm text-xs text-slate-500 ">
                  {order.orderNumber}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Items</span>
                <span className="xl:text-sm text-xs text-slate-500 capitalize">
                  {order.items.length}
                </span>
              </div>

              <div className="flex justify-between items-center  lg:col-span-2">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Customer</span>
                <UserInfo id={order.userId} />
              </div>


              <div className="flex justify-between items-center  lg:col-span-2">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Status</span>
                <span className={`xl:text-sm text-xs text-slate-500 capitalize ${order.status.toLocaleLowerCase()}`}>{order.status.toLowerCase()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Total</span>
                <span className="xl:text-sm text-xs text-slate-500">{order.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="xl:text-sm text-xs text-slate-500 font-semibold lg:hidden">Date</span>
                <span className="xl:text-sm text-xs text-slate-500">{(new Date(order.createdAt).toLocaleString()).split(',')[0]}</span>
              </div>



              {/* <span className="text-xs text-slate-500 ">{order.orderNumber}</span> */}
              {/* <span className="text-xs text-slate-500 capitalize">{order.items.length}</span> */}

              {/* <UserInfo id={order.userId} /> */}
              {/* <span className="text-xs text-slate-500 capitalize">{order.status}</span>
            <span className="text-xs text-slate-500">$ {order.total}</span>
            <span className="text-xs text-slate-500">{(new Date(order.createdAt).toLocaleString()).split(',')[0]}</span> */}
            </div>
          )
        }
      </div>
    </div>
  )
}

export default RecentOrders