import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { v4 as uuidv4 } from 'uuid';
import { Action, Address, FormError, Toast, Toast_Vairant, ValidateSchema } from "../../store/types"
import validateForm from "../../utils/validate"
import { updateAddress, useUser } from "../../store/slices/userSlice"
import { useStoreDispatch } from "../../store"
import { addToast } from "../../store/slices/toastSlice";
import { useAuth } from "../../store/slices/authSlice";
import { useLazyQuery } from "@apollo/client";
import { GET_USER_ADDRESS } from "../../data/query/user.query";


const ShippingForm = () => {

    const { user } = useAuth()
    const {action} = useUser()
    const dispatch = useStoreDispatch()

    const [fetchAddress, { data }] = useLazyQuery(GET_USER_ADDRESS)


    const [formData, setFormData] = useState<Address>({
        street: '',
        postcode: '',
        city: '',
        state: '',
        country: ''
    } as Address)

    const [edit, setEdit] = useState<boolean>(false)

    useEffect(() => {

        if (user && user.id) {
            fetchAddress({
                variables: {
                    userId: user.id
                }
            })
        }

    }, [user, fetchAddress])

    useEffect(() => {
        if (data && data.user && data.user.address) {
            setEdit(true)
            setFormData({
                street: data.user.address.street,
                postcode: data.user.address.postcode,
                city: data.user.address.city,
                state: data.user.address.state,
                country: data.user.address.country
            })
        }
    }, [data])

    const [formErrors, setFormErrors] = useState<FormError>({})

    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            Object.keys(formData).map(key => {
                if (formData[key as keyof Address]) {
                    setFormErrors(prev => ({ ...prev, [key]: '' }))
                }
            })
        }
    }, [formData])

    useEffect(() => {
        if (action === Action.EDIT) {
            const newToast: Toast = {
                id: uuidv4(),
                variant: Toast_Vairant.SUCCESS,
                msg: 'Shipping address updated'
            }
            dispatch(addToast(newToast))
        }
    }, [action])

    const { street, postcode, state, city, country } = formData



    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const postCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.preventDefault()
        if (!isNaN(parseInt(e.target.value))) {
            setFormData(prev => ({
                ...prev,
                postcode: e.target.value
            }))
        }

    }


    const onSumbitHandler = (e: FormEvent) => {
        e.preventDefault()

        const validateSchema: ValidateSchema<unknown>[] =
            [
                {
                    name: 'street',
                    type: 'string',
                    value: street,
                    msg: 'Please provide street address'
                },
                {
                    name: 'postcode',
                    type: 'string',
                    value: postcode,
                    msg: 'Please provide postcode'
                },
                {
                    name: 'state',
                    type: 'string',
                    value: state,
                    msg: 'Please provide state'
                },
                {
                    name: 'city',
                    type: 'string',
                    value: city,
                    msg: 'Please provide city'
                },
                {
                    name: 'country',
                    type: 'string',
                    value: country,
                    msg: 'Please provide country'
                },
            ]


        const errors = validateForm(validateSchema)

        if (Object.keys(errors).length > 0) {
            return setFormErrors(prev => ({ ...prev, ...errors }))
        }

        dispatch(updateAddress(formData))

    }

    return (
        <form className="grid md:grid-cols-2 grid-cols-1 xl:gap-x-20 gap-x-10 gap-y-6" onSubmit={onSumbitHandler}>
            <fieldset className="md:col-span-2 col-span-1">
                <label htmlFor="street" className="capitalize font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Street Address</label>
                <input
                    onChange={e => onChangeHandler(e)}
                    id="street" name="street" className="border-[1px] outline-none block px-4 py-2 rounded w-full md:text-base text-sm" value={street} />

                {formErrors.street && <span className='text-red-500 text-xs'>{formErrors.street}</span>}
            </fieldset>

            <fieldset className="">
                <label htmlFor="city" className="capitalize font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">City</label>
                <input
                    onChange={e => onChangeHandler(e)}
                    type="text" id="city" name="city" className="border-[1px] outline-none block px-4 py-2 rounded w-full md:text-base text-sm" value={city} />
                {formErrors.city && <span className='text-red-500 text-xs'>{formErrors.city}</span>}

            </fieldset>
            <fieldset className="">
                <label htmlFor="state" className=" font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">State</label>
                <input
                    onChange={e => onChangeHandler(e)}
                    type="text" id="state" name="state" className="border-[1px] outline-none block px-4 py-2 rounded w-full md:text-base text-sm" value={state} />
                {formErrors.state && <span className='text-red-500 text-xs'>{formErrors.state}</span>}

            </fieldset>
            <fieldset className="">
                <label htmlFor="postcode" className="capitalize font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">postcode</label>
                <input
                    onChange={e => postCodeHandler(e)}
                    type="string" id="postcode" name="postcode" className="border-[1px] outline-none block px-4 py-2 rounded w-full md:text-base text-sm" value={postcode} />
                {formErrors.postcode && <span className='text-red-500 text-xs'>{formErrors.postcode}</span>}

            </fieldset>

            <fieldset className="mb-4">
                <label htmlFor="country" className="capitalize font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">country</label>
                <input
                    onChange={e => onChangeHandler(e)}
                    type="text" id="country" name="country" className="border-[1px] outline-none block px-4 py-2 rounded w-full md:text-base text-sm" value={country} />
                {formErrors.country && <span className='text-red-500 text-xs'>{formErrors.country}</span>}

            </fieldset>
            <button type="submit" id="add_product" className="w-full md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base">{edit ? 'Update' : 'Submit'} </button>
        </form>
    )
}

export default ShippingForm