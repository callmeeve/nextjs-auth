import prisma from "./prisma";
import { compare } from "bcryptjs";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'text' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error('Missing email or password');
                }

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user) {
                    throw new Error('No user found with this email');
                }

                const isValidPassword = await compare(credentials.password, user.password);

                if (!isValidPassword) {
                    throw new Error('Invalid password');
                }

                return { id: user.id, name: user.name, email: user.email };
            },
        }),
    ],
    session: {
        strategy: 'jwt',
    },
    callbacks: {
        session: ({ session, token }) => {
            return {
                ...session,
                user: {
                    ...session.user,
                    id: token.id
                },
            };
        },
        jwt: ({ token, user }) => {
            if (user) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const u = user as unknown as any;
                return {
                    ...token,
                    id: u.id
                };
            }
            return token;
        },
    },
    pages: {
        signIn: '/login',
    },
    secret: process.env.NEXTAUTH_SECRET
};