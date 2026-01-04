const StripePayment = ({
	priceInCents,
	orderId,
	clientSecret,
}: {
	priceInCents: number;
	orderId: string;
	clientSecret: string;
}) => {
	return <>Stripe form</>;
};

export default StripePayment;
