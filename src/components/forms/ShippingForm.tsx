import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { v4 as uuidv4, v4 } from 'uuid';
import { Action, Address, FormError, Toast, Toast_Vairant, ValidateSchema } from "../../store/types"
import validateForm from "../../utils/validate"
import { useUser } from "../../store/slices/userSlice"
import { useStoreDispatch } from "../../store"
import { addToast } from "../../store/slices/toastSlice";
import { useMutation, useQuery } from "@apollo/client";
import { GET_USER_ADDRESS, GET_USER_ADDRESSES } from "../../data/query/user.query";
import { GoCheckbox } from "react-icons/go";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { UPDATE_ADDRESS_BY_ID } from "../../data/mutation/users.mutation";
import { stripTypename } from "@apollo/client/utilities";

interface Props {
    addressId?: string,
    closeModal: () => void,
    setShipping?: (shipping: Address) => void
}

const ShippingForm = ({ addressId, closeModal, setShipping }: Props) => {

    const { action, user } = useUser()
    const dispatch = useStoreDispatch()

    const [updateAddressById] = useMutation(UPDATE_ADDRESS_BY_ID, {
        refetchQueries: [
            { query: GET_USER_ADDRESSES }
        ],
        onCompleted: () => {
            closeModal?.()
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.SUCCESS,
                msg: `Address successfully ${addressId ? 'updated' : " added"}`
            }
            dispatch(addToast(newToast))
        },
        onError: (error) => {
            const newToast: Toast = {
                id: v4(),
                variant: Toast_Vairant.WARNING,
                msg: error.message
            }
            dispatch(addToast(newToast))
        }
    })


    const { data } = useQuery(GET_USER_ADDRESS, {
        variables: {
            userAddressId: addressId
        },
        skip: !addressId
    })

    const [formData, setFormData] = useState<Address>({
        id: addressId,
        street: '',
        postcode: '',
        city: '',
        state: '',
        label: user ? '' : 'guest',
        building: '',
        country: '',
        setAsDefault: false
    } as Address)

    useEffect(() => {
        console.log(data)
        if (data && data.userAddress) {
            const address: Address = stripTypename(data.userAddress)
            console.log(address)
            setFormData(prev => ({ ...prev, ...address }))
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

        if (addressId)
            updateAddressById({
                variables: {
                    input: formData
                }
            })

        else
            setShipping?.({ ...formData })

        closeModal()

    }

    return (
        <>
            {
                user ?
                    <>

                        <h4 className="text-left font-semibold md:text-xl text-lg mb-2">
                            {addressId ? 'Update' : 'Add New'} Address
                        </h4>
                        <p className="text-slate-500 text-xs mb-6 text-left font-light">
                            {
                                !addressId ? 'Add a new ' : 'Update '
                            }
                            shipping address to your address book
                        </p>
                    </>

                    :
                    <>
                        <h4 className="text-left font-semibold md:text-xl text-lg mb-2">
                            Shipping Address
                        </h4>
                        <p className="text-slate-500 text-xs mb-6 text-left font-light">
                            Please add shipping address
                        </p>
                    </>
            }
            <form className="grid md:grid-cols-2 grid-cols-1  gap-x-10 gap-y-6" onSubmit={onSumbitHandler}>

                {
                    user &&
                    <fieldset className="md:col-span-2 col-span-1">
                        <label htmlFor="label" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Label</label>
                        <input
                            onChange={e => onChangeHandler(e)}
                            type="text" id="label" name="label"
                            className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal capitalize" value={label} placeholder="e.g. Home, Office, WareHouse" />
                        {formErrors.label && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.label}</span>}
                    </fieldset>
                }

                <fieldset className="md:col-span-2 col-span-1">
                    <label htmlFor="building" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Building / Apt / Suite</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        type="text" id="building" name="building" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={building} placeholder="Suite 200" />
                    {formErrors.building && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.building}</span>}
                </fieldset>

                <fieldset className="md:col-span-2 col-span-1">
                    <label htmlFor="street" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">Street Address</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="123 Market Street"
                        id="street" name="street" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={street} />

                    {formErrors.street && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.street}</span>}
                </fieldset>

                <fieldset className="">
                    <label htmlFor="city" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">City / Suburb</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="Sydney"
                        type="text" id="city" name="city" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal capitalize" value={city} />
                    {formErrors.city && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.city}</span>}
                </fieldset>
                <fieldset className="">
                    <label htmlFor="state" className=" font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">State</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="NSW"
                        type="text" id="state" name="state" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal uppercase" value={state} />
                    {formErrors.state && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.state}</span>}

                </fieldset>
                <fieldset className="">
                    <label htmlFor="postcode" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">postcode</label>
                    <input
                        onChange={e => postCodeHandler(e)}
                        placeholder="2000"
                        type="string" id="postcode" name="postcode" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal" value={postcode} />
                    {formErrors.postcode && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.postcode}</span>}

                </fieldset>

                <fieldset className="mb-4">
                    <label htmlFor="country" className="capitalize text-left font-medium text-slate-600 md:text-sm text-xs block mb-2 w-full">country</label>
                    <input
                        onChange={e => onChangeHandler(e)}
                        placeholder="Australia"
                        type="text" id="country" name="country" className="border-[1px] outline-none block px-3 bg-slate-50 py-2 rounded w-full md:text-sm text-xs placeholder:font-normal capitalize" value={country} />
                    {formErrors.country && <span className='text-red-500 text-xs text-left block mt-2'>{formErrors.country}</span>}

                </fieldset>

                {
                    user &&
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

                }
                <button type="submit" id="add_product" className="w-full md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base">{addressId ? 'Update' : 'Submit'} </button>
            </form>
        </>

    )
}

export default ShippingForm