'use server'

import {
	paymentMethodSchema,
	shippingAddressSchema,
	signInFormSchema,
	signUpFormSchema,
} from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { prisma } from "@/db/prisma";
import { hashSync } from "bcrypt-ts-edge";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import z from "zod";

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
	const cookiesStore = await cookies();
	cookiesStore.delete("sessionCartId");

	revalidatePath("/", "layout");
	await signOut({ redirectTo: "/", redirect: true });
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
		//  console.log("🚀 ~ signUpUser ~ error:", error.errors);:	[
		// {
		//   code: 'too_small',
		//   minimum: 3,
		//   type: 'string',
		//   inclusive: true,
		//   exact: false,
		//   message: 'Name must be at least 3 characters long',
		//   path: [ 'name' ]
		// }]
		// console.log("🚀 ~ signUpUser ~ error:", error.meta?.target);
		if (isRedirectError(error)) {
			throw error;
		}
		return { success: false, message: formatError(error) };
	}
}

// Get user by ID
export async function getUserById(userId: string) {
	const user = await prisma.user.findFirst({
		where: { id: userId },
	});
	if (!user) throw new Error("User not found");
	return user;
}

// Update the user's address
export async function updateUserAddress(data: ShippingAddress) {
	try {
		const session = await auth();

		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});

		if (!currentUser) throw new Error("User not found");

		const address = shippingAddressSchema.parse(data); // why parse? because we want to validate the data. if it's invalid, it will throw an error.

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { address },
		});
		return { success: true, message: "Address updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}

// Update user's payment method
export async function updateUserPaymentMethod(
	data: z.infer<typeof paymentMethodSchema>
) {
	try {
		const session = await auth();
		const currentUser = await prisma.user.findFirst({
			where: { id: session?.user?.id },
		});

		if (!currentUser) throw new Error("User not found");
		const paymentMethod = paymentMethodSchema.parse(data); // why parse? because we want to validate the data. if it's invalid, it will throw an error.

		await prisma.user.update({
			where: { id: currentUser.id },
			data: { paymentMethod: paymentMethod.type },
		});
		return { success: true, message: "Payment method updated successfully" };
	} catch (error) {
		return { success: false, message: formatError(error) };
	}
}
