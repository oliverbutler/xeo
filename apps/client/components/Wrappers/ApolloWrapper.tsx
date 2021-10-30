import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  HttpLink,
  ApolloLink,
  concat,
} from '@apollo/client';

const httpLink = new HttpLink({ uri: 'http://localhost:3333/graphql' });

const authMiddleware = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers = {} }) => ({
    headers: {
      ...headers,
      ['Authorization']: `Bearer ${JSON.parse(
        localStorage.getItem('accessToken')
      )}`,
    },
  }));

  return forward(operation);
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: concat(authMiddleware, httpLink),
});

export const ApolloWrapper: React.FunctionComponent = ({ children }) => {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
};
