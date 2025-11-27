export const metadata = {
	title: "Shopping Cart",
};

import React from "react";
import CartTable from "./cart-table";
import { getMyCart } from "@/lib/actions/cart.actions";

const CartPage = async () => {
	const cart = await getMyCart();
	return <CartTable cart={cart} />;
};

export default CartPage;
