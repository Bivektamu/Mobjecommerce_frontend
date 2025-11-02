import { Order, Colour } from '../../../store/types'
import getMonth from '../../../utils/getMonth'
import Tooltip from '../../ui/Tooltip'
import { useQuery } from '@apollo/client'
import { GET_USER } from '../../../data/query/user.query'
import ProgressLoader from '../../ui/ProgressLoader'
import { useEffect } from 'react'
import useAvatar from '../../hooks/useAvatar'
import ProductTitle from './ProductTitle'
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
                    (new Date(order.orderPlaced)).getDate() + ' ' + getMonth((new Date(order.orderPlaced)).getMonth() + 1) + ' ' + (new Date(order.orderPlaced).getFullYear())
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
                    <span className=" font-medium">{user?.firstName + ' ' + user?.lastName}</span>
                    <br />
                    <span className="text-xs text-slate-500 font-medium">{user?.email}</span>
                </div>
            </div>

            <p className="font-medium text-slate-900 mt-10 mb-6 pb-2 border-b-[1px] text-lg">Ordered Items</p>
            {
                order.items.map(item => {


                    return (
                        <div key={item.productId + item.size + item.color} className="flex items-center gap-4 mb-6">
                            <img src={item.imgUrl as string} alt="" className='w-14 h-14' />
                            <div className='grow'>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium">
                                        <ProductTitle id={item.productId} />
                                    </span>
                                    <div className='flex items-center gap-2'>
                                        <span className={`w-3 h-3 rounded-full relative group bg-${item.color.toLowerCase()}${item.color === Colour.BLACK ? '' : '-600'} block`}>
                                            <Tooltip title='color' />
                                        </span>
                                        <span className='w-3 h-[1px] bg-black text-sm'></span>
                                        <span className='text-xs relative group'>
                                            {item.size}
                                            <Tooltip title='size' />
                                        </span>
                                    </div>
                                </div>
                                <div className='flex items-center gap-2'>
                                    <span className="text-xs text-slate-500 font-medium">$ {item.price}</span>
                                    <span className='w-3 h-[1px] bg-black text-sm'></span>
                                    <span className='text-xs relative group'>Quantity: {item.quantity}
                                    </span>
                                </div>


                            </div>
                        </div>)
                }
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