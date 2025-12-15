import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/db/prisma";
import CredentialsProvider from "next-auth/providers/credentials";
import { compareSync } from "bcrypt-ts-edge";

import { authConfig } from "./auth.config";
import NextAuth from "next-auth";
import { cookies } from "next/headers";

export const config = {
	pages: {
		signIn: "/sign-in",
		error: "/sign-in",
	},
	session: {
		// This is because this value has to be one of 3 values ("jwt" | "database" | undefined) and we want to make sure it's always "jwt" and not a string that could be anything. Here, strategy is no longer inferred as string; it is inferred as the literal type "jwt".
		strategy: "jwt" as const,
		maxAge: 30 * 24 * 60 * 60, // 30 days
	},
	adapter: PrismaAdapter(prisma),
	// Łączy NextAuth z bazą danych przez Prisma. Automatycznie zarządza tabelami: User, Account, Session, VerificationToken
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
					where: {
						email: credentials.email as string,
					},
				});

				// Check if user exists and if the password matches
				if (user && user.password) {
					const isMatch = compareSync(
						credentials.password as string,
						user.password
					);

					// If password is correct, return user
					if (isMatch) {
						return {
							id: user.id,
							name: user.name,
							email: user.email,
							role: user.role,
						};
					}
				}
				// If user does not exist or password does not match return null
				return null;
			},
		}),
	],
	callbacks: {
		...authConfig.callbacks,
		async session({ session, user, trigger, token }: any) {
			// set the user id from the token
			session.user.id = token.sub;
			session.user.role = token.role;
			session.user.name = token.name;

			// if there is an update, set the user name
			if (trigger === "update") {
				session.user.name = user.name;
			}
			return session;
		},
		async jwt({ token, user, trigger, session }: any) {
			// Assign user fields to token
			if (user) {
				token.id = user.id;
				token.role = user.role;

				// If user has no name then use the email
				if (user.name === "NO_NAME") {
					token.name = user.email!.split("@")[0];

					// Update database to reflect the token name
					await prisma.user.update({
						where: { id: user.id },
						data: { name: token.name },
					});
				}
				//
				if (["signIn", "signUp"].includes(trigger)) {
					const cookiesObject = await cookies();
					const sessionCartId = cookiesObject.get("sessionCartId")?.value;

					if (!sessionCartId) return;

					const sessionCart = await prisma.cart.findFirst({
						where: { sessionCartId },
					});
					console.log("====>", sessionCart);
					if (!sessionCart) return;

					if (sessionCart.userId !== user.id) {
						// Delete current user cart
						await prisma.cart.deleteMany({
							where: { userId: user.id },
						});

						// Assign new cart
						await prisma.cart.update({
							where: { id: sessionCart.id },
							data: { userId: user.id },
						});
					}
				}
			}

			// Handle session updates
			if(session?.user.name && trigger === 'update'){
				token.name = session.user.name;
			}

			return token;
		},
	},
};

export const { handlers, auth, signIn, signOut } = NextAuth(config);
