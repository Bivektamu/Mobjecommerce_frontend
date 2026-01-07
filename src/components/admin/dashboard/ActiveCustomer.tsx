import { IoPeople } from 'react-icons/io5'
import { useStoreDispatch } from '../../../store'
import { GET_USERS_ANALYTICS } from '../../../data/query/analytics.query'
import { useQuery } from '@apollo/client'
import { Toast, Toast_Vairant } from '../../../store/types'
import { v4 } from 'uuid'
import { addToast } from '../../../store/slices/toastSlice'
import ProgressLoader from '../../ui/ProgressLoader'
import { useEffect } from 'react'

const ActiveCustomer = () => {

    const dispatch = useStoreDispatch()
    const { data, error, loading, stopPolling } = useQuery(GET_USERS_ANALYTICS, {
    pollInterval: 10000,
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
        return <ProgressLoader />
    }
    const userAnalytics = data?.userAnalytics

    return (
        <div className='bg-white p-4 rounded-xl text-sm shadow'>
            <p className="font-medium text-slate-600 flex justify-between mb-4 items-center">
                <span>Active Customer</span>
                <span className="bg-slate-500 p-2 rounded-lg text-white">
                    <IoPeople />
                </span>
            </p>
            <p className="font-semibold text-xl mb-2">{userAnalytics?.users}</p>
            <p className='text-slate-400 text-xs'>{userAnalytics?.changeInUsers}% MoM</p>
        </div>
    )
}

export default ActiveCustomer