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

export const UPDATE_ADDRESS_BY_ID = gql`
  mutation UpdateAddressById($input: AddressInput) {
  updateAddressById(input: $input)
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

export const DELETE_ADDRESS_BY_ID = gql`
  mutation DeleteAddress($deleteAddressId: ID) {
    deleteAddress(id: $deleteAddressId)
  }
`
