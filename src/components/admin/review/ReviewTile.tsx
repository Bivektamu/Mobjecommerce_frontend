import { MouseEvent, useState } from 'react'

import { DetailedReview, Toast, Toast_Vairant } from '../../../store/types'
import getMonth from '../../../utils/getMonth'
import { v4 } from 'uuid';
import getExcerpt from '../../../utils/getExcerpt';
import { useMutation } from '@apollo/client';
import { useStoreDispatch } from '../../../store';
import { addToast } from '../../../store/slices/toastSlice';
import Modal from '../../layout/Modal';
import { DELETE_REVIEW } from '../../../data/mutation';
import ReviewDetails from './ReviewDetails';

type Props = {
    review: DetailedReview,
    refetchReview: () => void,
}

const ReviewTile = ({ review, refetchReview }: Props) => {
    const [showModal, setShowModal] = useState({
        isOpen: false,
        content: ''
    })


    const dispatch = useStoreDispatch()

    const [deleteReview] = useMutation(DELETE_REVIEW, {
        onCompleted: () => {
            refetchReview?.()
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.SUCCESS,
                msg: 'Review successfully deleted'
            }
            dispatch(addToast(newToast))
            setShowModal({
                isOpen: false,
                content: ''
            })
        },
        onError: (error) => {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.INFO,
                msg: error.message
            }
            dispatch(addToast(newToast))
        }
    })


    const [actionId, setActionId] = useState('')


    const deleteHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteReview({
            variables: {
                reviewId: review.id
            }
        })
    }

    const product = review.productId
    const user = review.userId


    return (
        <div className='grid grid-cols-table-reviews gap-x-8 px-8 py-4 border-b-[1px] mb-6 items-center'>
            <div>
                <img src={product?.imgs[0].url as string} className='rounded w-16' />
            </div>
            <span className='text-sm text-slate-500 '>
                {user ? user.firstName + ' ' + user.lastName : 'Inactive User'}
            </span>

            <span className='text-sm text-slate-500'>
                {review.review.length > 100 ? getExcerpt(review.review, 10) : review.review}
            </span>

            <span className='relative text-sm text-slate-500'>
                {review.rating} / 5
            </span>

            <span className='text-sm text-slate-500'>
                {getMonth((new Date(review.createdAt)).getMonth() + 1) + ', ' + (new Date(review.createdAt)).getDate()}
            </span>

            <button
                onClick={() => setShowModal({
                    isOpen: true,
                    content: 'details'

                })}
                className='text-sm text-slate-600 border-[1px] py-2  border-slate-600 font-medium w-[120px] rounded'>
                <span className='text-sm'>
                    View Details
                </span>
            </button>

            <div className='text-lg text-slate-500 font-semibold relative flex items-center justify-center pb-2'>
                <button onClick={() => setActionId('id1')} >...</button>
                {actionId === 'id1' &&
                    <div className='absolute  bg-white border-[1px] rounded-lg shadow w-[140px] top-full right-full translate-x-8 -translate-y-3 after:content-[""] after:w-7 after:h-7  after:absolute after:z-10 after:-right-5 after:-top-4' onMouseLeave={() => setActionId('')}>
                        <button
                            onClick={() => setShowModal({
                                isOpen: true,
                                content: 'delete'

                            })}
                            className='block w-full text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>Delete</button>
                    </div>
                }
            </div>
            <Modal isOpen={showModal.isOpen} close={() => setShowModal({
                isOpen: false,
                content: ''
            })} >

                {
                    showModal.content === 'details' &&
                    <ReviewDetails review={review} />
                }
                {
                    showModal.content === 'delete' &&
                    <div className='text-center'>
                        <p className="mb-6 font-medium text-sm">Are you sure you want to delete the review ?</p>
                        <div className="flex gap-x-4 justify-center">
                            <button className='bg-green-500 text-white px-4 py-2 rounded' onClick={() => setShowModal({
                                isOpen: false,
                                content: ''
                            })}>Cancel</button>
                            <button className='bg-red-500 text-white px-4 py-2 rounded' onClick={deleteHandler}>Delete</button>
                        </div>
                    </div>
                }

            </Modal>
        </div>
    )
}

export default ReviewTile