"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { CartItem } from "@/types";
import { addItemToCart } from "@/lib/actions/cart.actions";
import { toast } from "sonner";

const AddToCart = ({ item }: { item: CartItem }) => {
	const router = useRouter();

	const handleAddToCart = async () => {
		const res = await addItemToCart(item);
		console.log("🚀 ~ handleAddToCart ~ res:", res.message);

		if (!res.success) {
			toast.error(res.message, {
				unstyled: true,
				classNames: {
					toast: "bg-red-50 border-red-200 text-red-900",
					title: "text-red-900 font-semibold",
					description: "text-red-700",
					actionButton: "bg-red-600 text-white hover:bg-red-700",
				},
			});
			return;
		}

		toast.success(res.message, {
			// description: res.message,
			unstyled: false, // to keep user styles change to true
			classNames: {
				toast:
					"flex items-center gap-3 rounded-md border shadow-md px-4 py-3 bg-green-50 border-green-200 text-green-900",
				icon: "text-green-600",
				title: "font-medium text-green-900 flex-1",
				description: "text-green-700",
				actionButton:
					"ml-auto text-sm font-medium  text-green-700 hover:text-white-900  bg-primary text-primary-foreground inline-flex justify-center gap-2 rounded-md text-sm font-medium ",
			},
			action: {
				label: "Go to Cart",
				onClick: () => router.push("/cart"),
			},
		});
	};

	return (
		<Button className="w-full" type="button" onClick={handleAddToCart}>
			<Plus className="mr-2 h-4 w-4" />
			Add To Cart
		</Button>
	);
};

export default AddToCart;
