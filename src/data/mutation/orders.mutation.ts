import { gql } from "@apollo/client";

export const CREATE_ORDER = gql`
  mutation CreateOrder($input: OrderInput) {
    createOrder(input: $input)
  }
`

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: OrderStatus) {
    updateOrderStatus(input: $input)
  }
`
