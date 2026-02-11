
import { getProducts, useProduct } from "../../store/slices/productSlice"
import { useEffect, useMemo, useState } from "react"
import { useStoreDispatch } from "../../store"
import BreadCrumbs from "../../components/layout/BreadCrumbs"
import { Filters, Status } from "../../store/types"
import ProductFilter from "../../components/collections/ProductFilter"
import Close from "../../components/ui/Close"
import GridLoader from "../../components/ui/GridLoader"
import ProductCard from "../../components/ui/ProductCard"
import SortProducts from "../../components/SortProducts"
import { resetCartAction, useCart } from "../../store/slices/cartSlice"
import PageWrapper from "../../components/ui/PageWrapper"
import { Helmet } from "react-helmet-async"

export type SortType = 'a' | 'z' | 'min' | 'max' | null

const Collections = () => {
  const dispatch = useStoreDispatch()
  const { products, status } = useProduct()
  const { action } = useCart()


  const [filters, setFilters] = useState<Filters>({
    category: [],
    colors: [],
    sizes: [],
    price: { min: '', max: '' }
  })
  const [sortType, setSortType] = useState<SortType>(null)

  useEffect(() => {
    if (status === Status.IDLE)
      dispatch(getProducts())
  }, [dispatch, status])

  useEffect(() => {
    if (action) {
      dispatch(resetCartAction())
    }
  }, [action, dispatch])


  const filteredProducts = useMemo(() => {
    if (!products || !products.length) return []
    let result = products
    if (filters.category.length) {
      result = result.filter(product =>
        filters.category.some(cat => product.category.startsWith(cat))
      )

    }

    if (filters.colors.length) {
      result = result.filter(product =>
        filters.colors.some(color => product.colors.includes(color))
      )
    }

    if (filters.sizes.length) {
      result = result.filter(product =>
        filters.sizes.some(size => product.sizes.includes(size))
      )
    }

    if (filters.price.min) {
      result = result.filter(product => product.price >= Number(filters.price.min))
    }

    if (filters.price.max) {
      result = result.filter(product => product.price <= Number(filters.price.max))
    }

    if (sortType) {
      result = [...result]
      switch (sortType) {
        case 'a':
          result = result.sort((a, b) => a.title.localeCompare(b.title))
          break;
        case 'z':
          result = result.sort((a, b) => b.title.localeCompare(a.title))
          break;
        case 'min':
          result = result.sort((a, b) => a.price - b.price)
          break;
        case 'max':
          result = result.sort((a, b) => b.price - a.price)
          break;
        default:
          break;
      }
    }
    return result

  }, [filters, products, sortType])

  const clickHandler = (type: keyof Omit<Filters, 'price'>, item: string) => {
    setFilters(prev => ({ ...prev, [type]: prev[type].filter(c => c !== item) }))
  }

  const priceHandler = () => {
    setFilters(prev => ({ ...prev, price: { min: '', max: '' } }))
  }

  const clearFiltersHandler = () => {
    setFilters({
      category: [],
      colors: [],
      sizes: [],
      price: { min: '', max: '' }
    })
  }

  const { category, colors, sizes } = filters

  return (
    <PageWrapper>
      <Helmet>
        <title>
          Collections | Explore Products | Mobje Commerce
        </title>
      </Helmet>
      <section id="breadcrums" className="px-4">
        <div className="md:py-8 py-4 container mx-auto">
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className="bg-white px-4">
        <div className="container mx-auto py-8 flex flex-col md:flex-row gap-4 xl:gap-16 items-start">
          <ProductFilter products={products} status={status} setFilters={setFilters} filters={filters} />
          <div id="filtered-products" className="md:py-8 py-4 md:pl-5 w-full md:w-3/5 lg:w-3/4 ">
            <p className="text-sm font-bold mb-4">Applied Filters:</p>
            <div className="flex gap-4 mb-8 flex-wrap">
              {
                category.map((cat, i) =>
                  <p key={`cat_${i}`} className="text-xs font-semibold flex gap-2 items-center capitalize text-black border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px] ">
                    {cat}
                    <button type="button" onClick={() => clickHandler( 'category', cat)}>
                      <Close classN="w-3 bg-slate-600" />
                    </button>
                  </p>)
              }

              {

                colors.length > 0 &&
                colors.map((clr, i) =>
                  <p key={`clr_${i}`} className="text-xs font-semibold flex gap-2 items-center capitalize text-black border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px] ">
                    Color: {clr.toLowerCase()}
                    <button type="button" onClick={() => clickHandler( 'colors', clr)}>
                      <Close classN="w-3 bg-slate-600" />
                    </button>
                  </p>

                )
              }

              {

                sizes.length > 0 &&
                sizes.map((size, i) =>
                  <p key={`size_${i}`} className="text-xs font-semibold flex gap-2 items-center capitalize text-black border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px] ">
                    Size: {size}
                    <button type="button" onClick={() => clickHandler('sizes', size)}>
                      <Close classN="w-3 bg-slate-600" />
                    </button>
                  </p>

                )
              }

              {
                (filters.price.min || filters.price.max) &&
                <p className="text-xs font-semibold flex gap-2 items-center capitalize text-black border-slate-300 border-[1px] py-[5px] px-6 rounded-[20px] ">
                  Price: {filters.price.min ? filters.price.min : 0} - {filters.price.max ? filters.price.max : 'max'}
                  <button type="button" onClick={priceHandler}>
                    <Close classN="w-3 bg-slate-600" />
                  </button>
                </p>
              }
              {
                (filters.price.min || filters.price.max || sizes.length > 0 || colors.length > 0 || category.length > 0) &&
                <button type="button" className="text-xs font-bold" onClick={clearFiltersHandler}>
                  Clear All Filters
                </button>
              }

            </div>

            <div className="flex justify-between mb-8">
              {
                filteredProducts.length > 0 &&
                <p className="text-xs text-slate-400 font-medium">Showing {filteredProducts.length} results.</p>
              }
              <SortProducts setSortType={setSortType} />

            </div>

            <div className="w-full mb-12">

              {(status === Status.PENDING) ? <GridLoader col='3' /> : filteredProducts.length < 1 ? <h2 className="text-lg text-slate-600 text-center">Sorry, there are no products for given filters.</h2> :

                <div className='container mx-auto grid-cols-1 lg:grid-cols-3  grid gap-x-12 gap-y-16'>
                  {
                    filteredProducts.map(product =>
                      <ProductCard key={product.id} item={product} />
                    )
                  }
                </div>
              }
            </div>

          </div>
        </div>
      </section>
    </PageWrapper>
  )
}

export default Collections