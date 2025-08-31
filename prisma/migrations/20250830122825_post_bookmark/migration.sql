-- CreateTable
CREATE TABLE "public"."Bookmark" (
    "bookmark_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "recipe_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Bookmark_pkey" PRIMARY KEY ("bookmark_id")
);

-- CreateIndex
CREATE INDEX "Bookmark_user_id_idx" ON "public"."Bookmark"("user_id");

-- CreateIndex
CREATE INDEX "Bookmark_recipe_id_idx" ON "public"."Bookmark"("recipe_id");

-- CreateIndex
CREATE UNIQUE INDEX "Bookmark_user_id_recipe_id_key" ON "public"."Bookmark"("user_id", "recipe_id");

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Bookmark" ADD CONSTRAINT "Bookmark_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
