'use server'

import {  CartItem } from "@/types";
import { convertToPlainObject, formatError } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema } from "../validators";

export async function addItemToCart(data: CartItem) {
  console.log("🚀 ~ addItemToCart ~ data:", data)
  try {
    // Check for cart cookie
    const allCookies = await cookies();
    // log wszystkich cookies (sprawdź logi serwera)

    // próbuj wykryć typowe nazwy cookie sesji
    const sessionCartId = allCookies.get('sessionCartId')?.value
      ?? allCookies.get('__Secure-next-auth.session-token')?.value
      ?? allCookies.get('next-auth.session-token')?.value
      ?? allCookies.get('next-auth.callback-url')?.value
      ?? undefined

    //  Get session and user ID
    // Spróbuj przekazać cookies() do auth() jeśli implementacja to wspiera
    let session
    try {
      session = await auth({ cookies: allCookies } as any) // jeśli auth przyjmuje kontekst, użyj go; as any żeby nie łamać typów
    } catch (e) {
      // fallback na wywołanie bez argumentów
      session = await auth()
    }
    const userId = session?.user?.id

    // Get cart 
    const cart = await getMyCart();

    // Parse and validate item
    const item = cartItemSchema.parse(data)

    //Find product in database

    const product = await prisma.product.findFirst({
      where: { id: item.productId },
    });
    
    // TESTING
    console.log("🚀 ~ addItemToCart ~ product:", product)
    console.log("🚀 ~ addItemToCart ~ item:", item)
    console.log("🚀 ~ addItemToCart ~ session:", session)
    console.log("🚀 ~ addItemToCart ~ sessionCartId:", sessionCartId)
    console.log("🚀 ~ addItemToCart ~ userId:", userId)

    return {
      success: true,
      message: 'Item added to cart successfully',
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

export async function getMyCart() {
   // Check for cart cookie
    const allCookies = await cookies();
    // log wszystkich cookies (sprawdź logi serwera)

    // próbuj wykryć typowe nazwy cookie sesji
    const sessionCartId = allCookies.get('sessionCartId')?.value
      ?? allCookies.get('__Secure-next-auth.session-token')?.value
      ?? allCookies.get('next-auth.session-token')?.value
      ?? allCookies.get('next-auth.callback-url')?.value
      ?? undefined

    //  Get session and user ID
    // Spróbuj przekazać cookies() do auth() jeśli implementacja to wspiera
    let session
    try {
      session = await auth({ cookies: allCookies } as any) // jeśli auth przyjmuje kontekst, użyj go; as any żeby nie łamać typów
    } catch (e) {
      // fallback na wywołanie bez argumentów
      session = await auth()
    }
  const userId = session?.user?.id
  
  // Get user cart from database based on userId or sessionCartId
  const cart = await prisma.cart.findFirst({
    where: userId ? { userId: userId } : { sessionCartId: sessionCartId },
  });
  if (!cart) return undefined

  // Convert decimals and return
  return convertToPlainObject({
    ...cart, 
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
    taxPrice: cart.taxPrice.toString(),
  })
}