-- CreateTable
CREATE TABLE `credentials` (
    `credential_id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NOT NULL,
    `provider` VARCHAR(191) NOT NULL DEFAULT 'local',
    `hashedPassword` VARCHAR(191) NULL,
    `last_login` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `credentials_user_id_provider_key`(`user_id`, `provider`),
    PRIMARY KEY (`credential_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `credentials` ADD CONSTRAINT `credentials_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
