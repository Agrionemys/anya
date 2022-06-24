-- CreateTable
CREATE TABLE `Yacheiki` (
    `id_Sklada` INTEGER NOT NULL,
    `id_Yacheiki` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Pokupatel` INTEGER NOT NULL,
    `Barcode` INTEGER NULL,

    PRIMARY KEY (`id_Yacheiki`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Yacheiki` ADD CONSTRAINT `Yacheiki_id_Pokupatel_fkey` FOREIGN KEY (`id_Pokupatel`) REFERENCES `Pokupateli`(`id_Pokypatel`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Yacheiki` ADD CONSTRAINT `Yacheiki_Barcode_fkey` FOREIGN KEY (`Barcode`) REFERENCES `Tovar`(`Barcode`) ON DELETE SET NULL ON UPDATE CASCADE;
