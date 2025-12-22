import { gql } from "@apollo/client";

export const LOGIN_ADMIN = gql`
  mutation LogInAdmin($input: LogInInput!) {
    logInAdmin(input: $input) {
      token
    }
  }
`;


export const LOGIN_USER = gql`
  mutation LogInUser($input: LogInInput!) {
    logInUser(input: $input) {
      token
    }
  }
`

export const LOGIN_GOOGLE_USER = gql`
  mutation LogInGoogleUser($credential: String!) {
    logInGoogleUser(credential: $credential) {
      token
    }
  }
`

export const CREATE_USER = gql`
  mutation Mutation($input: UserInput) {
    createUser(input: $input) {
      id
    }
  }
`

export const DELETE_USER = gql`
  mutation DeleteUser($deleteUserId: ID) {
    deleteUser(id: $deleteUserId) {
      success
      message
    }
  }
`

export const UPDATE_ADDRESS = gql`
  mutation UpdateAddress($input: AddressInput) {
    updateAddress(input: $input) {
      city
      country
      postcode
      street
      state
    }
}
`

export const CREATE_PRODUCT = gql`
mutation CreateProduct($input: CreateProduct) {
  createProduct(input: $input) {
    colors
    description
    featured
    id
    imgs {
      id
      url
    }
    price
    quantity
    sizes
    sku
    slug
    stockStatus
    title
  }
}
`
export const EDIT_PRODUCT = gql`
mutation EditProduct($input: EditProduct) {
  editProduct(input: $input) {
    id
    title
    description
  }
}
`

export const DELETE_PRODUCT = gql`
  mutation Mutation($deleteProductId: ID) {
    deleteProduct(id: $deleteProductId) {
      success
    }
  }
`

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

export const CHANGE_PASSWORD = gql`
  mutation ChangePassWord($input: ChangePassword) {
    changePassWord(input: $input)
  }
`

export const UPDATE_ACCOUNT_DETAILS = gql`
  mutation UpdateAccount($input: UpdateAccount) {
    updateAccount(input: $input) {
      firstName
      lastName
      email
    }
  }
`