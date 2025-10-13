import  { ChangeEvent, Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Colour, Filters, PriceRange, Product, Size, Status } from '../../store/types'
import TextLoader from '../ui/TextLoader'
import CircleLoader from '../ui/CircleLoader'
import SquareLoader from '../ui/SquareLoader'
import getClasses from '../../utils/getClasses'
type Props = {
    products: Product[],
    status: Status,
    setFilters: Dispatch<SetStateAction<Filters>>,
    filters: Filters
}

const INIT_COLORS = {
    [Colour.BLACK]: false,
    [Colour.RED]: false,
    [Colour.AMBER]: false,
    [Colour.GRAY]: false,
    [Colour.WHITE]: false
}

const INIT_SIZES = {
    [Size.SMALL]: false,
    [Size.MEDIUM]: false,
    [Size.LARGE]: false,
    [Size.EXTRA_LARGE]: false
}

type FilterKey = {
    [key: string]: boolean
}

const ProductFilter = ({ products, status, setFilters, filters }: Props) => {

    const [cats, setCats] = useState<FilterKey>({})
    const [colrs, setColrs] = useState<FilterKey>(INIT_COLORS)
    const [siz, setSiz] = useState<FilterKey>(INIT_SIZES)


    useEffect(() => {
        if (products.length > 0) {
            const categories = new Set(products.map((product: Product) => product.category))
            for (const cat of categories) {
                setCats((prev) => ({ ...prev, [cat]: false }))
            }
        }
    }, [products])

    useEffect(() => {
        const temp = { ...cats }

        if (Object.keys(temp).length > 0) {
            Object.keys(temp).map((key) => {
                temp[key] = false
            })
            filters.category.map(cat => temp[cat] = true)
            setCats({ ...temp })
        }


    }, [filters.category])


    useEffect(() => {
        const temp = { ...INIT_COLORS }

        filters.colors.map(col => temp[col] = true)
        setColrs({ ...temp })


    }, [filters.colors])


    useEffect(() => {
        const tempSizes = { ...INIT_SIZES }
        filters.sizes.map(item => tempSizes[item] = true)
        setSiz({ ...tempSizes })
    }, [filters.sizes])



    const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const key = e.target.name as keyof Omit<Filters, 'price'>
        if (e.target.checked) {
            setFilters((prev) => ({ ...prev, [key]: [...prev[key], e.target.value] }))
        }
        else {
            setFilters((prev) => ({ ...prev, [key]: prev[key].filter(cat => cat !== e.target.value) }))
        }
    }

    const priceHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        const tempPrice = filters.price
        tempPrice[e.target.name as keyof PriceRange] = e.target.value as number | ''
        setFilters((prev) => ({ ...prev, price: { ...tempPrice } }))
    }

    return (
        <div id="filters" className="py-8 px-5 rounded-lg border shadow-lg w-full md:w-2/5 lg:w-1/4 md:sticky top-[85px] lg:static">
            <div id="catgory-filter" className="mb-10">
                <p className="text-sm font-bold mb-4">Categories</p>
                {(status === Status.PENDING) ? <TextLoader col='3' cssClass="flex-col gap-4 w-1/3 ml-0" /> : Object.keys(cats).length < 1 ? <h2 className="text-sm text-slate-600 text-center">Sorry, there are no categories.</h2> :

                    Object.keys(cats).map((key, i) =>
                        <div key={i} className="flex gap-2 border-b py-4">
                            <input type="checkbox" name='category' value={key} id={key} checked={cats[key]} onChange={changeHandler} />
                            <label htmlFor={key} className="capitalize text-sm text-slate-600 font-medium">{key}</label>
                        </div>
                    )
                }
            </div>

            <div id="colour-filter" className="mb-10">
                <p className="text-sm font-bold mb-6">Colour</p>
                {(status === Status.PENDING) ? <CircleLoader /> : products.length < 1 ? <h2 className="text-sm text-slate-600 text-center">Sorry, there are no colors available.</h2> :
                    <div className="flex gap-3 items-center">

                        {
                            Object.keys(colrs).map((color, i) => {

                                const { bgClass, borderClass } = getClasses(color as Colour)

                                return (
                                    <fieldset key={i}>
                                        <input type="checkbox" checked={colrs[color]} id={color} name="colors" value={color} onChange={changeHandler} className='appearance-none hidden ' />

                                        <label htmlFor={color} className={`block w-8 h-8 rounded-full ${bgClass}  cursor-pointer relative after:content-[""] after:w-10 after:h-10 after:rounded-full  after:absolute after:top-0 after:bottom-0 after:-right-1  after:m-auto  ${colrs[color] ? `after:${borderClass} after:border-2` : ''}`}></label>
                                    </fieldset>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <div id="size-filter" className="mb-10">
                <p className="text-sm font-bold mb-6">Size</p>
                {(status === Status.PENDING) ? <SquareLoader square={4} /> : products.length < 1 ? <h2 className="text-sm text-slate-600 text-center">Sorry, there are no sizes available.</h2> :
                    <div className="flex gap-4 items-center">

                        {
                            Object.keys(siz).map((size, i) => {
                                return (
                                    <div key={i}>
                                        <input type="checkbox" checked={siz[size]} name="sizes" id={size} value={size} onChange={changeHandler} className='appearance-none hidden' />

                                        <label htmlFor={size} className={`w-8 block flex items-center justify-center h-8 text-sm font-medium rounded cursor-pointer  ${siz[size] ? 'bg-cultured' : 'border-[1px]'} `}>{size}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <div id="price-filter" className="mb-10">
                <p className="text-sm font-bold mb-6">Price</p>

                <div className="flex gap-4 items-center">
                    {status === Status.PENDING ? <SquareLoader square={1} squareClass='min-w-12' /> :

                        <input type="number" name="min" placeholder='Min' className="min-w-12 text-center  items-center h-12  text-sm text-slate-600 font-medium rounded cursor-pointer border-[1px]" value={filters.price.min?filters.price.min: ''} onChange={priceHandler} />
                    }
                    <span className="text-2xl font-medium text-slate-600" >-</span>
                    {status === Status.PENDING ? <SquareLoader square={1} squareClass='min-w-12' /> :

                        <input type="number" name="max" placeholder="Max" className="min-w-12 text-center  items-center h-12  text-sm text-slate-600 font-medium rounded cursor-pointer border-[1px]" value={filters.price.max?filters.price.max:''} onChange={priceHandler} />
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductFilter