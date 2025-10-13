import { useState } from 'react'
import { Product, ReviewUserOnly } from '../../store/types'
import StarIcon from '../ui/StarIcon'
import ParagraphLoader from '../ui/ParagraphLoader'
import ProductReviews from './ProductReviews'

type Props = {
    product: Product | null,
    reviews: ReviewUserOnly[],
    refetch: () => void
}

const DetailsReviewsTab = ({ product, reviews, refetch }: Props) => {
    const [isReview, setIsReview] = useState(false)

    return (

        <div className='flex gap-8  md:mb-32 mb-10 px-4 flex-col md:flex-row'>
            <div className="md:w-1/4 w-full mt-12 flex md:block">
                <button className={`text-sm flex items-center w-full py-2 px-4 rounded gap-2 mb-2  font-semibold ${!isReview ? 'bg-cultured' : 'text-slate-600'} `} onClick={() => setIsReview(false)}>
                    <span className='relative bottom-1'>...</span> Details
                </button>
                <button className={`text-sm flex items-center w-full py-2 px-4 rounded gap-2  font-medium ${isReview ? 'bg-cultured' : 'text-slate-600'}`} onClick={() => setIsReview(true)}><StarIcon /> Reviews</button>
            </div>

            <div className="md:w-3/4 w-full">

                {
                    !isReview ?
                        <div id="details-tab">
                            <p className="font-semibold mb-6">Details</p>
                            {
                                !product ? <ParagraphLoader col='1' /> :
                                    <p className="md:text-sm text-xs text-slate-600">{product?.description}</p>
                            }

                        </div>
                        :
                        <ProductReviews reviews={reviews} productId={product?.id as string} refetch={refetch} />
                }

            </div>
        </div>
    )
}

export default DetailsReviewsTab