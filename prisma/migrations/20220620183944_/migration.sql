/*
  Warnings:

  - You are about to alter the column `Naimenovanie` on the `Dostavka` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Familia` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Otchestvo` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Telephone` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(11)`.
  - You are about to alter the column `Adress` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Mail` on the `Pokupateli` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Naimenovanie` on the `Postavchik` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Pravovai_otvetstvenost` on the `Postavchik` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `Familia` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Name` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Otchestvo` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Dolgnost` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to alter the column `Login` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `Parol` on the `Rabotniki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(25)`.
  - You are about to alter the column `Naimenovanie` on the `Status_Dostavki` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Naimenovanie` on the `Tovar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Artikyl` on the `Tovar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(10)`.
  - You are about to alter the column `Marka_Tovara` on the `Tovar` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - You are about to alter the column `Price` on the `Tovar` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `Decimal(5,2)`.

*/
-- AlterTable
ALTER TABLE `Dostavka` MODIFY `Naimenovanie` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Pokupateli` MODIFY `Familia` VARCHAR(50) NOT NULL,
    MODIFY `Name` VARCHAR(50) NOT NULL,
    MODIFY `Otchestvo` VARCHAR(50) NOT NULL,
    MODIFY `Telephone` VARCHAR(11) NOT NULL,
    MODIFY `Adress` VARCHAR(50) NOT NULL,
    MODIFY `Mail` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Postavchik` MODIFY `Naimenovanie` VARCHAR(50) NOT NULL,
    MODIFY `Pravovai_otvetstvenost` VARCHAR(10) NOT NULL;

-- AlterTable
ALTER TABLE `Rabotniki` MODIFY `Familia` VARCHAR(50) NOT NULL,
    MODIFY `Name` VARCHAR(50) NOT NULL,
    MODIFY `Otchestvo` VARCHAR(50) NOT NULL,
    MODIFY `Dolgnost` VARCHAR(30) NOT NULL,
    MODIFY `Login` VARCHAR(25) NOT NULL,
    MODIFY `Parol` VARCHAR(25) NOT NULL;

-- AlterTable
ALTER TABLE `Status_Dostavki` MODIFY `Naimenovanie` VARCHAR(50) NOT NULL;

-- AlterTable
ALTER TABLE `Tovar` MODIFY `Naimenovanie` VARCHAR(50) NOT NULL,
    MODIFY `Artikyl` VARCHAR(10) NOT NULL,
    MODIFY `Marka_Tovara` VARCHAR(50) NOT NULL,
    MODIFY `Data_postuplenia_na_sklad` DATE NOT NULL,
    MODIFY `Price` DECIMAL(5, 2) NOT NULL;

-- AlterTable
ALTER TABLE `Zakaz` MODIFY `Data_Dostavki` DATE NOT NULL;
