import { OrderItem } from '../../store/types'
import TileLoader from '../ui/TileLoader'
import { GET_PRODUCT_BY_ID } from '../../data/query/products.query'
import { useQuery } from '@apollo/client'

interface Props {
    item: OrderItem
}
const UserOrderItemTile = ({ item }: Props) => {

    const { data, loading } = useQuery(GET_PRODUCT_BY_ID, {
        variables: {
            productId: item.productId
        }
    })

    const product = data?.product


    if (loading || !product) {
        return <TileLoader />
    }
    return (
        <tr className="border-y border-x lg:border-x-0 rounded lg:text-center grid lg:table-row shadow lg:shadow-none" >
            <td className="grid lg:table-cell justify-center border-b lg:border-b-0 mb-4 lg:mb-0">
                <img className="w-32 lg:w-14" src={product.imgs[0].url!} alt="" />
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2">
                <span className="font-semibold block lg:hidden">Product</span>
                <span className="col-span-2"> Essential Neutrals</span>
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2">
                <span className="font-semibold block lg:hidden">Qty</span>
                <span className="col-span-2">{item.quantity}</span>
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2 ">
                <span className="font-semibold block lg:hidden">Colour</span>
                <span className="col-span-2">{item.color}</span>
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2">
                <span className="font-semibold block lg:hidden">Size</span>
                <span className="col-span-2">{item.size}</span>
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2">
                <span className="font-semibold block lg:hidden">Unit</span>
                <span className="col-span-2">{product.price}</span>
            </td>
            <td className="grid gap-4 lg:table-cell grid-cols-3  text-slate-500 px-4 md:px-8 py-1 md:py-2 pb-4 md:pb-8 lg:pb-2">
                <span className="font-semibold block lg:hidden">Subtotal</span>
                <span className="col-span-2">{product.price * item.quantity}</span>
            </td>
        </tr>
    )
}

export default UserOrderItemTile