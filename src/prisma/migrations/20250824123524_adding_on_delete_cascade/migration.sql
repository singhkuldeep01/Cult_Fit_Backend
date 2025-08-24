-- DropForeignKey
ALTER TABLE `gym_center` DROP FOREIGN KEY `gym_center_manager_id_fkey`;

-- DropForeignKey
ALTER TABLE `users_roles` DROP FOREIGN KEY `users_roles_role_id_fkey`;

-- DropForeignKey
ALTER TABLE `users_roles` DROP FOREIGN KEY `users_roles_user_id_fkey`;

-- DropIndex
DROP INDEX `gym_center_manager_id_fkey` ON `gym_center`;

-- DropIndex
DROP INDEX `users_roles_role_id_fkey` ON `users_roles`;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `users_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `users_roles` ADD CONSTRAINT `users_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `gym_center` ADD CONSTRAINT `gym_center_manager_id_fkey` FOREIGN KEY (`manager_id`) REFERENCES `users`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
