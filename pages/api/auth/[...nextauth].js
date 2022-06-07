import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@next-auth/mongodb-adapter';
import { clientPromise } from '../../../lib/mongodb';

export default NextAuth({
  // https://next-auth.js.org/configuration/providers/oauth
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  pages: {
    signIn: '/signin',
    signOut: '/signout',
  },
  callbacks: {
    async session({ session, token, user }) {
      session.userId = user.id;
      return session;
    },
  },
});
