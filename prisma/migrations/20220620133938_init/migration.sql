-- CreateTable
CREATE TABLE `Zakaz` (
    `id_Zakaza` INTEGER NOT NULL AUTO_INCREMENT,
    `Barcode` INTEGER NOT NULL,
    `id_Pokypatel` INTEGER NOT NULL,
    `id_Rabotnika` INTEGER NOT NULL,
    `id_Dostavki` INTEGER NOT NULL,
    `id_Status_Dostavki` INTEGER NOT NULL,
    `Data_Dostavki` DATETIME(3) NOT NULL,
    `Srok_Xranenia` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_Zakaza`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Dostavka` (
    `id_Dostavki` INTEGER NOT NULL AUTO_INCREMENT,
    `Naimenovanie` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_Dostavki`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Status_Dostavki` (
    `id_Status_Dostavki` INTEGER NOT NULL AUTO_INCREMENT,
    `Naimenovanie` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_Status_Dostavki`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Pokupateli` (
    `id_Pokypatel` INTEGER NOT NULL AUTO_INCREMENT,
    `Familia` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Otchestvo` VARCHAR(191) NOT NULL,
    `Telephone` VARCHAR(191) NOT NULL,
    `Adress` VARCHAR(191) NOT NULL,
    `Mail` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_Pokypatel`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Rabotniki` (
    `id_Rabotnika` INTEGER NOT NULL AUTO_INCREMENT,
    `Familia` VARCHAR(191) NOT NULL,
    `Name` VARCHAR(191) NOT NULL,
    `Otchestvo` VARCHAR(191) NOT NULL,
    `Dolgnost` VARCHAR(191) NOT NULL,
    `Login` VARCHAR(191) NOT NULL,
    `Parol` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_Rabotnika`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Postavchik` (
    `id_Postavchika` INTEGER NOT NULL AUTO_INCREMENT,
    `Naimenovanie` VARCHAR(191) NOT NULL,
    `Pravovai_otvetstvenost` VARCHAR(191) NOT NULL,
    `INN` INTEGER NOT NULL,

    PRIMARY KEY (`id_Postavchika`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tovar` (
    `Barcode` INTEGER NOT NULL AUTO_INCREMENT,
    `Naimenovanie` VARCHAR(191) NOT NULL,
    `Artikyl` VARCHAR(191) NOT NULL,
    `Marka_Tovara` VARCHAR(191) NOT NULL,
    `Data_postuplenia_na_sklad` DATETIME(3) NOT NULL,
    `Price` DECIMAL(65, 30) NOT NULL,
    `id_Postavchika` INTEGER NOT NULL,
    `id_Rabotnika` INTEGER NOT NULL,

    PRIMARY KEY (`Barcode`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Zakaz` ADD CONSTRAINT `Zakaz_id_Dostavki_fkey` FOREIGN KEY (`id_Dostavki`) REFERENCES `Dostavka`(`id_Dostavki`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zakaz` ADD CONSTRAINT `Zakaz_id_Status_Dostavki_fkey` FOREIGN KEY (`id_Status_Dostavki`) REFERENCES `Status_Dostavki`(`id_Status_Dostavki`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zakaz` ADD CONSTRAINT `Zakaz_id_Pokypatel_fkey` FOREIGN KEY (`id_Pokypatel`) REFERENCES `Pokupateli`(`id_Pokypatel`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zakaz` ADD CONSTRAINT `Zakaz_id_Rabotnika_fkey` FOREIGN KEY (`id_Rabotnika`) REFERENCES `Rabotniki`(`id_Rabotnika`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Zakaz` ADD CONSTRAINT `Zakaz_Barcode_fkey` FOREIGN KEY (`Barcode`) REFERENCES `Tovar`(`Barcode`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tovar` ADD CONSTRAINT `Tovar_id_Rabotnika_fkey` FOREIGN KEY (`id_Rabotnika`) REFERENCES `Rabotniki`(`id_Rabotnika`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Tovar` ADD CONSTRAINT `Tovar_id_Postavchika_fkey` FOREIGN KEY (`id_Postavchika`) REFERENCES `Postavchik`(`id_Postavchika`) ON DELETE RESTRICT ON UPDATE CASCADE;
