import { LowStockProduct } from "../../../store/types"

type Props = {
    lowProducts: LowStockProduct[]
}
const LowStockProducts = ({ lowProducts }: Props) => {
    return (
        <div>
            <p className="font-semibold p-4 text-slate-600">
                Low Stock Products
            </p>

            <div className='p-4 flex flex-col gap-4'>

                {
                    lowProducts.length < 1 ? <span className="text-xs">There are no low stock products.</span> :
                        lowProducts.map((product) =>
                            <div key={product._id} className="flex items-center gap-4  rounded pr-3 border-[1px] justify-between shadow-lg">
                                <div className="flex items-center gap-2">
                                    <img src={product.heroImg} alt="" className="w-16 h-16" />
                                    <div className="">
                                        <p className="text-xs font-medium">{product.title}</p>
                                        <p className="text-xs text-slate-500 uppercase">SKU: {product.sku}</p>
                                    </div>
                                </div>
                                <p className="font-medium">
                                    <span>{product.quantity}</span> <span>pcs</span>
                                </p>
                            </div>
                        )
                }
            </div>
        </div>
    )
}

export default LowStockProducts