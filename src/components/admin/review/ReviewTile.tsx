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
import useIsTouchDevice from '../../hooks/useIsTouchDevice';


type Props = {
    review: DetailedReview,
    refetchReview: () => void,
}

const ReviewTile = ({ review, refetchReview }: Props) => {
    const [showModal, setShowModal] = useState({
        isOpen: false,
        content: ''
    })

    const isTouch = useIsTouchDevice()


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
        <div className='grid grid-cols-1 lg:grid-cols-table-reviews px-4 xl:px-8 py-8 lg:py-4 lg:border-b-[1px] items-center gap-x-8 gap-y-2 bg-white rounded shadow lg:rounded-none lg:shadow-none'>
            <div className='flex justify-center'>
                <img src={product?.imgs[0].url as string} className='w-1/2 lg:w-16' />
            </div>
            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500  text-xs md:text-sm block lg:hidden">
                    Name
                </span>
                <span className= 'text-xs md:text-sm text-slate-500 col-span-2 lg:col-span-3'>
                    {user ? user.firstName + ' ' + user.lastName : 'Inactive User'}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500  text-xs md:text-sm block lg:hidden">
                    Review
                </span>
                <span className= 'text-xs md:text-sm text-slate-500 col-span-2 lg:col-span-3'>
                    {review.review.length > 100 ? getExcerpt(review.review, 10) : review.review}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500  text-xs md:text-sm block lg:hidden">
                    Rating
                </span>
                <span className='relative  text-xs md:text-sm text-slate-500 col-span-2 lg:col-span-3'>
                    {review.rating} / 5
                </span>
            </div>

            <div className="grid gap-4  grid-cols-3 ">
                <span className="font-semibold text-slate-500  text-xs md:text-sm block lg:hidden">
                    Submitted at
                </span>
                <span className= 'text-xs md:text-sm text-slate-500 col-span-2 lg:col-span-3'>
                    {getMonth((new Date(review.createdAt)).getMonth() + 1) + ', ' + (new Date(review.createdAt)).getDate()}
                </span>
            </div>

            <div className="grid gap-4  grid-cols-2 mt-4 lg:hidden">

                <button
                    className='border-slate-700 border py-2 px-4 rounded text-center cursor-pointer text-xs block'
                    onClick={() => setShowModal({
                        isOpen: true,
                        content: 'details'

                    })}
                >
                    View Details
                </button>

                <button
                    className='bg-black text-white border py-2 px-4 rounded text-center cursor-pointer text-xs block '
                    onClick={() => setShowModal({
                        isOpen: true,
                        content: 'delete'

                    })}
                >
                    Delete
                </button>
            </div>


            <div className='text-lg text-slate-500 font-semibold relative items-center justify-center pb-2 hidden lg:flex'>
                <button onClick={() => setActionId('id1')} >...</button>
                {
                    actionId && isTouch &&
                    <button onClick={() => setActionId('')} className='fixed
                            top-0 left-0 w-full h-full z-[1] bg-red-400 opacity-0'>Close</button>
                }
                {actionId === 'id1' &&
                    <div className='absolute  bg-white border-[1px] rounded-lg shadow w-[140px]  -translate-x-[75px] translate-y-[35px] after:content-[""] after:size-7  after:absolute after:z-10 after:-right-5 after:-top-0 z-[2]' onMouseLeave={() => setActionId('')}>
                        <button
                            onClick={() => setShowModal({
                                isOpen: true,
                                content: 'details'

                            })}
                            className='block w-full  text-xs md:text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>
                            <span className= 'text-xs md:text-sm'>
                                View Details
                            </span>
                        </button>
                        <button
                            onClick={() => setShowModal({
                                isOpen: true,
                                content: 'delete'

                            })}
                            className='block w-full  text-xs md:text-sm font-normal text-left hover:bg-slate-100 px-4 py-4'>Delete</button>
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
                        <p className="mb-6 font-medium  text-xs md:text-sm">Are you sure you want to delete the review ?</p>
                        <div className="flex gap-x-4 justify-center">
                            <button className=' text-sm lg:text-base border-slate-600 border  px-4 py-2 rounded' onClick={() => setShowModal({
                                isOpen: false,
                                content: ''
                            })}>Cancel</button>
                            <button className='bg-black text-sm lg:text-base text-white px-4 py-2 rounded' onClick={deleteHandler}>Delete</button>
                        </div>
                    </div>
                }

            </Modal>
        </div>
    )
}

export default ReviewTile