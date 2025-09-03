/*
  Warnings:

  - You are about to drop the `Rating` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_recipe_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Rating" DROP CONSTRAINT "Rating_user_id_fkey";

-- DropTable
DROP TABLE "public"."Rating";
