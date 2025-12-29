import { useQuery } from '@apollo/client'
import { useStoreDispatch } from '../../../store'
import SalesChart from './SalesChart'
import { GET_SALES_OVER_TIME } from '../../../data/query/analytics.query'
import { Toast, Toast_Vairant } from '../../../store/types'
import { v4 } from 'uuid'
import { addToast } from '../../../store/slices/toastSlice'
import ProgressLoader from '../../ui/ProgressLoader'
import { stripTypename } from '@apollo/client/utilities'

const SalesOverTime = () => {
    const dispatch = useStoreDispatch()
    const { data, error, loading } = useQuery(GET_SALES_OVER_TIME, {
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

    const salesOverTime = stripTypename(data?.salesOverTime)

    return (
        <div className="xl:col-span-4 col-span-full bg-white rounded-xl shadow">
            <p className="font-medium flex justify-between mb-4 items-center p-4 ">
                <span className='text-sm'>Sales Over Time</span>
                <span className="text-xs text-slate-400">
                    Sales (AUD)
                </span>
            </p>
            {
                salesOverTime.length < 1 ? <div className='mb-4 text-slate-400 p-4 italic'>Sorry, no sales has been made yet over 30 days</div> :
                    <SalesChart data={salesOverTime} />
            }
        </div>
    )
}

export default SalesOverTime