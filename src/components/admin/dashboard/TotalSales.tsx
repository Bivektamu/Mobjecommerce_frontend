import { useQuery } from '@apollo/client'
import { FaDollarSign } from 'react-icons/fa'
import { GET_SALES_ANALYTICS } from '../../../data/query/analytics.query'
import ProgressLoader from '../../ui/ProgressLoader'
import { Toast, Toast_Vairant } from '../../../store/types'
import { v4 } from 'uuid'
import { useStoreDispatch } from '../../../store'
import { addToast } from '../../../store/slices/toastSlice'

const TotalSales = () => {
    const dispatch = useStoreDispatch()
    const { data, error, loading } = useQuery(GET_SALES_ANALYTICS, {
        fetchPolicy: 'network-only'
    })

    if (error) {
        const newToast: Toast = {
            id: v4(),
            variant: Toast_Vairant.WARNING,
            msg:error.message
        }
        dispatch(addToast(newToast))
    }

     if (loading) {
        return <ProgressLoader />
    }
    const salesAnalytics = data?.salesAnalytics


    return (
        <div className='bg-white p-4 rounded-xl text-sm shadow'>
            <p className="font-medium text-slate-600 flex justify-between mb-4 items-center">
                <span>Total Sales</span>
                <span className="bg-slate-500 p-2 rounded-lg text-white">
                    <FaDollarSign />
                </span>
            </p>
            <p className="font-semibold text-xl mb-2">$ {salesAnalytics?.sales}</p>
            <p className='text-slate-400 text-xs'>{salesAnalytics?.changeInSales}% vs last month</p>
        </div>
    )
}

export default TotalSales