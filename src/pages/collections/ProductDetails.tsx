import { useEffect, useState } from 'react'
import BreadCrumbs from '../../components/layout/BreadCrumbs'
import { useStoreDispatch } from '../../store'

import { getProducts, useProduct } from '../../store/slices/productSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { Product, ReviewUserOnly, Status } from '../../store/types'
import StarIcon from '../../components/ui/StarIcon'
import GridLoader from '../../components/ui/GridLoader'
import AddToCartForm from '../../components/forms/AddToCartForm'
import DetailsReviewsTab from '../../components/product/DetailsReviewsTab'
import TextLoader from '../../components/ui/TextLoader'
import ButtonLoader from '../../components/ui/ButtonLoader'
import SquareLoader from '../../components/ui/SquareLoader'
import ProductCard from '../../components/ui/ProductCard'
import { getAverageRating } from '../../utils/helpers'
import PageWrapper from '../../components/ui/PageWrapper'
import { useLazyQuery } from '@apollo/client'
import { GET_REVIEWS_BY_PRODUCT_ID } from '../../data/query/reviews.query'
import { stripTypename } from '@apollo/client/utilities'

const ProductComponent = () => {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useStoreDispatch()

  const [productItem, setProductItem] = useState<null | Product>(null)
  const [similarProducts, setSimilarProducts] = useState<Product[]>([])
  const { products, status } = useProduct()
  const [reviews, setReviews] = useState<ReviewUserOnly[]>([])


  const [queryReviews, {refetch, data}] = useLazyQuery(GET_REVIEWS_BY_PRODUCT_ID)

  useEffect(()=> {
    if (data && data?.productReviews) {
        const tempReviews = stripTypename(data.productReviews as ReviewUserOnly[]).sort((a, b) => (new Date(b.createdAt)).getTime() - (new Date(a.createdAt)).getTime())
        setReviews([...tempReviews])
      }
  }, [data])

  useEffect(() => {
    if (status === Status.IDLE) {
      dispatch(getProducts())
    }
  }, [dispatch])

  useEffect(() => {
    if (products.length > 0) {
      const productExists = products.filter(product => product.slug === params.slug)
      if (productExists.length < 1) {
        navigate('/')
      }
      setProductItem(productExists[0])
    }
  }, [products, params.slug])

  useEffect(() => {
    if (productItem) {

      queryReviews({
          variables: {
            productReviewsId: productItem.id
        }
      })

      const tempProducts = products.filter(product => product.category === productItem.category && product.id !== productItem.id)
      if (tempProducts.length > 0) {
        setSimilarProducts(tempProducts)
      }
      else {
        setSimilarProducts(products.slice(0, 4))
      }
    }

  }, [productItem])

  return (
    <PageWrapper>
      <section id="breadcrums" className="bg-white px-4">
        <div className="py-8 container mx-auto">
          <BreadCrumbs rootLink="Ecommerce" />
        </div>
      </section>

      <section className="bg-white">
        <div className="container mx-auto">

          <div className="flex gap-12 md:mb-32 mb-10 md:flex-row flex-col">
            <div className="md:w-1/2 w-full  bg-cultured flex items-center justify-center">
              {!productItem ? <SquareLoader square={1} squareClass='w-full h-full' /> : <img src={productItem.imgs[0].url} alt="" className='w-3/5' />}
            </div>

            <div className="md:w-1/2 w-full px-4">
              <h2 className="md:text-3xl text-xl font-semibold mb-2">
                {!productItem ? <TextLoader col='1' cssClass='w-2/5 h-12 ml-0' /> : productItem.title}
              </h2>

              <div className="flex gap-4 items-center mb-6">
                {
                  reviews && reviews.length > 0 &&

                  <p className="bg-cultured text-slate-600 font-medium flex items-center gap-2 py-2 px-6 rounded-full text-xs">
                    <StarIcon />
                    {getAverageRating(reviews.map(review=>review.rating) as number[])} 
                    <span className="w-4 h-[2px] bg-slate-600"></span>
                    {reviews.length} Reviews
                  </p>
                }

                {
                  !productItem ? <ButtonLoader /> :
                    <p className="border-2 border-cultured text-slate-600 font-medium flex items-center gap-2 py-2 px-6 rounded-full text-xs uppercase">
                      {productItem?.stockStatus ? 'In' : 'Out of'} Stock
                    </p>
                }

              </div>

              <p className="md:text-xl text-lg font-semibold mb-8">${productItem?.price}</p>
              <AddToCartForm product={productItem} />
            </div>
          </div>

          <DetailsReviewsTab product={productItem} reviews={reviews} refetch={refetch} />


          <div className="pb-32 px-4">
            <h2 className="text-2xl mb-3">You might also like</h2>
            <p className="text-sm uppercase mb-16 text-slate-400  text-wider font-medium">SIMILAR PRODUCTS</p>

            {(status === Status.PENDING) ? <GridLoader col='4' /> : similarProducts.length < 1 ? <h2 className="text-lg text-slate-600 text-center">Sorry, there are no products.</h2> :

              <div className='container mx-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid gap-x-12 gap-y-16'>
                {

                  similarProducts.map(product =>
                    <ProductCard key={product.id} item={product} />
                  )
                }
              </div>
            }

          </div>
        </div>

      </section>
    </PageWrapper>
  )
}

export default ProductComponent