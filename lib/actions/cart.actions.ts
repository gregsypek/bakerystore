"use server";

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, insertCartSchema } from "../validators";
import { revalidatePath } from "next/cache";

// Calculate cart prices
export const calcPrice = async (items: CartItem[]) => {
	const itemsPrice = round2(
			items.reduce((acc, item) => acc + Number(item.price) * item.qty, 0)
		),
		shippingPrice = round2(itemsPrice > 100 ? 0 : 10),
		taxPrice = round2(0.15 * itemsPrice),
		totalPrice = round2(itemsPrice + shippingPrice + taxPrice);

	return {
		itemsPrice: itemsPrice.toFixed(2),
		shippingPrice: shippingPrice.toFixed(2),
		taxPrice: taxPrice.toFixed(2),
		totalPrice: totalPrice.toFixed(2),
	};
};

export async function addItemToCart(data: CartItem) {
	console.log("🚀 ~ addItemToCart ~ data:", data);
	try {
		// Check for cart cookie
		const allCookies = await cookies();
		// log wszystkich cookies (sprawdź logi serwera)

		// próbuj wykryć typowe nazwy cookie sesji
		const sessionCartId =
			allCookies.get("sessionCartId")?.value ??
			allCookies.get("__Secure-next-auth.session-token")?.value ??
			allCookies.get("next-auth.session-token")?.value ??
			allCookies.get("next-auth.callback-url")?.value ??
			undefined;
		console.log("🚀 ~ addItemToCart ~ sessionCartId:", sessionCartId);

		//  Get session and user ID
		// Spróbuj przekazać cookies() do auth() jeśli implementacja to wspiera
		let session;
		try {
			session = await auth({ cookies: allCookies } as any); // jeśli auth przyjmuje kontekst, użyj go; as any żeby nie łamać typów
		} catch (e) {
			// fallback na wywołanie bez argumentów
			session = await auth();
		}
		const userId = session?.user?.id;
		console.log("🚀 ~ addItemToCart ~ userId:", userId);

		// Get cart
		const cart = await getMyCart();

		// Parse and validate item
		const item = cartItemSchema.parse(data);
		console.log("🚀 ~ addItemToCart ~ item:", item);

		// Find product in database

		const product = await prisma.product.findFirst({
			where: { id: item.productId },
		});
		if (!product) {
			throw new Error("Product not found");
		}

		if (!cart) {
			// Create new cart
			const prices = await calcPrice([item]);
			console.log("🚀 ~ addItemToCart ~ prices:", prices); // Dodaj to!

			const newCart = insertCartSchema.parse({
				userId: userId,
				items: [item],
				sessionCartId: sessionCartId,
				...(await calcPrice([item])),
			});

			// Add to database
			await prisma.cart.create({
				data: newCart,
			});

			// Revalidate product page
			revalidatePath(`/product/${product.slug}`);

			return {
				success: true,
				message: "Item added to cart successfully",
			};
		}

		// TESTING
		// console.log("🚀 ~ addItemToCart ~ product:", product)
		// console.log("🚀 ~ addItemToCart ~ item:", item)
		// console.log("🚀 ~ addItemToCart ~ session:", session)
		// console.log("🚀 ~ addItemToCart ~ sessionCartId:", sessionCartId)
		// console.log("🚀 ~ addItemToCart ~ userId:", userId)
		
	} catch (error) {
		return {
			success: false,
			message: formatError(error),
		};
	}
}

export async function getMyCart() {
	// Check for cart cookie
	const allCookies = await cookies();
	// log wszystkich cookies (sprawdź logi serwera)

	// próbuj wykryć typowe nazwy cookie sesji
	const sessionCartId =
		allCookies.get("sessionCartId")?.value ??
		allCookies.get("__Secure-next-auth.session-token")?.value ??
		allCookies.get("next-auth.session-token")?.value ??
		allCookies.get("next-auth.callback-url")?.value ??
		undefined;

	//  Get session and user ID
	// Spróbuj przekazać cookies() do auth() jeśli implementacja to wspiera
	let session;
	try {
		session = await auth({ cookies: allCookies } as any); // jeśli auth przyjmuje kontekst, użyj go; as any żeby nie łamać typów
	} catch (e) {
		// fallback na wywołanie bez argumentów
		session = await auth();
	}
	const userId = session?.user?.id;

	// Get user cart from database based on userId or sessionCartId
	const cart = await prisma.cart.findFirst({
		where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
	});
	if (!cart) return undefined;

	// Convert decimals and return
	return convertToPlainObject({
		...cart,
		items: cart.items as CartItem[],
		itemsPrice: cart.itemsPrice.toString(),
		totalPrice: cart.totalPrice.toString(),
		shippingPrice: cart.shippingPrice.toString(),
		taxPrice: cart.taxPrice.toString(),
	});
}
