/*
  Warnings:

  - The `quantity` column on the `RecipeIngredient` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[user_id,recipe_id]` on the table `Rating` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[recipe_id,ingredient_id]` on the table `RecipeIngredient` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "public"."Rating_recipe_id_key";

-- DropIndex
DROP INDEX "public"."Rating_user_id_key";

-- DropIndex
DROP INDEX "public"."RecipeIngredient_ingredient_id_key";

-- DropIndex
DROP INDEX "public"."RecipeIngredient_recipe_id_key";

-- AlterTable
ALTER TABLE "public"."RecipeIngredient" DROP COLUMN "quantity",
ADD COLUMN     "quantity" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Comment_recipe_id_idx" ON "public"."Comment"("recipe_id");

-- CreateIndex
CREATE INDEX "Comment_user_id_idx" ON "public"."Comment"("user_id");

-- CreateIndex
CREATE INDEX "Instruction_recipe_id_step_number_idx" ON "public"."Instruction"("recipe_id", "step_number");

-- CreateIndex
CREATE INDEX "Rating_recipe_id_idx" ON "public"."Rating"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_user_id_recipe_id_key" ON "public"."Rating"("user_id", "recipe_id");

-- CreateIndex
CREATE INDEX "RecipeIngredient_recipe_id_idx" ON "public"."RecipeIngredient"("recipe_id");

-- CreateIndex
CREATE INDEX "RecipeIngredient_ingredient_id_idx" ON "public"."RecipeIngredient"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipe_id_ingredient_id_key" ON "public"."RecipeIngredient"("recipe_id", "ingredient_id");
