import { DetailedReview } from '../../../store/types'
import getMonth from '../../../utils/getMonth'
import StarIcon from '../../ui/StarIcon'

type Props = {
    review: DetailedReview
}


const ReviewDetails = ({ review }: Props) => {



    const { firstName, lastName, email, _id: id } = review.userId
    const { title, _id } = review.productId



    return (
        <section className='text-left'>
            <p className="font-medium text-slate-900 mb-6 pb-2 breview-b-[1px] text-lg">Review Detail</p>
            <div className="grid grid-cols-3 items-center mb-4 gap-4 text-sm text-slate-500 border-b pb-4">
                <span className=" font-medium ">Reviewer</span>
                <span className="col-span-2">{firstName ? firstName + ' ' + lastName : 'User Deleted'}</span>
                {
                    id &&

                    <>
                        <span className=" font-medium ">Reviewer ID</span>
                        <span className="col-span-2">{id}</span>
                    </>
                }


                {
                    email &&
                    <>
                        <span className="font-medium ">Email</span>
                        <span className="col-span-2">{email}</span>

                    </>
                }

                <span className=" font-medium">Submitted</span>
                <span className='col-span-2'>
                    {(new Date(review.createdAt)).getDate() + ' ' + getMonth((new Date(review.createdAt)).getMonth() + 1) + ', ' + (new Date(review.createdAt)).getFullYear()}
                </span>
            </div>

            <div className="grid grid-cols-3 items-start mb-4 gap-4 text-sm text-slate-500">
                <span className=" font-medium ">Product</span>
                <span className="col-span-2">{title}</span>

                <span className=" font-medium ">Product Id</span>
                <span className="col-span-2">{_id}</span>


                <span className=" font-medium ">Rating</span>
                <span className='flex gap-2 col-span-2'>
                    {
                        // @ts-ignore
                        Array(review.rating).fill('*').map((i) => <StarIcon key={i} />)
                    }
                </span>

                <span className=" font-medium ">Review</span>
                <span className="col-span-2">{review.review}</span>
            </div>
        </section>
    )
}

export default ReviewDetails