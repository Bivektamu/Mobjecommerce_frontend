import { gql } from "@apollo/client";

export const CREATE_PAYMENT_INTENT = gql`
    mutation CreatePaymentIntent($input: CreateOrderInput!) {
        createPaymentIntent(input: $input) {
            clientSecret
            orderId
        }
    }
`