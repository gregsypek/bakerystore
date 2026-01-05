export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Bakery Store';
export const APP_DESCRIPTION =
	process.env.NEXT_PUBLIC_APP_DESC ||
	'A modern ecomerce platform for bakery products.';
export const SERVER_URL =
	process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000';

export const LATEST_PRODUCTS_LIMIT =
	Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
	email: 'admin@example.com',
	password: '123456',
};

export const signUpDefaultValues = {
	name: '',
	email: '',
	password: '',
	confirmPassword: '',
};

export const shippingAddressDefaultValues = {
	fullName: '',
	streetAddress: '',
	city: '',
	postalCode: '',
	country: '',
};

export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
	? process.env.PAYMENT_METHODS.split(',').map((method) => method.trim())
	: ['PayPal', 'Stripe', 'CashOnDelivery'];

export const DEFAULT_PAYMENT_METHOD =
	process.env.DEFAULT_PAYMENT_METHOD || 'PayPal';

export const PAGE_SIZE = Number(process.env.PAGE_SIZE) || 10;
export const CAROUSEL_SLIDE_TIME = 10000;

export const productDefaultValues = {
	name: 'Zosia',
	slug: 'zosia',
	category: 'sweets',
	images: [],
	brand: 'Plurabis',
	description: 'Zosia is sweet',
	price: '0',
	stock: 0,
	// rating:'0',
	// numReviews:'0',
	isFeatured: false,
	banner: null,
};
export const USER_ROLES = process.env.USER_ROLES
	? process.env.USER_ROLES.split(', ')
	: ['admin', 'user'];

export const reviewFormDefaultValues = {
	title: 'Review',
	comment: '',
	rating: 0,
	productId: '',
	userId: '',
};

export const SENDER_EMAIL = process.env.SENDER_EMAIL || 'onboarding@resend.dev';
