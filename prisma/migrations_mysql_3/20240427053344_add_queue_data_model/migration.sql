-- CreateTable
CREATE TABLE `QueueDataModel` (
    `id` BIGINT NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `value` JSON NULL,
    `status` TINYINT NOT NULL DEFAULT 0,
    `valueType` VARCHAR(12) NOT NULL DEFAULT 'string',
    `queryId` INTEGER NOT NULL DEFAULT 0,
    `sourceId` INTEGER NULL,
    `sourceType` SMALLINT NOT NULL DEFAULT 0,
    `sourceInfo` VARCHAR(16) NULL,
    `updatedAt` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `QueueDataModel_name_idx`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
