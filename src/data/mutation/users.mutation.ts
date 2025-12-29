import { gql } from "@apollo/client";

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