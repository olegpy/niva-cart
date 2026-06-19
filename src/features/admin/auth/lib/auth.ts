import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { authenticate } from "./authenticate";

if (process.env.VERCEL_URL && !process.env.NEXTAUTH_URL) {
    // Redirect to the correct URL
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL}`;
}

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
    },
    pages: {
        signIn: '/admin/login',
    },
    providers: [
        CredentialsProvider({
            id: 'credentials',
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            authorize: async (credentials) => authenticate(
                credentials?.email ?? '',
                credentials?.password ?? ''
            )
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.role = user.role;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user && token.role) {
                session.user.role = token.role;
            }
            return session;
        }
    }
}
