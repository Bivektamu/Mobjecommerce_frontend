import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { BillingDetails, FormError, ValidateSchema } from "../../store/types"
import validateForm from "../../utils/validate"
import { useUser } from "../../store/slices/userSlice";

interface Props {
    setBilling: (billing: BillingDetails) => void,
    closeModal: () => void,
    email:string | null
}


const BillingForm = ({ setBilling, closeModal, email }: Props) => {

    const { user } = useUser()

    const [formData, setFormData] = useState<BillingDetails>({
        name: '',
        email: '',
        street: '',
        postcode: '',
        city: '',
        state: '',
        building: '',
        country: '',
    } as BillingDetails)

    const [formErrors, setFormErrors] = useState<FormError>({})

    useEffect(()=> {
        if(email) {
            setFormData(prev=>({
                ...prev,
                name:'guest',
                email
            }))
        }
    }, [email])

    
    useEffect(()=> {
        if(user) {
            setFormData(prev=>({
                ...prev,
                name: user.firstName +' '+user.lastName,
                email: user.email
            }))
        }
    }, [user])

    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(formData).length > 0) {
            Object.keys(formData).map(key => {
                if (formData[key as keyof BillingDetails]) {
                    setFormErrors(prev => ({ ...prev, [key]: '' }))
                }
            })
        }
    }, [formData])

    const { street, postcode, state, city, country, building } = formData

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
        // e.stopPropagation()
        if (!e.target.value) {
            setFormData(prev => ({
                ...prev,
                postcode: ''
            }))
        }
        else if (Number(e.target.value)) {
            // console.log('asdf')
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

        setBilling(formData)
        closeModal()
    }

    return (
        <div className="pt-8 border-t mt-8">
            <h4 className="text-left font-semibold md:text-xl text-lg mb-2">
                Billing Address
            </h4>
            <p className="text-slate-500 text-xs mb-6 text-left font-light">
                Please fill fields for billing address
            </p>

            <form className="grid md:grid-cols-2 grid-cols-1  gap-x-10 gap-y-6" onSubmit={onSumbitHandler}>

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

                <button type="submit" id="add_product" className="w-full md:w-[200px] bg-black text-white py-2 px-4 rounded text-center cursor-pointer text-sm md:text-base">Continue</button>
            </form>
        </div>

    )
}

export default BillingForm