"use client";
import { Cart } from "@/types";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useTransition } from "react";
import { toast } from "sonner";

export default function CartTable({ cart }: { cart?: Cart }) {
	const router = useRouter;
	const [isPending, startTransition] = useTransition();
	return (
		<>
			<h1 className="py-4 h2-bold">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div className="">
					Your cart is empty. <Link href="/"> Go Shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">Table</div>
				</div>
			)}
		</>
	);
}
