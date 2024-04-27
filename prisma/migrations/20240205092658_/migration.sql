-- DropForeignKey
ALTER TABLE `usergroup` DROP FOREIGN KEY `UserGroup_groupId_fkey`;

-- DropForeignKey
ALTER TABLE `usergroup` DROP FOREIGN KEY `UserGroup_userId_fkey`;

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserGroup` ADD CONSTRAINT `UserGroup_groupId_fkey` FOREIGN KEY (`groupId`) REFERENCES `Group`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
