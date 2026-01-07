import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useStoreDispatch } from '../../../store';
import { useQuery } from '@apollo/client';
import { GET_ORDERS_BY_CATEGORY } from '../../../data/query/analytics.query';
import { Toast, Toast_Vairant } from '../../../store/types';
import { v4 } from 'uuid';
import { addToast } from '../../../store/slices/toastSlice';
import ProgressLoader from '../../ui/ProgressLoader';
import { useEffect } from 'react';


const COLOR_PALETTES = [
    "rgba(99,102,241, 0.5)",  // indigo
    "rgba(34,197,94, 0.5)",   // green
    "rgba(239,68,68, 0.5)",   // red
    "rgba(245,158,11, 0.5)",  // amber
    "rgba(129,140,248, 0.5)", // light indigo
    "rgba(250,204,21, 0.5)",  // yellow
    "rgba(59,130,246, 0.5)",  // blue
    "rgba(74,222,128, 0.5)",  // light green
    "rgba(248,113,113, 0.5)", // light red
    "rgba(147,197,253, 0.5)", // light blue
];


const MobjePieChart = () => {
    const dispatch = useStoreDispatch()
    const { data, error, loading, stopPolling } = useQuery(GET_ORDERS_BY_CATEGORY, {
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

    const ordersByCategory = data?.ordersByCategory

    if (ordersByCategory.length < 1) {
        return <div className='italic text-slate-400 mb-4 p-4'>Sorry, no orders has been made yet over 30 days</div>
    }
    return (
        <ResponsiveContainer width="100%" height={400}>
            <PieChart>
                <Pie
                    data={ordersByCategory}
                    dataKey="count"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    // innerRadius={70}
                    label={{ fontSize: 10 }}
                >
                    {
                        // eslint-disable-next-line
                        ordersByCategory.map((_: any, index: number) =>
                            <Cell key={`cell-${index}`} fill={COLOR_PALETTES[index]} />
                        )
                    }

                </Pie>

                <Tooltip
                    contentStyle={{ fontSize: 10, textTransform: 'capitalize' }}

                />
            </PieChart>

        </ResponsiveContainer>
    )
}

export default MobjePieChart