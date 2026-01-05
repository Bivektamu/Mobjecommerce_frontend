import { gql } from "@apollo/client";

export const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($input: OrderStatus) {
    updateOrderStatus(input: $input)
  }
`
