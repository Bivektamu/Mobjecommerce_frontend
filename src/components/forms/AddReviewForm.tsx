import { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import { RatingWidget } from '../ui/RatingWidget'
import { FormError, Review, ReviewInput, Toast, Toast_Vairant, ValidateSchema } from '../../store/types'
import { useAuth } from '../../store/slices/authSlice'
import validateForm from '../../utils/validate'
import { v4 as uuidv4 } from 'uuid';

import { useStoreDispatch } from '../../store'
import { useMutation } from '@apollo/client'
import { CREATE_REVIEW } from '../../data/mutation/reviews.mutation'
import { addToast } from '../../store/slices/toastSlice'

type Props = {
  productId: string,
  refetchReviews: () => void,
  closeModal: () => void
}
const AddReviewForm = ({ productId, refetchReviews, closeModal }: Props) => {
  const dispatch = useStoreDispatch()

  const [addReview, { loading, error }] = useMutation(CREATE_REVIEW, {
    onCompleted: () => {
      refetchReviews();
      closeModal();

      const newToast: Toast = {
        id: uuidv4(),
        variant: Toast_Vairant.SUCCESS,
        msg: 'Review submitted successfully'
      }
      dispatch(addToast(newToast))
    }
  })
  const { user } = useAuth()

  const [formData, setFormData] = useState<ReviewInput>({
    productId: productId,
    userId: user?.id,
    rating: null,
    review: '',
  } as Review)

  const [formErrors, setFormErrors] = useState<FormError>({})

  const [stars, setStars] = useState<number | null>(null)

  // const {rating, review} = formData
  useEffect(() => {
    if (stars) {

      setFormData({ ...formData, rating: stars })

    }
  }, [stars])

  // code to remove error info when fields are typed
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      Object.keys(formData).map(key => {
        if (formData[key as keyof ReviewInput]) {
          setFormErrors(prev => ({ ...prev, [key]: '' }))
        }
      })
    }
  }, [formData])


  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>) => {
    e.preventDefault
    setFormData({ ...formData, review: e.target.value })
  }
  const submitHandler = (e: FormEvent) => {
    e.preventDefault()
    // console.log(formData);

    const validateSchema: ValidateSchema<unknown>[] =
      [
        {
          name: 'rating',
          type: 'number',
          value: formData.rating,
          msg: 'Please select rating'
        },
        {
          name: 'review',
          type: 'text',
          value: formData.review,
          msg: 'Please provide review'
        },
      ]

    const errors = validateForm(validateSchema)
    if (Object.keys(errors).length > 0) {
      return setFormErrors(prev => ({ ...prev, ...errors }))
    }
    addReview({
      variables: {
        input: formData
      }
    })



  }

  if (error) {
    const newToast: Toast = {
      id: uuidv4(),
      variant: Toast_Vairant.DANGER,
      msg:error.message
    }
    dispatch(addToast(newToast))

  }

  return (
    <div className="bg-white rounded-lg">
      <p className="px-8 py-2 border-b-[1px] font-semibold">Create Review</p>
      <div className=" px-8 py-12  max-w-[800px]">
        <form
          className=""
          onSubmit={submitHandler}>
          <div className="flex flex-col gap-6">
            <div className="">
              <p className="capitalize font-medium text-slate-600 text-sm block mb-2 w-full">Overall rating</p>
              <RatingWidget maxStars={5} setStars={setStars} stars={stars} />
              {formErrors.rating && <span className='text-red-500 text-xs'>{formErrors.rating}</span>}

            </div>

            <fieldset className="col-span-2">
              <label htmlFor="description" className=" font-medium text-slate-600 text-sm block mb-4 w-full">Add a written review</label>
              <textarea
                onChange={onChangeHandler}
                id="description" name="description" className="border-[1px] outline-none text-sm block px-4 py-2 rounded w-full max-w-full h-40"></textarea>

              {formErrors.review && <span className='text-red-500 text-xs'>{formErrors.review}</span>}

            </fieldset>
            <button type="submit" className="w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer">{!loading ? "Submit" : 'Submitting...'}</button>
          </div>

        </form>
      </div>
    </div>
  )
}

export default AddReviewForm