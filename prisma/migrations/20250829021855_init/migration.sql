/*
  Warnings:

  - You are about to drop the column `category` on the `Ingredient` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Ingredient" DROP COLUMN "category";

-- AlterTable
ALTER TABLE "public"."Recipe" ADD COLUMN     "category" TEXT;
