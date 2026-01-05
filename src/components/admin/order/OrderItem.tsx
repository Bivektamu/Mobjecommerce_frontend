import { Colour, OrderItem as OrderItemType } from '../../../store/types'
import Tooltip from '../../ui/Tooltip'
import { useQuery } from '@apollo/client'
import { GET_PRODUCT_BY_ID } from '../../../data/query/products.query'
import TileLoader from '../../ui/TileLoader'

interface Props {
    item: OrderItemType
}


const OrderItem = ({item}:Props) => {


    const {data, loading} = useQuery(GET_PRODUCT_BY_ID, {
        variables: {
            productId: item.productId
        }
    })

    const product= data?.product

    if(loading || !product) {
       return <TileLoader />
    }

    return (
        <div  className="flex items-center gap-4 mb-6">
            <img src={product.imgs[0].url as string} alt="" className='w-14 h-14 object-cover' />
            <div className='grow'>
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">
                        {product.title}
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

export default OrderItem