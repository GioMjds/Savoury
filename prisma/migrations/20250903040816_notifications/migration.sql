-- CreateEnum
CREATE TYPE "public"."NotificationType" AS ENUM ('like', 'comment', 'bookmark');

-- CreateTable
CREATE TABLE "public"."Notification" (
    "notification_id" SERIAL NOT NULL,
    "recipient_id" INTEGER NOT NULL,
    "sender_id" INTEGER NOT NULL,
    "recipe_id" INTEGER,
    "type" "public"."NotificationType" NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("notification_id")
);

-- CreateIndex
CREATE INDEX "Notification_recipient_id_idx" ON "public"."Notification"("recipient_id");

-- CreateIndex
CREATE INDEX "Notification_sender_id_idx" ON "public"."Notification"("sender_id");

-- CreateIndex
CREATE INDEX "Notification_recipe_id_idx" ON "public"."Notification"("recipe_id");

-- CreateIndex
CREATE INDEX "Notification_created_at_idx" ON "public"."Notification"("created_at");

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipient_id_fkey" FOREIGN KEY ("recipient_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "public"."Users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_recipe_id_fkey" FOREIGN KEY ("recipe_id") REFERENCES "public"."Recipe"("recipe_id") ON DELETE CASCADE ON UPDATE CASCADE;
