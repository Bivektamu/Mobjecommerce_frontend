import { Order } from '../../../store/types'
import getMonth from '../../../utils/getMonth'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../../../data/query/user.query'
import ProgressLoader from '../../ui/ProgressLoader'
import { useEffect } from 'react'
import useAvatar from '../../hooks/useAvatar'
import OrderItem from './OrderItem'
type Props = {
    order: Order
}


const OrderDetails = ({ order }: Props) => {


    const { avatar, setAvatarEmail } = useAvatar()

    const { loading, data } = useQuery(GET_USER, {
        variables: {
            userId: order.userId
        }
    })


    const user = data?.user

    useEffect(() => {
        if (user) {
            setAvatarEmail(user.email)
        }

    }, [user])


    if (loading) {
        return <ProgressLoader />
    }


    return (
        <section className='text-left'>
            <p className="font-medium text-slate-900 mb-6 pb-2 border-b-[1px] text-lg">Order Detail</p>
            <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-500">Ordered on:</span>
                {
                    (new Date(order.createdAt)).getDate() + ' ' + getMonth((new Date(order.createdAt)).getMonth() + 1) + ' ' + (new Date(order.createdAt).getFullYear())
                }

            </div>

            <div className="flex items-center justify-between ">
                <span className="text-sm font-medium text-slate-500">Status:</span>
                <span className={`text-sm font-medium capitalize ${order.status.toLowerCase()}`}>{order.status.toLocaleLowerCase()}</span>
            </div>

            <p className="font-medium text-slate-900 mt-10 mb-6 pb-2 border-b-[1px] text-lg">User</p>
            <div className="flex items-center gap-4 mb-6">

                <span className='w-20 h-20'>
                    {
                        avatar
                    }
                </span>

                <div className=''>
                    {
                        user?<span className=" font-medium">{user?.firstName + ' ' + user?.lastName}</span>:
                        <span>Inactive User</span>
                    }
                    
                    <br />
                    <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
                </div>
            </div>

            <p className="font-medium text-slate-900 mt-10 mb-6 pb-2 border-b-[1px] text-lg">Ordered Items</p>
            {
                order.items.map(item => <OrderItem item={item} key={item.productId + item.size + item.color} />
                )
            }

            <div className='border-t-[1px] pt-4  w-full flex justify-between'>
                <span className="text-sm text-slate-500 font-medium">Total</span>
                <span className="text-sm text-slate-800 font-medium">$ {order.total}</span>
            </div>



        </section>
    )
}

export default OrderDetails