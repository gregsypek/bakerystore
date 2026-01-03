/*
  Warnings:

  - A unique constraint covering the columns `[productId,userId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "order_userId_user_id_fk";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderItems_orderId_order_id_fk";

-- DropForeignKey
ALTER TABLE "OrderItem" DROP CONSTRAINT "orderItems_productId_product_id_fk";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "session_userId_user_id_fk";

-- AlterTable
ALTER TABLE "Cart" ALTER COLUMN "itemsPrice" SET DEFAULT 0,
ALTER COLUMN "totalPrice" SET DEFAULT 0,
ALTER COLUMN "shippingPrice" SET DEFAULT 0,
ALTER COLUMN "taxPrice" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" RENAME CONSTRAINT "orderitems_orderId_productId_pk" TO "orderItem_orderId_productId_pk";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "isVerifiedPurchase" SET DEFAULT false;

-- CreateIndex
CREATE INDEX "cart_sessionCartId_idx" ON "Cart"("sessionCartId");

-- CreateIndex
CREATE INDEX "order_userId_idx" ON "Order"("userId");

-- CreateIndex
CREATE INDEX "order_isPaid_idx" ON "Order"("isPaid");

-- CreateIndex
CREATE INDEX "order_isDelivered_idx" ON "Order"("isDelivered");

-- CreateIndex
CREATE INDEX "product_category_idx" ON "Product"("category");

-- CreateIndex
CREATE INDEX "product_isFeatured_idx" ON "Product"("isFeatured");

-- CreateIndex
CREATE INDEX "review_productId_idx" ON "Review"("productId");

-- CreateIndex
CREATE INDEX "review_userId_idx" ON "Review"("userId");

-- CreateIndex
CREATE INDEX "review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE UNIQUE INDEX "review_productId_userId_unique" ON "Review"("productId", "userId");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
