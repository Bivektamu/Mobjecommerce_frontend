import { gql } from "@apollo/client"


export const GET_ORDERS = gql`
query Orders($limit: Int) {
  orders(limit: $limit) {
    id
    orderNumber
    userId
    status
    total
    subTotal
    tax
    orderPlaced
    items {
      productId
      color
      quantity
      size
      price
      imgUrl
    }
    shippingAddress {
      street
      city
      postcode
      state
      country
    }
  }
}
`

export const GET_ORDERS_BY_USER_ID = gql`
  query UserOrders($userOrdersId: ID) {
    userOrders(id: $userOrdersId) {
      id
      orderNumber
      userId
      status
      total
      subTotal
      tax
      items {
        productId
        color
        quantity
        size
        price
        imgUrl
      }
      shippingAddress {
        street
        city
        postcode
        state
        country
      }
      orderPlaced
    }
  }

`


export const GET_ORDER_DETAILS_BY_ORDER_NUMBER = gql`
query OrderByNumber($orderNumber: String) {
  orderByNumber(orderNumber: $orderNumber) {
    id
    orderNumber
    userId
    status
    total
    subTotal
    tax
    items {
      productId
      color
      quantity
      size
      price
      imgUrl
    }
    shippingAddress {
      street
      city
      postcode
      state
      country
    }
    orderPlaced
  }
}
`