import { FaShoppingCart } from 'react-icons/fa'
import { useStoreDispatch } from '../../../store'
import { GET_ORDER_ANALYTICS } from '../../../data/query/analytics.query'
import { Toast, Toast_Vairant } from '../../../store/types'
import { v4 } from 'uuid'
import { addToast } from '../../../store/slices/toastSlice'
import { useQuery } from '@apollo/client'
import { useEffect } from 'react'
import TileLoader from '../../ui/TileLoader'

const TotalOrders = () => {
    const dispatch = useStoreDispatch()
    const { data, error, loading, stopPolling } = useQuery(GET_ORDER_ANALYTICS, {
    pollInterval: 5000,
    })
 useEffect(()=> {
      return(()=>stopPolling())
    }, [stopPolling])


    if (error) {
        const newToast: Toast = {
            id: v4(),
            variant: Toast_Vairant.WARNING,
            msg:error.message
        }
        dispatch(addToast(newToast))
    }


 if (loading) {
        return <TileLoader cssClass='w-full h-32 bg-white' />
    }
    const orderAnalytics = data?.orderAnalytics

    return (
        <div className='bg-white p-4 rounded-xl text-sm shadow'>
            <p className="font-medium text-slate-600 flex justify-between mb-4 items-center">
                <span>Total Orders</span>
                <span className="bg-slate-500 p-2 rounded-lg text-white">
                    <FaShoppingCart />
                </span>
            </p>
            <p className="font-semibold text-xl mb-2">{orderAnalytics?.orders}</p>
            <p className='text-slate-400 text-xs'>{orderAnalytics?.changeInOrders}% vs last month</p>
        </div>
    )
}

export default TotalOrders