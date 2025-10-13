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
        <div id="filters" className="md:py-8 py-4 px-5 rounded-lg border shadow-lg w-full md:w-2/5 lg:w-1/4 md:sticky top-[75px] md:top-[85px] lg:static bg-white z-10">
            <div id="catgory-filter" className="md:mb-10 mb-6 flex md:block flex-wrap gap-4">
                <p className="text-sm font-bold md:mb-4 w-full">Categories</p>
                {(status === Status.PENDING) ? <TextLoader col='3' cssClass="flex-col gap-4 w-1/3 ml-0" /> : Object.keys(cats).length < 1 ? <h2 className="text-sm text-slate-600 text-center">Sorry, there are no categories.</h2> :

                    Object.keys(cats).map((key, i) =>
                        <div key={i} className="flex gap-2 md:border-b md:py-4">
                            <input type="checkbox" name='category' value={key} id={key} checked={cats[key]} onChange={changeHandler} />
                            <label htmlFor={key} className="capitalize md:text-sm text-xs text-slate-600 font-medium">{key}</label>
                        </div>
                    )
                }
            </div>

            <div id="colour-filter" className="md:mb-10 mb-6">
                <p className="text-sm font-bold md:mb-6 mb-4">Colour</p>
                {(status === Status.PENDING) ? <CircleLoader /> : products.length < 1 ? <h2 className="text-sm text-slate-600 text-center">Sorry, there are no colors available.</h2> :
                    <div className="flex gap-3 items-center">

                        {
                            Object.keys(colrs).map((color, i) => {

                                const { bgClass, borderClass } = getClasses(color as Colour)

                                return (
                                    <fieldset key={i}>
                                        <input type="checkbox" checked={colrs[color]} id={color} name="colors" value={color} onChange={changeHandler} className='appearance-none hidden ' />

                                        <label htmlFor={color} className={`block md:size-8 size-6 rounded-full ${bgClass}  cursor-pointer relative after:content-[""] md:after:size-10 after:size-8 after:rounded-full  after:absolute after:top-0 after:bottom-0 after:-right-1  after:m-auto  ${colrs[color] ? `after:${borderClass} after:border-2` : ''}`}></label>
                                    </fieldset>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <div id="size-filter" className="md:mb-10 mb-6">
                <p className="text-sm font-bold md:mb-6 mb-4">Size</p>
                {(status === Status.PENDING) ? <SquareLoader square={4} /> : products.length < 1 ? <h2 className="md:text-sm text-xs text-slate-600 text-center">Sorry, there are no sizes available.</h2> :
                    <div className="flex md:gap-4 gap-2 items-center">

                        {
                            Object.keys(siz).map((size, i) => {
                                return (
                                    <div key={i}>
                                        <input type="checkbox" checked={siz[size]} name="sizes" id={size} value={size} onChange={changeHandler} className='appearance-none hidden' />

                                        <label htmlFor={size} className={`size-6 md:size-8 block flex items-center justify-center md:text-sm text-xs font-medium rounded cursor-pointer  ${siz[size] ? 'bg-cultured' : 'border-[1px]'} `}>{size}</label>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>

            <div id="price-filter" className="md:mb-10 mb-0">
                <p className="text-sm font-bold md:mb-6 mb-4">Price</p>

                <div className="flex gap-4 items-center">
                    {status === Status.PENDING ? <SquareLoader square={1} squareClass='md:min-w-12 min-w-6' /> :

                        <input type="number" name="min" placeholder='Min' className="md:min-w-12 min-w-6 text-center  items-center md:h-12 h-8  md:text-sm text-xs text-slate-600 font-medium rounded cursor-pointer border-[1px]" value={filters.price.min?filters.price.min: ''} onChange={priceHandler} />
                    }
                    <span className="text-2xl font-medium text-slate-600" >-</span>
                    {status === Status.PENDING ? <SquareLoader square={1} squareClass='min-w-12' /> :

                        <input type="number" name="max" placeholder="Max" className="md:min-w-12 min-w-6 text-center  items-center md:h-12 h-8 md:text-sm text-xs text-slate-600 font-medium rounded cursor-pointer border-[1px]" value={filters.price.max?filters.price.max:''} onChange={priceHandler} />
                    }
                </div>
            </div>
        </div>
    )
}

export default ProductFilter