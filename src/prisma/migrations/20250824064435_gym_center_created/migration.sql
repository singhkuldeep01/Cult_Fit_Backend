-- CreateTable
CREATE TABLE `gym_center` (
    `center_id` INTEGER NOT NULL AUTO_INCREMENT,
    `center_name` VARCHAR(100) NOT NULL,
    `location` VARCHAR(255) NOT NULL,
    `contact_no` VARCHAR(16) NOT NULL,
    `manager_id` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`center_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `gym_center` ADD CONSTRAINT `gym_center_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `users`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
