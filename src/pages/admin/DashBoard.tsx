// import Sidebar from '../../components/ui/Sidebar'
// import { Outlet } from 'react-router-dom'
import { GoAlertFill } from 'react-icons/go'
import MobjePieChart from '../../components/admin/dashboard/MobjePieChart'
import RecentOrders from '../../components/admin/dashboard/RecentOrders/RecentOrders'
import LowStockProducts from '../../components/admin/dashboard/LowStockProducts'
import TotalSales from '../../components/admin/dashboard/TotalSales'
import TotalOrders from '../../components/admin/dashboard/TotalOrders'
import ActiveCustomer from '../../components/admin/dashboard/ActiveCustomer'
import { useStoreDispatch } from '../../store'
import { useQuery } from '@apollo/client'
import { GET_LOW_STOCK_PRODUCTS } from '../../data/query/analytics.query'
import { Toast, Toast_Vairant } from '../../store/types'
import { v4 } from 'uuid'
import { addToast } from '../../store/slices/toastSlice'
import Preloader from '../../components/ui/Preloader'
import SalesOverTime from '../../components/admin/dashboard/SalesOverTime'
import ProgressLoader from '../../components/ui/ProgressLoader'

const DashBoard = () => {

  const dispatch = useStoreDispatch()
  const { data, error, loading } = useQuery(GET_LOW_STOCK_PRODUCTS, {
    fetchPolicy: 'network-only'
  })

  if (error) {
    const newToast: Toast = {
      id: v4(),
      variant: Toast_Vairant.WARNING,
      msg: error.message
    }
    dispatch(addToast(newToast))
  }

  const lowStockProducts = data?.lowStockProducts

  return (
    <section className="container mx-auto ">
      <div className="xl:grid-cols-4 md:grid-cols-2 grid gap-6 mb-6">

        <TotalSales />
        <TotalOrders />
        <ActiveCustomer />

        {
          loading ? <ProgressLoader /> :

            <div className='bg-white p-4 rounded-xl text-sm'>
              <p className="font-medium text-slate-600 flex justify-between mb-4 items-center">
                <span>Low Stock Alerts</span>
                <span className="bg-slate-500 p-2 rounded-lg text-white">
                  <GoAlertFill />
                </span>
              </p>
              <p className="font-semibold text-xl mb-2">{lowStockProducts.length}</p>
              <p className='text-slate-400 text-xs'>{lowStockProducts.length > 0 && 'Check Inventory'}</p>
            </div>
        }
      </div>

      <div className="xl:grid-cols-7 grid-cols-1 grid gap-6 mb-6">
        <SalesOverTime />
        <div className="lg:col-span-3 col-span-full bg-white rounded-xl">
          <p className="font-medium flex justify-between items-center p-4 ">
            <span className='text-sm'>Orders by category</span>
            <span className="text-xs text-slate-400">
              Orders
            </span>
          </p>
          <MobjePieChart />
        </div>
      </div>

      <div className="flex gap-6 mb-6 flex-col xl:flex-row">
        <div className='bg-white  rounded-xl text-sm xl:basis-2/3 basis-full'>
          <RecentOrders />
        </div>

        <div className='bg-white  rounded-xl text-sm xl:basis-1/3 basis-full'>
          {
            loading ? <Preloader /> :
              <LowStockProducts lowProducts={lowStockProducts} />
          }
        </div>
      </div>

    </section>
  )
}

export default DashBoard