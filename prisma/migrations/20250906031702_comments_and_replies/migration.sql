-- AlterTable
ALTER TABLE "public"."Comment" ADD COLUMN     "comment_likes" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "parent_comment_id" INTEGER;

-- CreateTable
CREATE TABLE "public"."CommentLike" (
    "comment_like_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "comment_id" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CommentLike_pkey" PRIMARY KEY ("comment_like_id")
);

-- CreateIndex
CREATE INDEX "CommentLike_user_id_idx" ON "public"."CommentLike"("user_id");

-- CreateIndex
CREATE INDEX "CommentLike_comment_id_idx" ON "public"."CommentLike"("comment_id");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_user_id_comment_id_key" ON "public"."CommentLike"("user_id", "comment_id");

-- CreateIndex
CREATE INDEX "Comment_parent_comment_id_idx" ON "public"."Comment"("parent_comment_id");

-- CreateIndex
CREATE INDEX "Comment_created_at_idx" ON "public"."Comment"("created_at");

-- AddForeignKey
ALTER TABLE "public"."Comment" ADD CONSTRAINT "Comment_parent_comment_id_fkey" FOREIGN KEY ("parent_comment_id") REFERENCES "public"."Comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."CommentLike" ADD CONSTRAINT "CommentLike_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "public"."Comment"("comment_id") ON DELETE CASCADE ON UPDATE CASCADE;
