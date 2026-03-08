import React, { FormEvent, useEffect, useState } from 'react'
import { ContactForm as ContactFormType, FormError, ValidateSchema } from '../../store/types';
import validateForm from '../../utils/validate';

const ContactForm = () => {

    const [userForm, setUserForm] = useState<ContactFormType>({
        firstName: '',
        lastName: '',
        email: '',
        orderNumber: '',
        subject: '',
        message: ''
    })

    const [sent, setSent] = useState(false)
    const [thankyouMessage, setThankyouMessage] = useState('Thank you for getting in touch! We appreciate you taking the time to write to us. While we review your message, here is a 10% discount code [THANKYOU10] to use on your next purchase as a token of our appreciation!')

    const [errors, setErrors] = useState<FormError>({})

    // code to remove error info when fields are typed
    useEffect(() => {
        if (Object.keys(userForm).length > 0) {
            Object.keys(userForm).map(key => {
                if (userForm[key as keyof typeof userForm]) {
                    setErrors(prev => ({ ...prev, [key]: '' }))
                }

            })
        }
    }, [userForm])


    const { firstName, lastName, email, orderNumber, subject, message } = userForm

    useEffect(() => console.log(subject), [subject])


    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setUserForm({ ...userForm, [e.target.name]: e.target.value })
        if (e.target.name === 'subject') {
            switch (e.target.value) {
                case 'returns/refunds':
                    setThankyouMessage('We’re sorry to hear your purchase didn’t work out. We have received your request and are reviewing it now. You will receive an update on your refund status within 24 hours.')
                    break;

                case 'orderStatus':
                    setThankyouMessage(`Thanks for your inquiry about order #${orderNumber?.toUpperCase()}. We’re looking into this for you and will provide an update within a few hours.`)
                    break;

                case 'productEnquiry':
                    setThankyouMessage('Thanks for your interest in our latest product. Our product experts will get back to you with the details you need as soon as possible')
                    break;

                case 'payments':
                    setThankyouMessage('Thank you for bringing this to our attention. We have received your payment enquiry and our billing team will investigate this immediately. You can expect a response within 2-4 business hours.')
                    break;

                case 'technicalSupport':
                    setThankyouMessage("Thanks for reaching out! We’ve received your support ticket. A technician will be with you shortly.")
                    break;

                default:
                    setThankyouMessage('Thank you so much for sharing your thoughts! Honest feedback is what helps us grow. We’ll review your comments carefully and use them to make mobje commerce even better.')
                    break;
            }
        }
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        e.stopPropagation()


        const validateSchema: ValidateSchema<unknown>[] =
            [
                {
                    name: 'firstName',
                    type: 'text',
                    value: firstName,
                    msg: 'Please insert first name.'
                },
                {
                    name: 'lastName',
                    type: 'text',
                    value: lastName,
                    msg: 'Please insert last name.'
                },
                {
                    name: 'email',
                    type: 'email',
                    value: email
                },
                {
                    name: 'subject',
                    type: 'subject',
                    value: subject
                },
                {
                    name: 'message',
                    type: 'message',
                    value: message
                },

            ]


        const newErrors: FormError = validateForm(validateSchema)

        if (Object.keys(newErrors).length > 0) {
            return setErrors({ ...newErrors })
        }

        setSent(true)
    }


    if (sent) {
        return <h3 className='text-center w-[600px] py-6 md:py-12 text-sm md:text-base'>{thankyouMessage}</h3>
    }
    else {
        return (
            <form onSubmit={handleSubmit} className='w-[400px]'>
                <fieldset className='mb-6'>
                    <label htmlFor="firstName" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>First name</label>
                    <input type="text" id="firstName" name='firstName' value={firstName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs md:text-sm text-black w-full py-2 px-4 ' />
                    {errors.firstName && <span className='text-xs text-red-500'>{errors.firstName}</span>}
                </fieldset>

                <fieldset className='mb-6'>
                    <label htmlFor="lastName" className='font-medium block mb-1 text-slate-600 text-xs  md:text-sm'>Last name</label>
                    <input type="text" name='lastName' id="lastName" value={lastName} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs    md:text-sm text-black w-full py-2 px-4 ' />
                    {errors.lastName && <span className='text-xs text-red-500'>{errors.lastName}</span>}
                </fieldset>

                <fieldset className='mb-6'>
                    <label htmlFor="email" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>Email</label>
                    <input type="text" id="email" name='email' value={email} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs md:text-sm text-black w-full py-2 px-4 ' />
                    {errors.email && <span className='text-xs text-red-500'>{errors.email}</span>}
                </fieldset>

                <fieldset className='mb-6 relative'>
                    <label htmlFor="orderNumber" className='font-medium block w-full mb-1 text-xs  md:text-sm text-slate-600'>Order Number</label>
                    <input
                        type='text'
                        id="orderNumber"
                        name='orderNumber'
                        value={orderNumber}
                        onChange={changeHandler}
                        className='border-[1px] border-slate-300 rounded-md block text-xs   md:text-sm text-black w-full py-2 px-4 uppercase' />
                    {errors.orderNumber && <span className='text-xs text-red-500'>{errors.orderNumber}</span>}
                </fieldset>
                <fieldset className='mb-6'>
                    <label htmlFor="subject" className='font-medium text-slate-600 text-xs md:text-sm block mb-2 w-full'>Subject</label>
                    <select
                        name="subject"
                        id="subject"
                        className='border-[1px] outline-none text-xs md:text-sm block px-4 py-2 rounded w-full'
                        onChange={changeHandler}>
                        <option value="">Select an enquiry type</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='returns/refunds'>Returns / Refunds</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='orderStatus'>Order Status</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='payments'>Payments</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='productEnquiry'>Product Enquiry</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='technicalSupport'>Technical Support</option>
                        <option className='outline-none block px-4 py-2 rounded w-full' value='feedback'>Feedback</option>
                    </select>
                    {errors.subject && <span className='text-red-500 text-xs'>{errors.subject}</span>}
                </fieldset>

                <fieldset className='mb-6'>
                    <label htmlFor="message" className='font-medium block mb-1 text-slate-600 text-xs md:text-sm'>Message</label>
                    <textarea id="message" name='message' value={message} onChange={changeHandler} className='border-[1px] border-slate-300 rounded-md block text-xs md:text-sm text-black w-full py-2 px-4 min-h-[100px]'>
                    </textarea>
                    {errors.message && <span className='text-xs text-red-500'>{errors.message}</span>}
                </fieldset>

                <button type="submit" className='bg-black text-white py-2 px-4 rounded text-center text-xs  md:text-sm cursor-pointer w-ful'>Send Message</button>
            </form>
        )
    }
}

export default ContactForm