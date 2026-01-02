'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Loader, Minus, Plus } from 'lucide-react';
import { Cart, CartItem } from '@/types';
import { addItemToCart, removeItemFromCart } from '@/lib/actions/cart.actions';
import { toast } from 'sonner';
import { useTransition } from 'react';

const AddToCart = ({ cart, item }: { cart?: Cart; item: CartItem }) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	const handleAddToCart = async () => {
		startTransition(async () => {
			const res = await addItemToCart(item);
			// console.log('🚀 ~ handleAddToCart ~ res:', res.message);

			if (!res.success) {
				toast.error(res.message, {
					unstyled: true,
					classNames: {
						toast: 'bg-red-50 border-red-200 text-red-900',
						title: 'text-red-900 font-semibold',
						description: 'text-red-700',
						actionButton: 'bg-red-600 text-white hover:bg-red-700',
					},
				});
				return;
			}

			toast.success(res.message, {
				// description: res.message,
				unstyled: false, // to keep user styles change to true
				classNames: {
					toast:
						'flex items-center gap-3 rounded-md border shadow-md px-4 py-3 bg-green-50 border-green-200 text-green-900',
					icon: 'text-green-600',
					title: 'font-medium text-green-900 flex-1',
					description: 'text-green-700',
					actionButton:
						'ml-auto text-sm font-medium  text-green-700 hover:text-white-900  bg-primary text-primary-foreground inline-flex justify-center gap-2 rounded-md text-sm font-medium ',
				},
				action: {
					label: 'Go to Cart',
					onClick: () => router.push('/cart'),
				},
			});
		});
	};

	// Check if item is already in cart
	const existItem =
		cart && cart.items.find((x) => x.productId === item.productId);

	const handleRemoveFromCart = async () => {
		startTransition(async () => {
			const res = await removeItemFromCart(item.productId);
			console.log('🚀 ~ handleRemoveFromCart ~ res:', res.message);

			if (!res.success) {
				toast.error(res.message);
				return;
			}
			toast.success(res.message);

			return;
		});
	};
	return existItem ? (
		<div className="flex items-center">
			<Button type="button" variant="outline" onClick={handleRemoveFromCart}>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Minus className="h-4 w-4" />
				)}
			</Button>
			<span className="px-2">{existItem.qty}</span>
			<Button type="button" variant="outline" onClick={handleAddToCart}>
				{isPending ? (
					<Loader className="w-4 h-4 animate-spin" />
				) : (
					<Plus className="h-4 w-4" />
				)}
			</Button>
		</div>
	) : (
		<Button className="w-full" type="button" onClick={handleAddToCart}>
			{isPending ? (
				<Loader className="w-4 h-4 animate-spin" />
			) : (
				<Plus className="h-4 w-4" />
			)}
			Add To Cart
		</Button>
	);
};

export default AddToCart;
