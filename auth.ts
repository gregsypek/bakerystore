import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import { compareSync } from "bcrypt-ts-edge";
import { authConfig } from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma), // Łączy NextAuth z bazą danych przez Prisma. Automatycznie zarządza tabelami: User, Account, Session, VerificationToken
	session: {
		// This is because this value has to be one of 3 values ("jwt" | "database" | undefined) and we want to make sure it's always "jwt" and not a string that could be anything. Here, strategy is no longer inferred as string; it is inferred as the literal type "jwt".
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	providers: [
		CredentialsProvider({
			credentials: {
				email: { type: "email" },
				password: { type: "password" },
			},
			async authorize(credentials) {
				if (credentials == null) return null;

				// Find user in database
				const user = await prisma.user.findFirst({
					where: { email: credentials.email as string },
				});
				// Check if user exists and password matches
				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);
					// If password is correct, return user object
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}
				// If user does not exist or password is incorrect, return null
				return null;
			},
		}),
	],
	callbacks: {
		...authConfig.callbacks,
		async session({ session, token, trigger }: any) {
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;
			// If there is an update, set the user name
			if (trigger === "update") {
				session.user.name = token.name;
			}

			return session;
		},
		async jwt({ token, user }: any) {
			if (user) {
				// If user has no name then use the email
				token.role = user.role;

				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];
					// Update database to reflect the token name
					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}
			}

			return token;
		},
	},
});
