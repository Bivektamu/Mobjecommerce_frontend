import { MouseEvent, useEffect, useMemo } from 'react'
import { LikedProduct, Status } from '../../store/types'
import { useStoreDispatch } from '../../store'
import { getProducts, useProduct } from '../../store/slices/productSlice'
import getMonth from '../../utils/getMonth'
import SquareLoader from '../ui/SquareLoader'

type Props = {
    item: LikedProduct,
    removeFromWishList: (e:MouseEvent<HTMLButtonElement>,id:string)=>void
}

const WishListItem = ({ item, removeFromWishList }: Props) => {

    const dispatch = useStoreDispatch()
    const { products, status } = useProduct()

    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getProducts())
    }, [status])

    const product = useMemo(() => products.filter(product => product.id === item.id)[0], [products, item])

    if(!product) {
        return <SquareLoader square={4} />
    }

    return (
        <div className="flex items-center justify-between border-b-[1px] py-12">
            <div className="flex items-center gap-6 ">
                <img src={product.imgs[0].url} alt="UTRAANET Black" className="w-20 h-20 object-contain" />
                <div>
                    <h3 className="font-semibold mb-2">{product.title}</h3>
                    <p className="text-xs font-medium mb-2 text-slate-600">Added on: {new Date(item.createdAt).getDate() +' '+getMonth((new Date(item.createdAt).getMonth() + 1)) + ' ' + (new Date(item.createdAt).getFullYear())}</p>
                    <button className="text-sm font-medium" onClick={e=>removeFromWishList(e, item.id)}>Remove Item</button>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <p className="font-semibold mr-4">$ {product.price}</p>

                <a className="text-sm border-[1px] p-2  border-slate-700 font-medium w-[120px] text-center rounded" href={`/collections/${product.slug}`}>Add to cart</a>
            </div>
        </div>
    )
}

export default WishListItem