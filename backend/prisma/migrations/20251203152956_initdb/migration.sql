-- CreateEnum
CREATE TYPE "tour_status" AS ENUM ('ACTIVE', 'INACTIVE');

-- CreateEnum
CREATE TYPE "booking_status" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "booking_payment_status" AS ENUM ('UNPAID', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "payment_tx_status" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- CreateEnum
CREATE TYPE "review_status" AS ENUM ('VISIBLE', 'HIDDEN');

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE VARCHAR(255);

-- CreateTable
CREATE TABLE "tour_categories" (
    "category_id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,

    CONSTRAINT "tour_categories_pkey" PRIMARY KEY ("category_id")
);

-- CreateTable
CREATE TABLE "tours" (
    "tour_id" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "category_id" INTEGER,
    "location" VARCHAR(255) NOT NULL,
    "duration_days" INTEGER NOT NULL,
    "price" DECIMAL(12,2) NOT NULL,
    "cover_image" TEXT,
    "basic_info" JSONB,
    "highlight_info" JSONB,
    "rating_avg" DECIMAL(3,2) NOT NULL DEFAULT 0,
    "rating_count" INTEGER NOT NULL DEFAULT 0,
    "status" "tour_status" NOT NULL DEFAULT 'ACTIVE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_pkey" PRIMARY KEY ("tour_id")
);

-- CreateTable
CREATE TABLE "tour_images" (
    "image_id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "image_url" TEXT NOT NULL,
    "is_cover" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tour_images_pkey" PRIMARY KEY ("image_id")
);

-- CreateTable
CREATE TABLE "tour_schedules" (
    "schedule_id" SERIAL NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "day_number" INTEGER NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "image" TEXT,

    CONSTRAINT "tour_schedules_pkey" PRIMARY KEY ("schedule_id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "booking_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "adults" INTEGER NOT NULL,
    "children" INTEGER NOT NULL DEFAULT 0,
    "total_price" DECIMAL(12,2) NOT NULL,
    "status" "booking_status" NOT NULL DEFAULT 'PENDING',
    "payment_status" "booking_payment_status" NOT NULL DEFAULT 'UNPAID',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payment_id" SERIAL NOT NULL,
    "booking_id" INTEGER NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "method" VARCHAR(50) NOT NULL,
    "transaction_id" VARCHAR(255),
    "status" "payment_tx_status" NOT NULL DEFAULT 'PENDING',
    "paid_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payment_id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "review_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "tour_id" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "status" "review_status" NOT NULL DEFAULT 'VISIBLE',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("review_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tour_categories_name_key" ON "tour_categories"("name");

-- CreateIndex
CREATE INDEX "tours_category_id_idx" ON "tours"("category_id");

-- CreateIndex
CREATE INDEX "tour_images_tour_id_idx" ON "tour_images"("tour_id");

-- CreateIndex
CREATE INDEX "tour_schedules_tour_id_idx" ON "tour_schedules"("tour_id");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE INDEX "bookings_tour_id_idx" ON "bookings"("tour_id");

-- CreateIndex
CREATE INDEX "payments_booking_id_idx" ON "payments"("booking_id");

-- CreateIndex
CREATE INDEX "reviews_tour_id_idx" ON "reviews"("tour_id");

-- CreateIndex
CREATE UNIQUE INDEX "reviews_user_id_tour_id_key" ON "reviews"("user_id", "tour_id");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "refresh_tokens"("user_id");

-- AddForeignKey
ALTER TABLE "tours" ADD CONSTRAINT "tours_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "tour_categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_images" ADD CONSTRAINT "tour_images_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tour_schedules" ADD CONSTRAINT "tour_schedules_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("booking_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_tour_id_fkey" FOREIGN KEY ("tour_id") REFERENCES "tours"("tour_id") ON DELETE CASCADE ON UPDATE CASCADE;
