"use server";

import { signInFormSchema, signUpFormSchema } from "../validators";
import { signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// Sign in the user with credentials
export async function signInWithCredentials(
	prevState: unknown,
	formData: FormData
) {
	try {
		const user = signInFormSchema.parse({
			email: formData.get("email"),
			password: formData.get("password"),
		});
		console.log("🚀 ~ signInWithCredentials ~ user:", user);

		await signIn("credentials", user);

		return { success: true, message: "Signed in successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			// The `isRedirectError` function is used to check if the error is a redirect error.
			throw error;
		}
		return { success: false, message: "Invalid email or password" };
	}
}

// Sign out the user
export async function signOutUser() {
	await signOut();
}

// Sign up user
export async function signUpUser(prevState: unknown, formData: FormData) {
	try {
		const user = signUpFormSchema.parse({
			name: formData.get("name"),
			email: formData.get("email"),
			password: formData.get("password"),
			confirmPassword: formData.get("confirmPassword"),
		});

		const plainPassword = user.password;
		user.password = hashSync(user.password, 10);

		//prisma.user.create({
		// data: { ... },      // WYMAGANE - dane do utworzenia
		// select: { ... },    // opcjonalne - wybór pól do zwrócenia
		// include: { ... }    // opcjonalne - dołączenie relacji
		// })

		await prisma.user.create({
			data: {
				name: user.name,
				email: user.email,
				password: user.password,
			},
		});

		await signIn("credentials", { email: user.email, password: plainPassword });

		return { success: true, message: "User registered successfully" };
	} catch (error) {
		if (isRedirectError(error)) {
			throw error;
		}
		return { success: false, message: "User was not registered" };
	}
}
