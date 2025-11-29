"use client";

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Cart } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import AddButton from "./add-button";
import RemoveButton from "./remove-button";

export default function CartTable({ cart }: { cart?: Cart }) {
	const router = useRouter;
	return (
		<>
			<h1 className="py-4 h2-bold">Shopping Cart</h1>
			{!cart || cart.items.length === 0 ? (
				<div className="">
					Your cart is empty. <Link href="/"> Go Shopping</Link>
				</div>
			) : (
				<div className="grid md:grid-cols-4 md:gap-5">
					<div className="overflow-x-auto md:col-span-3">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="text-left">Item</TableHead>
									<TableHead className="text-center">Quantity</TableHead>
									<TableHead className="text-right">Price</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{cart.items.map((item) => (
									<TableRow key={item.slug}>
										<TableCell>
											<Link
												href={`/product/${item.slug}`}
												className="flex items-center"
											>
												<Image
													src={item.image}
													alt={item.name}
													width={50}
													height={50}
												/>
												<span className="px-2">{item.name}</span>
											</Link>
										</TableCell>
										<TableCell className="flex-center gap-2">
											<RemoveButton item={item} />
											<span>{item.qty}</span>
											<AddButton item={item} />
										</TableCell>
										<TableCell className="text-right">${item.price}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</div>
			)}
		</>
	);
}
