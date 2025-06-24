/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `customer` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `Order` table. All the data in the column will be lost.
  - Added the required column `customer_id` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_price` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "customer",
DROP COLUMN "id",
DROP COLUMN "total",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" TEXT NOT NULL,
ADD COLUMN     "order_id" SERIAL NOT NULL,
ADD COLUMN     "total_price" DOUBLE PRECISION NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("order_id");
