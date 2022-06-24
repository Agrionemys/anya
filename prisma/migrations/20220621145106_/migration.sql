/*
  Warnings:

  - You are about to alter the column `Price` on the `Tovar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(5,2)` to `MediumInt`.

*/
-- AlterTable
ALTER TABLE `Tovar` MODIFY `Price` MEDIUMINT NOT NULL;
