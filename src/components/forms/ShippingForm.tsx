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
import { GoCheckbox } from "react-icons/go";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";

interface Props {
    addressId?: string
}

const ShippingForm = ({ addressId }: Props) => {

    const { user } = useAuth()
    const { action } = useUser()
    const dispatch = useStoreDispatch()

    const [fetchAddress, { data }] = useLazyQuery(GET_USER_ADDRESS)


    const [formData, setFormData] = useState<Address>({
        street: '',
        postcode: '',
        city: '',
        state: '',
        label: '',
        building: '',
        country: '',
        setAsDefault: false
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
                label: data.user.address.label,
                building: data.user.address.building,
                country: data.user.address.country,
                setAsDefault: data.user.address.setAsDefault,
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

    const { street, postcode, state, city, country, label, building, setAsDefault } = formData



    const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
        if (e.target.type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                setAsDefault: e.target.checked
            }))
        }
        else
            setFormData(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
    }

    const postCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        e.stopPropagation()
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
                    name: 'label',
                    type: 'string',
                    value: label,
                    msg: 'Please provide label'
                },
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

        console.log(formData)
        // dispatch(updateAddress(formData))

    }

    return (
        <>
            <h4 className="text-left font-medium  text-xl mb-2">
                {addressId ? 'Update' : 'Add New'} Address
            </h4>
            <p className="text-slate-500 text-xs mb-6 text-left font-light">
                {
                    !addressId?'Add a new ':'Update '
                }
                shipping address to your address book
            </p>

            <form className="grid md:grid-cols-2 grid-cols-1  gap-x-10 gap-y-6" onSubmit={onSumbitHandler}>
                
                <fieldset className="md:col-span-2 col-span-1">
                    <label htmlFor="label" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Label</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        type="text" id="label" name="label" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={label} placeholder="e.g. Home, Office, WareHouse" />
                    {formErrors.label && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.label}</span>}
                </fieldset>

                <fieldset className="md:col-span-2 col-span-1">
                    <label htmlFor="building" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Building / Apt / Suite</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        type="text" id="building" name="building" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={building} placeholder="Suite 200" />
                    {formErrors.building && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.building}</span>}
                </fieldset>

                <fieldset className="md:col-span-2 col-span-1">
                    <label htmlFor="street" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Street Address</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="123 Market Street"
                        id="street" name="street" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={street} />

                    {formErrors.street && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.street}</span>}
                </fieldset>

                <fieldset className="">
                    <label htmlFor="city" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">City / Suburb</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="Sydney"
                        type="text" id="city" name="city" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={city} />
                    {formErrors.city && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.city}</span>}
                </fieldset>
                <fieldset className="">
                    <label htmlFor="state" className=" font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">State</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="NSW"
                        type="text" id="state" name="state" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={state} />
                    {formErrors.state && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.state}</span>}

                </fieldset>
                <fieldset className="">
                    <label htmlFor="postcode" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">postcode</label>
                    <input
                        onChange={e => postCodeHandler(e)}
                        placeholder="2000"
                        type="string" id="postcode" name="postcode" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={postcode} />
                    {formErrors.postcode && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.postcode}</span>}

                </fieldset>

                <fieldset className="mb-4">
                    <label htmlFor="country" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">country</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="Australia"
                        type="text" id="country" name="country" className="border-[1px] outline-none block px-3 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={country} />
                    {formErrors.country && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.country}</span>}

                </fieldset>

                <fieldset className="col-span-2">
                    <label htmlFor="setAsDefault" className="text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full flex items-center gap-2">
                        {setAsDefault ? <GoCheckbox className="size-6" /> : <MdOutlineCheckBoxOutlineBlank className="size-6" />}
                        Set as default address
                    </label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        type="checkbox"
                        id="setAsDefault"
                        name="setAsDefault"
                        className="appearance-none hidden" />
                </fieldset>

                <button type="submit" id="add_product" className="w-full md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base">{edit ? 'Update' : 'Submit'} </button>
            </form>
        </>

    )
}

export default ShippingForm