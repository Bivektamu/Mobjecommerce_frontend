import { FormEvent, useState } from 'react'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { BillingDetails } from '../../store/types'
import { StripePaymentElementChangeEvent, StripePaymentElementOptions } from '@stripe/stripe-js'
import WarnSvg from '../ui/WarnSvg'

interface Props {
    billing: BillingDetails,
    total: number
}

interface PaymentError {
    // decline_code: string,
    message: string
}
const PaymentForm = ({ billing, total }: Props) => {

    const stripe = useStripe()
    const elements = useElements()

    const [loading, setLoading] = useState(false)

    const [isPaymentComplete, setIsPaymentComplete] = useState<boolean>(false)

    const [error, setError] = useState<PaymentError | null>(null)


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
                return_url: `${window.location.origin}/checkout/order-confirmation`,
            }
        })

        if (error) {
            // "payment_intent_authentication_failure"
            // "card_declined"
            // if(error.type === 'validation_error') {
            // }


            setError({
                // decline_code: error.decline_code!,
                message: error.message!
            })
            setLoading(false)
        }
        else {
            setError(null)
        }
    }


    const handleChange = (event: StripePaymentElementChangeEvent) => [
        setIsPaymentComplete(event.complete)

    ]
    return (

        <>
            <h2 className="font-semibold md:text-xl text-lg lg:mb-12 md:mb-12 mb-6">Payment Method</h2>
            <p className="text-slate-500 text-xs  text-left font-light mb-3">
                All transactions are secure and encrypted.
            </p>

            {
                error && <div className='bg-rose-100 text-red-900  border border-rose-300 rounded p-4 mb-8 flex gap-4'>
                    <WarnSvg />
                    <div>
                        <p className='font-medium mb-2 '>Payment declined: 
                            {/* {error.decline_code.replace('_', ' ')} */}
                        </p>
                        <p className='text-sm'>{error.message}</p>
                    </div>
                </div>
            }

            <form id="stripe-form" onSubmit={handleSubmit}>

                <PaymentElement
                    options={paymentOptions}
                    onChange={handleChange}

                />
                <br /><br />
                <button
                    type='submit'
                    className={`py-2 px-4 rounded text-center cursor-pointer w-full text-sm md:text-base ${(loading || !isPaymentComplete || !stripe || !elements) ? 'disabled' : 'bg-black text-white '}`}
                    disabled={loading || !isPaymentComplete}
                >Pay ${total.toFixed(2)}</button>
            </form>
        </>
    )
}

export default PaymentForm