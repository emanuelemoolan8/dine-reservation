/*
  Warnings:

  - A unique constraint covering the columns `[tableNumber,reservationTime]` on the table `Reservation` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Reservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Reservation" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Reservation_tableNumber_reservationTime_key" ON "Reservation"("tableNumber", "reservationTime");
