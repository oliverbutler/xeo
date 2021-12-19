import {
  ApolloClient,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
  InMemoryCache,
} from '@apollo/client';

import introspectionQueryResultData from 'fragmentTypes.json';

const httpLink = new HttpLink({ uri: 'http://localhost:3333/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ...(localStorage.getItem('accessToken') && {
        ['Authorization']: `Bearer ${JSON.parse(
          localStorage.getItem('accessToken') ?? ''
        )}`,
      }),
    },
  }));
  return forward(operation).map((response) => {
    if (response.errors) {
      for (const error of response.errors) {
        if (error.extensions?.code === 'UNAUTHENTICATED') {
          localStorage.removeItem('accessToken');
          window.location.href = '/login';
        }
      }
    }
    return response;
  });
});

export const client = new ApolloClient({
  cache: new InMemoryCache({
    // https://www.apollographql.com/docs/react/data/fragments/#defining-possibletypes-manually
    // Implemented as when using a fragment on a Block type, only __typename was resolved, no other fields :(
    possibleTypes: introspectionQueryResultData.possibleTypes,
  }),
  link: concat(authMiddleware, httpLink),
});

export const ApolloWrapper: React.FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
