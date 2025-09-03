-- CreateTable
CREATE TABLE "public"."UserLike" (
    "user_like_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserLike_pkey" PRIMARY KEY ("user_like_id")
);

-- CreateIndex
CREATE INDEX "UserLike_user_id_idx" ON "public"."UserLike"("user_id");

-- CreateIndex
CREATE INDEX "UserLike_recipe_id_idx" ON "public"."UserLike"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "UserLike_user_id_recipe_id_key" ON "public"."UserLike"("user_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "public"."UserLike" ADD CONSTRAINT "UserLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."UserLike" ADD CONSTRAINT "UserLike_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
