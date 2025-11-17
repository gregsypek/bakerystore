'use server'

import { Cart, CartItem } from "@/types";

export async function addItemToCart(data: CartItem) {
  return {
    success: true,
    message: 'Item added to cart successfully',
    // message: 'threre was an issue',
  }
}