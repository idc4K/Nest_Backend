/*
  Warnings:

  - The primary key for the `BookmarkedProducts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Cart` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Palette` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `paletteNumber` on the `Palette` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `paletteLimit` on the `Palette` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `ProductRow` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `numberOfPackage` on the `ProductRow` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the column `accessToken` on the `RefreshToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartId_fkey";

-- DropForeignKey
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_cartId_fkey";

-- DropForeignKey
ALTER TABLE "ProductRow" DROP CONSTRAINT "ProductRow_paletteId_fkey";

-- AlterTable
ALTER TABLE "BookmarkedProducts" DROP CONSTRAINT "BookmarkedProducts_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "BookmarkedProducts_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "BookmarkedProducts_id_seq";

-- AlterTable
ALTER TABLE "Cart" DROP CONSTRAINT "Cart_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "initialTotalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "francoTotalPrice" SET DATA TYPE DOUBLE PRECISION,
ADD CONSTRAINT "Cart_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Cart_id_seq";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "cartId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Order_id_seq";

-- AlterTable
ALTER TABLE "Palette" DROP CONSTRAINT "Palette_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "paletteNumber" SET DATA TYPE INTEGER,
ALTER COLUMN "paletteLimit" SET DATA TYPE INTEGER,
ALTER COLUMN "totalPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "cartId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Palette_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Palette_id_seq";

-- AlterTable
ALTER TABLE "ProductRow" DROP CONSTRAINT "ProductRow_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "numberOfPackage" SET DATA TYPE INTEGER,
ALTER COLUMN "weight" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "initialPrice" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "paletteId" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductRow_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductRow_id_seq";

-- AlterTable
ALTER TABLE "RefreshToken" DROP COLUMN "accessToken";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Palette" ADD CONSTRAINT "Palette_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductRow" ADD CONSTRAINT "ProductRow_paletteId_fkey" FOREIGN KEY ("paletteId") REFERENCES "Palette"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
