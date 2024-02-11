import CredentialsProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import { NuxtAuthHandler } from '#auth';
import { compare } from "bcrypt-ts";
import prisma from "../../../libs/prismadb";

export default NuxtAuthHandler({
    // TODO: SET A STRONG SECRET, SEE https://sidebase.io/nuxt-auth/configuration/nuxt-auth-handler#secret
    secret: process.env.NEXTAUTH_SECRET || 'my-auth-secret',
    // TODO: ADD YOUR OWN AUTHENTICATION PROVIDER HERE, READ THE DOCS FOR MORE: https://sidebase.io/nuxt-auth
    providers: [
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        GithubProvider.default({
            clientId: process.env.GITHUB_CLIENT_ID || 'enter-your-client-id-here',
            clientSecret: process.env.GITHUB_CLIENT_SECRET || 'enter-your-client-secret-here'
        }),
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point 
        GoogleProvider.default({
            clientId: process.env.GOOGLE_CLIENT_ID || 'enter-your-client-id-here',
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'enter-your-client-secret-here'
        }),
        // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
        CredentialsProvider.default({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: 'Username', type: 'text', placeholder: '(hint: jsmith)' },
                password: { label: 'Password', type: 'password', placeholder: '(hint: hunter2)' }
            },
            async authorize(credentials: any) {
                const credentialsError = 'Invalid credentials';

                if (!credentials?.email || !credentials?.password) {
                    throw new Error(credentialsError);
                }

                const user = await prisma.user.findUnique({
                    where: {
                        email: credentials.email
                    }
                });


                if (!user || !user?.hashedPassword) {
                    throw new Error(credentialsError);
                }

                const isCorrectPassword = await compare(
                    credentials.password,
                    user.hashedPassword
                );

                if (!isCorrectPassword) {
                    throw new Error(credentialsError);
                }

                return user;
            }
        })
    ]
})
