import { ApolloClient, ApolloLink, InMemoryCache, fromPromise } from "@apollo/client";
import { onError } from "@apollo/client/link/error"
import { setContext } from '@apollo/client/link/context'
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";
import { getAccessToken, setAccessToken } from "../auth/tokenManager";
import { REFRESH_TOKEN } from "./mutation/auth.mutation";
import { ErrorCode } from "../store/types";


let isRefreshing = false;
let pending: (() => void)[] = [];
const uri = import.meta.env.PROD ? import.meta.env.VITE_PROD_URI : import.meta.env.VITE_DEV_URI



// used only for refresh
const refreshClient = new ApolloClient({
  uri,
  credentials: "include",
  cache: new InMemoryCache(),
});

const errorLink = onError(({ graphQLErrors, operation, forward }) => {
  const unauthenticated = graphQLErrors?.some(
    err => err.extensions?.code === ErrorCode.NOT_AUTHENTICATED
  );

  if (!unauthenticated) return;

  if (!isRefreshing) {
    isRefreshing = true;


    return fromPromise(
      refreshClient
        .mutate({ mutation: REFRESH_TOKEN })
        .then(res => {
          const newAccessToken = res.data?.refreshToken?.accessToken
          setAccessToken(newAccessToken);

          isRefreshing = false;
          pending.forEach(cb => cb());
          pending = [];
        })
        .catch(() => {
          setAccessToken(null);
          isRefreshing = false;
        })
    ).flatMap(() => forward(operation));
  }

  return fromPromise(
    new Promise<void>(resolve => pending.push(resolve))
  ).flatMap(() => forward(operation));
});


const authLink = setContext((_, { headers }) => {
  const accessToken = getAccessToken()
  return {
    headers: {
      ...headers,
      authorization: accessToken ? `Bearer ${accessToken}` : '',
      'Apollo-Require-Preflight': 'true'
    }
  }
})


// Create an upload link for handling file uploads
const uploadLink = createUploadLink({
  uri,
  credentials: "include"
});

// Use ApolloLink.from to concatenate multiple links
const link = ApolloLink.from([
  errorLink,
  authLink,
  uploadLink,
  // httpLink,
]);

const client = new ApolloClient({
  link: link,
  cache: new InMemoryCache(),
})

export default client