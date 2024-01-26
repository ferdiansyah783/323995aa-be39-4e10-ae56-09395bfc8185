/*
  Warnings:

  - Changed the type of `refresh_token` on the `Session` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Session" DROP COLUMN "refresh_token",
ADD COLUMN     "refresh_token" UUID NOT NULL;
