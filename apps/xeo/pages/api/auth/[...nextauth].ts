import GithubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { DynamoDB, DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import NextAuth from 'next-auth';
import { DynamoDBAdapter } from '@next-auth/dynamodb-adapter';

if (!process.env.GITHUB_ID || !process.env.GITHUB_SECRET) {
  throw new Error('GITHUB_ID and GITHUB_SECRET must be set in .env');
}

if (!process.env.GOOGLE_ID || !process.env.GOOGLE_SECRET) {
  throw new Error('GITHUB_ID and GITHUB_SECRET must be set in .env');
}

declare module 'next-auth' {
  export interface Session {
    id: string;
  }
}

const config: DynamoDBClientConfig = {
  credentials: {
    accessKeyId: process.env.NEXT_AUTH_AWS_ACCESS_KEY as string,
    secretAccessKey: process.env.NEXT_AUTH_AWS_SECRET_KEY as string,
  },
  region: process.env.NEXT_AUTH_AWS_REGION,
};

const client = DynamoDBDocument.from(new DynamoDB(config), {
  marshallOptions: {
    convertEmptyValues: true,
    removeUndefinedValues: true,
    convertClassInstanceToMap: true,
  },
});

export default NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  adapter: DynamoDBAdapter(client, { tableName: 'xeo' }),
  callbacks: {
    session: async ({ session, user }) => {
      session.id = user.id;
      return Promise.resolve(session);
    },
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
});
