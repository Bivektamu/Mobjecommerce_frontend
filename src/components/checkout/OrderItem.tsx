import { useQuery } from '@apollo/client'
import { GET_PRODUCT_BY_ID } from '../../data/query/products.query'
import TileLoader from '../ui/TileLoader'
import { OrderItem as OrderItemType } from '../../store/types'

interface Props {
    item: OrderItemType
}
const OrderItem = ({ item }: Props) => {
    const { data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        variables: {
            productId: item.productId
        }
    })

    if (loading || !data) {
        return <TileLoader />
    }

    const product = data.product
    return (
        <div className='flex items-center justify-between gap-4'>
        <div className='flex items-center capitalize'>
            <img src={product.imgs[0].url} className='size-28 object-cover' />
            <div className='text-xs'>
                <p className='font-medium text-sm'>{product.title}</p>
                <span className='text-slate-600'>Size: {item.size}</span>
                <br />
                <span className='text-slate-600'>Color: {item.color.toLowerCase()}</span>
                <br />
                <span className='text-slate-600'>Quantity: {item.quantity}</span>
            </div>
        </div>
        <span className='font-medium text-sm'>${item.quantity * product.price}</span>
        </div>
    )
}

export default OrderItem