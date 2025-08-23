-- CreateTable
CREATE TABLE "public"."Users" (
    "user_id" SERIAL NOT NULL,
    "username" VARCHAR(25) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "fullname" VARCHAR(50) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "profile_image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "public"."Recipe" (
    "recipe_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "image_url" TEXT,
    "prep_time_minutes" INTEGER,
    "cook_time_minutes" INTEGER,
    "servings" INTEGER,
    "average_rating" DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("recipe_id")
);

-- CreateTable
CREATE TABLE "public"."Ingredient" (
    "ingredient_id" SERIAL NOT NULL,
    "ingredient_name" VARCHAR(100) NOT NULL,
    "category" TEXT,

    CONSTRAINT "Ingredient_pkey" PRIMARY KEY ("ingredient_id")
);

-- CreateTable
CREATE TABLE "public"."RecipeIngredient" (
    "recipe_ingredient_id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "ingredient_id" INTEGER NOT NULL,
    "quantity" TEXT NOT NULL,
    "unit" TEXT,

    CONSTRAINT "RecipeIngredient_pkey" PRIMARY KEY ("recipe_ingredient_id")
);

-- CreateTable
CREATE TABLE "public"."Instruction" (
    "instruction_id" SERIAL NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "step_number" INTEGER NOT NULL,
    "step_text" TEXT NOT NULL,

    CONSTRAINT "Instruction_pkey" PRIMARY KEY ("instruction_id")
);

-- CreateTable
CREATE TABLE "public"."Comment" (
    "comment_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "comment_text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "public"."Rating" (
    "rating_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("rating_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "public"."Users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "public"."Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_fullname_key" ON "public"."Users"("fullname");

-- CreateIndex
CREATE UNIQUE INDEX "Ingredient_ingredient_name_key" ON "public"."Ingredient"("ingredient_name");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_recipe_id_key" ON "public"."RecipeIngredient"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeIngredient_ingredient_id_key" ON "public"."RecipeIngredient"("ingredient_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_user_id_key" ON "public"."Rating"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "Rating_recipe_id_key" ON "public"."Rating"("recipe_id");

-- AddForeignKey
ALTER TABLE "public"."Recipe" ADD CONSTRAINT "Recipe_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."RecipeIngredient" ADD CONSTRAINT "RecipeIngredient_ingredient_id_fkey" FOREIGN KEY ("ingredient_id") REFERENCES "public"."Ingredient"("ingredient_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Instruction" ADD CONSTRAINT "Instruction_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Rating" ADD CONSTRAINT "Rating_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
