export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Bakery Store";
export const APP_DESCRIPTION = process.env.NEXT_PUBLIC_APP_DESC ||  "A modern ecomerce platform for bakery products.";
export const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL ||
"http://localhost:3000"

export const LATEST_PRODUCTS_LIMIT = Number(process.env.LATEST_PRODUCTS_LIMIT) || 4;

export const signInDefaultValues = {
  email: "admin@example.com",
  password: "123456",
};


export const signUpDefaultValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export const shippingAddressDefaultValues = {
  fullName: "John Doe",
  streetAddress: "123 Baker St",
  city: "Anytown",
  postalCode: "12345",
  country: "USA",
};