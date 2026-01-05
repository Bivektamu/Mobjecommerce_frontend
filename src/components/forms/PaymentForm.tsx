import { FormEvent, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { BillingDetails } from '../../store/types'
import { StripePaymentElementOptions } from '@stripe/stripe-js'

interface Props {
    billing: BillingDetails,
    total:number
}
const PaymentForm = ({ billing, total }: Props) => {

    const stripe = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)


    const paymentOptions: StripePaymentElementOptions = {
        fields: {
            billingDetails: "auto",
        },
        defaultValues: {
            billingDetails: {
                name: billing.name,
                email: billing.email,
                address: {
                    line1: billing.street,
                    city: billing.city,
                    state: billing.state,
                    postal_code: billing.postcode,
                    country: billing.country,
                }
            }
        }
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        if (!stripe || !elements) {
            return
        }
        setLoading(true)

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                return_url: `${window.location.origin}/checkout/success`,
            }
        })

        if (error) {
            alert(error.message)
            setLoading(false)
        }
    }

    return (

        <>
            <h2 className="font-bold md:text-xl text-lg lg:mb-12 md:mb-12 mb-6">Payment</h2>
            <p className="text-slate-500 text-xs  text-left font-light mb-3">
                All transactions are secure and encrypted.
            </p>

            <PaymentElement options={paymentOptions} />
            <br /><br />
            <button
                type='submit'
                className='bg-black text-white py-2 px-4 rounded text-center cursor-pointer w-full text-sm md:text-base'
                disabled={loading || !stripe}
                onClick={handleSubmit}>Pay ${total.toFixed(2)}</button>
        </>
    )
}

export default PaymentForm