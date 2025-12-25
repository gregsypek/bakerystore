
import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'
import { PAYMENT_METHODS } from './constants';


// .refine(
//   (value) => boolean,  // funkcja walidująca - true = OK, false = błąd
//   'komunikat błędu'    // opcjonalny komunikat przy błędzie walidacji
// )

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Price must be a valid number with up to 2 decimal places')


// Schema for inserting products 
export const insertProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Product slug must be at least 3 characters long"),
  category: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(2, "Brand must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  stock: z.coerce.number().int().min(0, "Stock cannot be negative"),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional().nullable(),
  price: currency,
  // rating: z.string().optional(), // Add if needed
  // numReviews: z.string().optional(), // Add if needed
})  

// Schema for updating products
export const updateProductSchema = insertProductSchema.extend({
  id: z.string().min(1, "Product ID is required")
})

// Schema for signing users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long")
})

// Schema for signing users up
export const signUpFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
  confirmPassword: z.string().min(6, "Confirm password must be at least 6 characters long")
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

// Cart Schemas 
export const cartItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  name: z.string().min(1, "Product name must be at least 1 characters long"),
  slug: z.string().min(1, "Product slug must be at least 1 characters long"),
  qty: z.number().int().nonnegative("Quantity must be a non-negative integer"),
  image: z.string().min(1, "Product image is required"),
  price: currency
})

export const insertCartSchema = z.object({
  items: z.array(cartItemSchema),
  itemsPrice: currency,
  totalPrice: currency,
  shippingPrice: currency,
  taxPrice: currency,
  sessionCartId: z.string().min(1, "Session cart ID is required"),
  userId: z.string().optional().nullable() // In summary, the userId in the insertCartSchema is essential for linking a user to their cart in the database, ensuring that their cart items can be easily retrieved upon their next login
})

// Schema for the shipping address
export const shippingAddressSchema = z.object({
  fullName: z.string().min(3, "Full name must be at least 3 characters long"),
  streetAddress: z.string().min(5, "Address must be at least 5 characters long"),
  city: z.string().min(2, "City must be at least 2 characters long"),
  postalCode: z.string().min(2, "Postal code must be at least 2 characters long"),
  country: z.string().min(2, "Country must be at least 2 characters long"),
lat: z.number().optional(),
lng: z.number().optional(),
})

// Schema for payment method
export const paymentMethodSchema = z.object({
 type:z.string().min(1, "Payment method type is required"),
  })
  //refine to custom walidacja - dodajesz własną logikę sprawdzania:
  // path: ['type'] Wskazuje że błąd dotyczy pola type
  .refine((data)=>PAYMENT_METHODS.includes(data.type), {path: ['type'], message: 'Invalid payment method'})


  // Schema for inserting order
  export const insertOrderSchema = z.object({
    userId:z.string().min(1, 'User is required'),
    itemsPrice: currency,
    shippingPrice: currency,
    taxPrice: currency,
    totalPrice:currency,
    paymentMethod:z.string().refine((data)=>PAYMENT_METHODS.includes(data), {
      message: 'Invalid payment method'
    }),
    shippingAddress: shippingAddressSchema

  })

  // Schema for inserting an order item
  export const insertOrderItemSchema = z.object({
    productId: z.string(),
    slug: z.string(),
    image: z.string(),
    name: z.string(),
    price:currency,
    qty: z.number()
  })

  export const paymentResultSchema = z.object({
    id: z.string(),
    status: z.string(),
    email_address: z.string(),
    pricePaid: z.string()
  })

  // Schema for updating the user profile
  export const updateProfileSchema = z.object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().min(3,"Email must be at least 3 characters long"), 
  })