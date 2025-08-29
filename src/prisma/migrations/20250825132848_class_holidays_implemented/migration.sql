/*
  Warnings:

  - You are about to alter the column `provider` on the `credentials` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Enum(EnumId(0))`.

*/
-- AlterTable
ALTER TABLE `credentials` MODIFY `provider` ENUM('LOCAL', 'GOOGLE', 'FACEBOOK', 'GITHUB') NOT NULL DEFAULT 'LOCAL';

-- CreateTable
CREATE TABLE `class_template` (
    `template_id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `center_id` INTEGER NOT NULL,
    `recurrence_cron` VARCHAR(191) NULL,
    `recurrence_end` DATETIME(3) NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`template_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `class_session` (
    `session_id` INTEGER NOT NULL AUTO_INCREMENT,
    `template_id` INTEGER NOT NULL,
    `center_id` INTEGER NOT NULL,
    `start_time` DATETIME(3) NOT NULL,
    `end_time` DATETIME(3) NOT NULL,
    `status` ENUM('SCHEDULED', 'CANCELLED', 'COMPLETED') NOT NULL DEFAULT 'SCHEDULED',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`session_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `center_holiday` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `center_id` INTEGER NOT NULL,
    `startDate` DATETIME(3) NOT NULL,
    `endDate` DATETIME(3) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `center_holiday_center_id_startDate_endDate_key`(`center_id`, `startDate`, `endDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `class_template` ADD CONSTRAINT `class_template_center_id_fkey` FOREIGN KEY (`center_id`) REFERENCES `gym_center`(`center_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_session` ADD CONSTRAINT `class_session_template_id_fkey` FOREIGN KEY (`template_id`) REFERENCES `class_template`(`template_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `class_session` ADD CONSTRAINT `class_session_center_id_fkey` FOREIGN KEY (`center_id`) REFERENCES `gym_center`(`center_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `center_holiday` ADD CONSTRAINT `center_holiday_center_id_fkey` FOREIGN KEY (`center_id`) REFERENCES `gym_center`(`center_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
