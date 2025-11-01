import { MouseEvent, useEffect, useMemo } from 'react'
import { LikedProduct, Status } from '../../store/types'
import { useStoreDispatch } from '../../store'
import { getProducts, useProduct } from '../../store/slices/productSlice'
import getMonth from '../../utils/getMonth'
import SquareLoader from '../ui/SquareLoader'

type Props = {
    item: LikedProduct,
    removeFromWishList: (e: MouseEvent<HTMLButtonElement>, id: string) => void
}

const WishListItem = ({ item, removeFromWishList }: Props) => {

    const dispatch = useStoreDispatch()
    const { products, status } = useProduct()

    useEffect(() => {
        if (status === Status.IDLE)
            dispatch(getProducts())
    }, [status])

    const product = useMemo(() => products.filter(product => product.id === item.id)[0], [products, item])

    return (
        <div className="flex flex-col md:flex-row items-center justify-between border-b-[1px] py-12">
            <div className="flex items-center gap-0 md:gap-6 flex-col md:flex-row w-full text-center md:text-left">
                {
                    !product ? <SquareLoader square={1} squareClass='min-w-20 min-h-20 mb-4' /> :
                        <img src={product.imgs[0].url} alt="UTRAANET Black" className="w-36 md:w-20 h-auto md:h-20 object-contain" />
                }

                <div className='w-full'>
                    <h3 className="font-semibold mb-2">{!product ? <SquareLoader square={1} squareClass='min-w-32 max-h-4 inline-block' /> : product.title}</h3>
                    <p className="text-xs font-medium mb-2 text-slate-600">
                        <span className="font-semibold md:font-normal">Added on</span>:&nbsp;
                        {
                            !product ? <SquareLoader square={1} squareClass='min-w-20 max-h-4 inline-block' /> :
                                <span>{new Date(item.createdAt).getDate() + ' ' + getMonth((new Date(item.createdAt).getMonth() + 1)) + ' ' + (new Date(item.createdAt).getFullYear())}</span>
                        }
                    </p>
                    <p className="block md:hidden mb-6 text-sm">
                        <span className="font-semibold font-medium mb-2">Price:</span>
                        {
                            !product ? <SquareLoader square={1} squareClass='min-w-20 max-h-6 inline-block md:hidden' /> :
                                <span className="text-slate-600">$ {product.price}</span>
                        }
                    </p>


                    <button className="text-sm font-medium hidden md:block" onClick={e => removeFromWishList(e, item.id)}>Remove Item</button>
                </div>
            </div>
            <div className="flex items-center  gap-4">
                {
                    !product ? <SquareLoader square={1} squareClass='min-w-20 max-h-6 hidden md:block' /> :
                        <span className="font-semibold hidden md:block">$&nbsp;{product.price}</span>

                }
                <button className="bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-xs block md:hidden" onClick={e => removeFromWishList(e, item.id)}>Remove Item</button>
                {
                    !product ? <SquareLoader square={1} squareClass='min-w-24 ' /> :
                        <a className="text-xs md:text-sm border-[1px] py-2 px-4 md:p-2  border-slate-700 font-medium md:w-[120px] text-center rounded" href={`/collections/${product.slug}`}>Add to cart</a>


                }
            </div>
        </div>
    )
}

export default WishListItem