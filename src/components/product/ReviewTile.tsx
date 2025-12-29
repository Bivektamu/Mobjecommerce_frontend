import { ReviewUserOnly, Toast, Toast_Vairant } from '../../store/types'

import { formatDistanceToNow } from 'date-fns'
import StarIcon from '../ui/StarIcon'

import { FaRegEdit } from 'react-icons/fa'
import { AiTwotoneDelete } from 'react-icons/ai'
import { useAuth } from '../../store/slices/authSlice'
import Modal from '../layout/Modal'
import EditReviewForm from '../forms/EditReviewForm'
import { MouseEvent, useEffect, useState } from 'react'
import { useMutation } from '@apollo/client'
import { DELETE_REVIEW } from '../../data/mutation/reviews.mutation'
import { v4 } from 'uuid'
import { useStoreDispatch } from '../../store'
import { addToast } from '../../store/slices/toastSlice'
import useAvatar from '../hooks/useAvatar'


type Props = {
    review: ReviewUserOnly,
    refetchReview: () => void
}

const ReviewTile = ({ review, refetchReview }: Props) => {
    const { avatar, setAvatarEmail } = useAvatar()
    const dispatch = useStoreDispatch()
    const { user } = useAuth()
    const [deleteReview] = useMutation(DELETE_REVIEW, {
        onCompleted: () => {
            refetchReview?.()
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.SUCCESS,
                msg: 'Review successfully deleted'
            }
            dispatch(addToast(newToast))
            setShowModal({ flag: false, content: '' })
        },
        onError: (error) => {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.INFO,
                msg:error.message
            }
            dispatch(addToast(newToast))
        }
    })
    const [showModal, setShowModal] = useState({
        flag: false,
        content: ''
    })

    const deleteHandler = (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        deleteReview({
            variables: {
                reviewId: review.id
            }
        })
    }

    const { firstName, lastName, email } = review.userId

    useEffect(() => {
        setAvatarEmail(email)
    }, [email, setAvatarEmail])

    return (

        <div className="wrapper border-b pb-6 mb-6">
            <div className="grid md:grid-cols-16 grid-cols-5 items-start justify-between">

                <p className=" col-span-1">
                    <span className='w-12 h-12 overflow-hidden rounded-full block'>
                        {avatar}
                    </span>
                </p>

                <div className='md:col-span-12 col-span-4 md:text-base text-sm'>
                    <div className="mb-2 capitalize">
                        <p>{firstName} {lastName}</p>
                    </div>
                    <p className="mb-4 text-slate-600 uppercase text-xs">{formatDistanceToNow(review.createdAt, { addSuffix: true })}</p>

                </div>

                <div className="col-span-5">
                    <div className='flex gap-1 md:justify-end'>
                        {new Array(review.rating as number).fill('*').map((_, i) =>
                            <StarIcon key={i} />
                        )}
                    </div>
                </div>
            </div>

            <div className="grid md:grid-cols-16 grid-cols-1 items-start justify-between">

                <p className="col-span-1 ">
                    &nbsp;
                </p>

                <p className="text-slate-600  md:text-sm text-xs col-span-12">
                    {review.review}
                </p>

                {
                    user?.id === review.userId._id &&
                    (
                        <div className="col-span-3 place-self-end flex gap-4">
                            <button type="button" onClick={() => setShowModal({ flag: true, content: 'edit' })}><FaRegEdit /></button>
                            <button type="button" onClick={() => setShowModal({ flag: true, content: 'del' })}><AiTwotoneDelete /></button>
                        </div>
                    )
                }

            </div>

            <Modal isOpen={showModal.flag} close={() => setShowModal({ flag: false, content: '' })} >
                {
                    showModal.content === 'edit' &&
                    <EditReviewForm review={review} refetchReview={refetchReview} closeModal={() => setShowModal({ flag: false, content: '' })} />
                }

                {
                    showModal.content === 'del' &&

                    <div className='text-center'>
                        <p className="mb-6 font-medium text-sm">Are you sure you want to delete the review ?</p>
                        <div className="flex gap-x-4 justify-center">
                            <button className='border-slate-600 border px-4 py-2 rounded' onClick={() => setShowModal({ flag: false, content: '' })}>Cancel</button>
                            <button className='bg-black text-white px-4 py-2 rounded' onClick={deleteHandler}>Delete</button>
                        </div>
                    </div>
                }
            </Modal>
        </div>
    )
}

export default ReviewTile