import { gql } from "@apollo/client";



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
