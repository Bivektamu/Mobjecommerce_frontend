import { gql } from "@apollo/client";
export const GET_PRODUCTS = gql`
  query Products {
  products {
    id
    title
    slug
    description
    colors
    sizes
    price
    quantity
    imgs {
      id
      url
    }
    category
    sku
    stockStatus
    featured
  }
}
`

export const GET_PRODUCT_BY_ID = gql`
query Product($productId: ID) {
  product(id: $productId) {
    id
    title
    slug
    description
    colors
    sizes
    price
    quantity
    imgs {
      id
      url
    }
    category
    sku
    stockStatus
    featured
  }
}
`

export const GET_PRODUCT_AND_USER = gql`
  query ProductAndUser($productId: ID, $userId: ID) {
    product(id: $productId) {
      imgs {
        url
      }
      id
      title
    }
    user(id: $userId) {
      firstName
      email
      lastName
    }
  }
`