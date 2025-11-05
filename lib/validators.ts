import { z } from 'zod'
import { formatNumberWithDecimal } from './utils'


// .refine(
//   (value) => boolean,  // funkcja walidująca - true = OK, false = błąd
//   'komunikat błędu'    // opcjonalny komunikat przy błędzie walidacji
// )

const currency = z.string().refine((value) => /^\d+(\.\d{2})?$/.test(formatNumberWithDecimal(Number(value))), 'Price must be a valid number with up to 2 decimal places')


// Schema for inserting products 
export const insertProductSchema = z.object({
  name: z.string().min(3, "Product name must be at least 3 characters long"),
  slug: z.string().min(3, "Product slug must be at least 3 characters long"),
  categorY: z.string().min(3, "Category must be at least 3 characters long"),
  brand: z.string().min(2, "Brand must be at least 2 characters long"),
  description: z.string().min(10, "Description must be at least 10 characters long"),
  stock: z.coerce.number(),
  images: z.array(z.string()).min(1, 'At least one image is required'),
  isFeatured: z.boolean().optional(),
  banner: z.string().optional().nullable(),
  price: currency
})  