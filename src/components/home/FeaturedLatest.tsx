import Grids from '../ui/Grids'
import { Product, Status } from '../../store/types'
import GridLoader from '../ui/GridLoader'
import { useEffect, useState } from 'react'
import ProductCard from '../ui/ProductCard'

type Props = {
    products: Product[],
    status: Status
}

const FeaturedLatest = ({ products, status }: Props) => {
    const [sortProducts, setSortProducts] = useState<Product[]>([])
    const [isFeatured, setIsFeatured] = useState(true)

    useEffect(() => {
        if (isFeatured)
            setSortProducts(products.filter(product => product.featured).slice(0, 4))
        else {
            setSortProducts(products.slice(products.length - 4))
        }
    }, [isFeatured, products])

    return (
        <section id="featured-latest" className="bg-white py-32 px-4">
            <div className="flex justify-center gap-8 mb-16">
                <button className={`text-xs font-semibold flex items-center uppercase ${isFeatured ? 'bg-black text-white' : 'text-black border-slate-300'} border-[1px] py-[5px] px-6 rounded-[20px]`} onClick={() => setIsFeatured(true)}>Featured</button>
                <button className={`text-xs font-semibold flex items-center uppercase ${!isFeatured ? 'bg-black text-white' : 'text-black border-slate-300'} border-[1px] py-[5px] px-6 rounded-[20px]`} onClick={() => setIsFeatured(false)}>Latest</button>
            </div>

            {(status === Status.PENDING) ? <GridLoader col='4' /> : products.length < 1 ? <h2 className="text-lg text-slate-600 text-center">Sorry, there are no products.</h2> :
                <Grids cssClass='container mx-auto lg:grid-cols-4 md:grid-cols-1 grid gap-12'>
                    {
                        sortProducts.map(product =>
                            <ProductCard key={product.id} item={product} />
                        )
                    }
                </Grids>
            }
        </section>
    )
}

export default FeaturedLatest