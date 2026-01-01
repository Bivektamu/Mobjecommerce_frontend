import { gql } from "@apollo/client";

export const GET_USER = gql`
  query User($userId: ID) {
  user(id: $userId) {
    id
    firstName
    lastName
    email
    address {
        street
        city
        postcode
        state
        country
      }
  }
}
`;

export const GET_USERS = gql`
  query Users {
    users {
      id
      firstName
      lastName
      email
      address {
        street
        city
        postcode
        state
        country
      }
      role
      registeredDate
    }
  }
`;


export const GET_USER_EMAIL = gql`
  query Query($userEmailId: ID) {
    userEmail(id: $userEmailId)
  }
`

export const GET_USER_ADDRESSES = gql`
query UserAddresses {
  userAddresses {
    id
    label
    street
    building
    city
    postcode
    state
    country
    setAsDefault
  }
}
`


export const GET_USER_ADDRESS = gql`
  query UserAddress($userAddressId: ID) {
  userAddress(id: $userAddressId) {
    id
    label
    street
    building
    city
    postcode
    state
    country
    setAsDefault
  }
}
`;

