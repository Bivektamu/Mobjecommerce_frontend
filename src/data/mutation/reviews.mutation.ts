import { gql } from "@apollo/client";

export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReview) {
    createReview(input: $input) {
      id
      userId
      productId
      rating
      review
      createdAt
      updateAt
    }
  }
`

export const EDIT_REVIEW = gql`
  mutation EditReview($input: EditReview) {
    editReview(input: $input) {
      id
      userId
      productId
      rating
      review
      createdAt
      updateAt
    }
  }
`

export const DELETE_REVIEW = gql`
mutation DeleteReview($reviewId: ID) {
  deleteReview(id: $reviewId) {
    success
  }
}
`


export const ADD_TO_WISH_LIST = gql`
 mutation AddToWishList($input: WishListInput) {
  addToWishList(input: $input) {
    id
    userId
    products {
      id
    createdAt
    }
  }
}
`
