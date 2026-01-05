import { gql } from "@apollo/client";

export const CREATE_PAYMENT_INTENT = gql`
    mutation CreatePaymentIntent($input: CreateOrderInput!) {
        createPaymentIntent(input: $input) {
            clientSecret
            orderId
        }
    }
`

export const GET_ORDER_BY_PAYMENT_INTENT_ID=gql`
    query OrderByPaymentIntent($paymentIntentId: String!) {
    orderByPaymentIntent(paymentIntentId: $paymentIntentId) {
        id
        status
        orderNumber
  }
}
`