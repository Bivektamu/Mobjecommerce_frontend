import Hero from "../components/home/Hero"
import { getProducts, useProduct } from "../store/slices/productSlice"
import { useEffect, useMemo } from "react"
import { useStoreDispatch } from "../store"
import HeroImg from '../assets/hero-2.png'

import Arrow from "../components/ui/Arrow"
import { Link } from "react-router-dom"
import GridLoader from "../components/ui/GridLoader"
import { Product, Status } from "../store/types"
import FeaturedLatest from "../components/home/FeaturedLatest"
import ProductCard from "../components/ui/ProductCard"
import PageWrapper from "../components/ui/PageWrapper"
import { Helmet } from "react-helmet-async"
import { CiDeliveryTruck } from "react-icons/ci"
import { SlBadge } from "react-icons/sl";
import { SiAdguard } from "react-icons/si";


const Home = () => {
  const dispatch = useStoreDispatch()
  const { products, status } = useProduct()

  useEffect(() => {
    if (status === Status.IDLE)
      dispatch(getProducts())
  }, [status, dispatch])

  const besSellingProducts: Product[] = useMemo(() => {
    if (products && products.length >= 4) {
      return products.slice(0, 4)
    }
    return []
  }, [products])

  return (
    <PageWrapper>
      <Helmet>
        <title>Mobje Commerce | Shop Online, Add to Wishlist & Enjoy Seamless Checkout</title>
      </Helmet>
      <Hero />
      <section className="bg-white pt-12 pb-20 md:pt-24 md:pb-36 px-4">
        <div className='container mx-auto md:grid-cols-2 lg:grid-cols-3  grid gap-12 md:gap-24 mb-20 md:mb-36'>
          <div>
            <span className="bg-regal-white size-14 rounded-full flex items-center justify-center text-2xl">
              <CiDeliveryTruck />
            </span>
            <p className="mt-8 mb-4 font-semibold">Free Shipping</p>
            <p className="text-slate-600">Upgrade your style today and get FREE shipping on all orders! Don't miss&nbsp;out.</p>
          </div>
          <div>
            <span className="bg-regal-white size-14 rounded-full flex items-center justify-center text-2xl">
              <SlBadge />
            </span>
            <p className="mt-8 mb-4 font-semibold">Satisfaction Guarantee</p>
            <p className="text-slate-600">Shop confidently with our Satisfaction Guarantee: Love it or get a&nbsp;refund.</p>
          </div>
          <div>
            <span className="bg-regal-white size-14 rounded-full flex items-center justify-center text-2xl">
              <SiAdguard />
            </span>

            <p className="mt-8 mb-4 font-semibold">Secure Payment</p>
            <p className="text-slate-600">Your security is our priority. Your payments are secure with&nbsp;us.</p>
          </div>
        </div>

        {/* Best Selling Products */}
        <p className="text-slate-400 text-sm mb-4 text-center uppercase tracking-wide">Shop Now</p>
        <h2 className="font-bold text-2xl mb-12 md:mb-24 text-center">Best Selling</h2>
        {
          (status === Status.PENDING) ? <GridLoader col='4' /> : !products || products.length < 1 ? <h2 className="text-lg text-slate-600 text-center">Sorry, there are no products.</h2> :

            <div className='container mx-auto lg:grid-cols-4 grid-cols-1 md:grid-cols-2 grid gap-12'>

              {
                besSellingProducts.map(product =>
                  <ProductCard key={product.id} item={product} />
                )
              }
            </div>
        }
      </section>

      <section className="bg-regal-white px-4 w-full">
        <div className="container flex justify-between md:items-center mx-auto  md:pb-12">
          <div className="flex flex-col items-start py-6 md:py-0">
            <h1 className='mb-4 text-xl md:text-4xl font-semibold'>Browse Our Fashion Paradise!</h1>
            <span className='mb-6 md:mb-14 text-xs md:text-base'>Step into a world of style and explore our diverse collection of clothing categories.</span>
            <Link to="/collections" className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm flex gap-x-2 items-center'>Start Browsing <Arrow /></Link>
          </div>
          <img src={HeroImg}
            alt="Browse Mobje Commerce fashion collections"
            className='w-[40%] md:w-[225px] max-h-fit' />
        </div>
      </section>

      <FeaturedLatest products={products} status={status} />

    </PageWrapper>
  )
}

export default Home