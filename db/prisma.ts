import { PrismaClient } from "@/lib/generated/prisma/client";
import { neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";

import ws from "ws";
 
// Sets up WebSocket connections, which enables Neon to use WebSocket communication.
neonConfig.webSocketConstructor = ws;
const connectionString = `${process.env.DATABASE_URL}`;
 
// Instantiates the Prisma adapter using the Neon connection pool to handle the connection between Prisma and Neon.
const adapter = new PrismaNeon({ connectionString });
 
// Extends the PrismaClient with a custom result transformer to convert the price and rating fields to strings.

// NOTE: metoda $extends() z opcją result, pozwala transformować dane zwracane z bazy przed ich użyciem w aplikacji.
export const prisma = new PrismaClient({ adapter }).$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
    cart:{
      itemsPrice:{
        needs: {itemsPrice: true},// "Hej Prisma, MUSISZ pobrać to pole!" "needs" Potrzebne gdy pole jest w relacji lub jest opcjonalne!
        compute(cart){
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice:{
        needs: {shippingPrice: true},
        compute(cart){
          return cart.shippingPrice.toString()
        }
      },
      taxPrice:{
        needs: {taxPrice: true},
        compute(cart){
          return cart.taxPrice.toString()
        }
      },
      totalPrice:{
        needs: {totalPrice: true},
        compute(cart){
          return cart.totalPrice.toString()
        }
      }
    },
    order:{
      itemsPrice:{
        needs: {itemsPrice: true},
        compute(cart){
          return cart.itemsPrice.toString()
        }
      },
      shippingPrice:{
        needs: {shippingPrice: true},
        compute(cart){
          return cart.shippingPrice.toString()
        }
      },
      taxPrice:{
        needs: {taxPrice: true},
        compute(cart){
          return cart.taxPrice.toString()
        }
      },
      totalPrice:{
        needs: {totalPrice: true},
        compute(cart){
          return cart.totalPrice.toString()
        }
      }
    },
    orderItem:{
      price: {
        compute(cart){
          return cart.price.toString();
        }
      }
    }
  },
});