import { gql } from "@apollo/client";

export const GET_AUTH = gql`
query Query {
  getAuthStatus {
    isLoggedIn
    user {
      role
      id
    }
  }
}
`