import NextAuth from 'next-auth';
import { authConfig } from './auth.config';

export const { auth: middleware } = NextAuth(authConfig);

//his will now use the auth.config.ts file for the configuration and the auth.ts file for the middleware function.
