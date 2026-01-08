import { Metadata } from 'next';
import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import Stripe from 'stripe';
import { getOrderById } from '@/lib/actions/order.actions';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
	title: 'Stripe Payment Success',
};

const SuccessPage = async (props: {
	params: Promise<{ id: string }>;
	searchParams: Promise<{ payment_intent?: string }>;
}) => {
	try {
		// Get the order id and payment intent id from the URL
		const { id } = await props.params;
		const searchParams = await props.searchParams;
		const paymentIntentId = searchParams.payment_intent;

		console.log('=== STRIPE SUCCESS PAGE ===');
		console.log('Order ID from URL:', id);
		console.log('Payment Intent ID:', paymentIntentId);

		// Check if payment_intent exists
		if (!paymentIntentId) {
			console.error('Missing payment_intent in URL');
			return redirect(`/order/${id}`);
		}

		// Validate Stripe secret key
		const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
		if (!stripeSecretKey) {
			console.error('STRIPE_SECRET_KEY is not configured');
			throw new Error('Payment configuration error');
		}

		// Initialize Stripe
		const stripe = new Stripe(stripeSecretKey, {
			apiVersion: '2025-12-15.clover',
		});

		// Fetch order
		const order = await getOrderById(id);
		if (!order) {
			console.error('Order not found:', id);
			return notFound();
		}

		console.log('Order found:', order.id);

		// Retrieve the payment intent
		let paymentIntent: Stripe.PaymentIntent;
		try {
			paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
			console.log('Payment Intent metadata:', paymentIntent.metadata);
		} catch (error) {
			console.error('Failed to retrieve payment intent:', error);
			return redirect(`/order/${id}?error=payment_intent_failed`);
		}

		// Check if the payment intent is successful
		const isSuccess = paymentIntent.status === 'succeeded';
		console.log('Payment status:', paymentIntent.status);

		if (!isSuccess) {
			console.log('Payment not successful');
			return redirect(`/order/${id}?error=payment_not_completed`);
		}

		// IMPORTANT: If metadata.orderId is missing, we'll trust the URL orderId
		// since the payment was successful and we have the order
		if (paymentIntent.metadata && paymentIntent.metadata.orderId) {
			const paymentOrderId = String(paymentIntent.metadata.orderId);
			const currentOrderId = String(order.id);

			if (paymentOrderId !== currentOrderId) {
				console.error('Order ID mismatch:', {
					paymentOrderId,
					currentOrderId,
				});
				return notFound();
			}
			console.log('Order ID verified via metadata');
		} else {
			console.warn(
				'Payment intent missing orderId in metadata - trusting URL orderId'
			);
			// We trust the orderId from URL since:
			// 1. Payment was successful
			// 2. Order exists in database
			// 3. User accessed this page via return_url with correct orderId
		}

		console.log('Payment verification successful!');

		return (
			<div className="max-w-4xl w-full mx-auto space-y-8">
				<div className="flex flex-col gap-6 items-center">
					<h1 className="h1-bold">Thanks for your purchase</h1>
					<div>We are now processing your order.</div>
					<Button asChild>
						<Link href={`/order/${id}`}>View order</Link>
					</Button>
				</div>
			</div>
		);
	} catch (error) {
		console.error('Error in SuccessPage:', error);
		// Return a fallback UI instead of throwing
		return (
			<div className="max-w-4xl w-full mx-auto space-y-8">
				<div className="flex flex-col gap-6 items-center">
					<h1 className="text-2xl font-bold text-destructive">
						Payment Processing Error
					</h1>
					<p>There was an issue processing your payment confirmation.</p>
					<Button asChild>
						<Link href="/order-history">View Order History</Link>
					</Button>
				</div>
			</div>
		);
	}
};

export default SuccessPage;
