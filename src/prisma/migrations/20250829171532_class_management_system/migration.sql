/*
  Warnings:

  - You are about to drop the `class_session` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `class_template` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `class_session` DROP FOREIGN KEY `class_session_center_id_fkey`;

-- DropForeignKey
ALTER TABLE `class_session` DROP FOREIGN KEY `class_session_template_id_fkey`;

-- DropForeignKey
ALTER TABLE `class_template` DROP FOREIGN KEY `class_template_center_id_fkey`;

-- DropTable
DROP TABLE `class_session`;

-- DropTable
DROP TABLE `class_template`;

-- CreateTable
CREATE TABLE `ClassTemplate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `centerId` INTEGER NOT NULL,
    `capacity` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RecurrenceRule` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateId` INTEGER NOT NULL,
    `centerId` INTEGER NOT NULL,
    `daysOfWeek` JSON NOT NULL,
    `recurrenceStart` DATETIME(3) NOT NULL,
    `recurrenceEnd` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,

    UNIQUE INDEX `RecurrenceRule_templateId_startTime_key`(`templateId`, `startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClassSession` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `templateId` INTEGER NOT NULL,
    `recurrenceId` INTEGER NULL,
    `centerId` INTEGER NOT NULL,
    `sessionDate` DATETIME(3) NOT NULL,
    `startTime` DATETIME(3) NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',

    UNIQUE INDEX `ClassSession_templateId_startTime_key`(`templateId`, `startTime`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ClassTemplate` ADD CONSTRAINT `ClassTemplate_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `gym_center`(`center_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurrenceRule` ADD CONSTRAINT `RecurrenceRule_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `ClassTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RecurrenceRule` ADD CONSTRAINT `RecurrenceRule_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `gym_center`(`center_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSession` ADD CONSTRAINT `ClassSession_templateId_fkey` FOREIGN KEY (`templateId`) REFERENCES `ClassTemplate`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSession` ADD CONSTRAINT `ClassSession_recurrenceId_fkey` FOREIGN KEY (`recurrenceId`) REFERENCES `RecurrenceRule`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClassSession` ADD CONSTRAINT `ClassSession_centerId_fkey` FOREIGN KEY (`centerId`) REFERENCES `gym_center`(`center_id`) ON DELETE CASCADE ON UPDATE CASCADE;
