/*
  Warnings:

  - The `category` column on the `Recipe` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."FoodCategories" AS ENUM ('breakfast', 'lunch', 'dinner', 'dessert', 'appetizer', 'snack', 'soup', 'beverage', 'salad', 'side_dish');

-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "category",
ADD COLUMN     "category" "public"."FoodCategories";
