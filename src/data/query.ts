import { gql } from "@apollo/client";

export const GET_AUTH = gql`
  query GetAuthStatus {
    getAuthStatus {
      isLoggedIn
      user {
        role
        id
      }
    }
  }
`;

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

export const GET_REVIEWS_BY_PRODUCT_ID = gql`
  query ProductReviews($productReviewsId: ID) {
    productReviews(id: $productReviewsId) {
      id
    userId {
      _id
      firstName
      lastName
      email
    }
    productId
    rating
    review
    createdAt
    updateAt
    }
  }
`

export const GET_REVIEWS = gql`
  query Reviews {
  reviews {
    id
    userId {
      _id
      firstName
      lastName
      email
    }
    productId {
      _id
      title
      imgs {
        url
      }
    }
    rating
    review
    createdAt
    updateAt
  }
}
`


export const GET_WISH_LIST_BY_USER_ID = gql`
  query WishListByUserId($userId: ID) {
    wishListByUserId(userId: $userId) {
      id
      userId
      products {
        id
        createdAt
      }
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