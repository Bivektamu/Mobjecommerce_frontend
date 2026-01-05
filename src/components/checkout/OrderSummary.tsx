import SquareLoader from '../ui/SquareLoader'
import OrderItem from './OrderItem'
import { OrderInput } from '../../store/types'

interface Props {
    order: OrderInput
}

const OrderSummary = ({ order }:Props) => {

    if (Object.keys(order).length < 1 || !order)
        return <SquareLoader square={1} squareClass='xl:w-1/3 md:w-1/2 w-full h-[400px]' />

    return (
        <div className="xl:w-1/3 md:w-1/2 w-full border-slate-200 border-[1px] md:border-[0] md:border-l-[1px]  md:pl-16 p-4 md:p-0">
            <p className="font-bold md:text-xl text-lg md:mb-12 mb-4">Order Summary</p>
            <div className=" md:mb-12 mb-4">
                {
                    order.items.map(item => <OrderItem key={`${item.productId}${item.size}${item.color}`} item={item} />)
                }

                {/* <Link to='/cart' className='md:text-sm text-xs  border-[1px] border-black w-28 justify-center flex items-center rounded'>Edit Cart</Link> */}
            </div>
            <p className="flex justify-between md:text-base text-sm mb-4">
                <span className=" text-gray-500 font-medium">Subtotal</span>
                <span className='font-medium'>${order.subTotal}</span>
            </p>
            <p className='flex justify-between md:text-base text-sm mb-4'>
                <span className="text-gray-500 font-medium">Shipping</span>
                <span className='font-medium'>Free</span>
            </p>
            <p className='flex justify-between md:text-base text-sm md:pb-8 pb-4 md:mb-8 mb-4 border-b-[1px] border-gray-200'>
                <span className="text-gray-500 font-medium">Tax</span>
                <span className='font-medium'>${order.tax}</span>
            </p>

            <p className='flex justify-between md:text-base text-sm mb-10 border-gray-200'>
                <span className="font-medium">Total</span>
                <span className='font-medium'>${order.total}</span>
            </p>
        </div>

    )
}

export default OrderSummary