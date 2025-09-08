/*
  Warnings:

  - You are about to drop the column `cook_time_minutes` on the `Recipe` table. All the data in the column will be lost.
  - You are about to drop the column `prep_time_minutes` on the `Recipe` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "public"."TimeUnit" AS ENUM ('minutes', 'hours', 'days');

-- AlterTable
ALTER TABLE "public"."Recipe" DROP COLUMN "cook_time_minutes",
DROP COLUMN "prep_time_minutes",
ADD COLUMN     "cook_time_unit" "public"."TimeUnit",
ADD COLUMN     "cook_time_value" INTEGER,
ADD COLUMN     "prep_time_unit" "public"."TimeUnit",
ADD COLUMN     "prep_time_value" INTEGER;
