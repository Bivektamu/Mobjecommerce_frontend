import { Product } from '../../store/types'
import CustomNavLink from '../CustomNavLink'

type Props = {
    item: Product
}

const ProductCard = ({ item }: Props) => {
    return (
        <div>
            <CustomNavLink to={`/collections/${item.slug}`} cssClass="bg-cultured mb-8 group justify-center flex items-center  aspect-[2/2.3]">
                <img src={item.imgs[0].url} alt="" className="w-3/5 group-hover:scale-125 transition-all" />
            </CustomNavLink>
            <p className="font-semibold mb-4">{item.title}</p>
            <div className="flex gap-x-4 items-center">
                {
                    item.stockStatus ? <span className="text-xs font-semibold flex items-center uppercase text-black border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px]">in stock</span> : <span className='text-xs font-semibold flex items-center uppercase text-slate-400 border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px]'>out of stock</span>
                }
                <span className="text-slate-600 text-xs">${item.price}</span>
            </div>
        </div>
    )
}

export default ProductCard