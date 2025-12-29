import { gql } from "@apollo/client";

export const LOGIN_ADMIN = gql`
  mutation LogInAdmin($input: LogInInput!) {
  logInAdmin(input: $input) {
    accessToken
    isLoggedIn
    user {
      role
      id
    }
  }
}
`;


export const LOGIN_USER = gql`
  mutation LogInUser($input: LogInInput!) {
  logInUser(input: $input) {
    accessToken
    isLoggedIn
    user {
      role
      id
    }
  }
}
`

export const LOGIN_GOOGLE_USER = gql`
  mutation LogInGoogleUser($credential: String!) {
  logInGoogleUser(credential: $credential) {
    accessToken
    isLoggedIn
    user {
       role
      id
    }
  }
}
`

export const REFRESH_TOKEN = gql`
mutation RefreshToken {
  refreshToken {
    accessToken
    isLoggedIn
    user {
      role
      id
    }
  }
}
`

export const LOGOUT_USER = gql`
    mutation LogOutUser {
    logOutUser {
        user {
        role
        id
        }
        isLoggedIn
    }
}
`